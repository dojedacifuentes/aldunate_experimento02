import * as Phaser from 'phaser';

import { spritePath } from '@/lib/rpg/art/asset-paths.mjs';
import { on } from '@/lib/rpg/bus';
import {
  encuadreDeDos,
  encuadreDeUno,
  mereceMoverse,
  type Encuadre,
} from '@/lib/rpg/encuadre';
import type { FocusTarget } from '@/types/game';

/**
 * Sala de audiencias.
 *
 * Phaser dibuja el mundo: mobiliario, actores, cámara y retroalimentación
 * física (foco, destello, sacudida). Todo el texto, el HUD y las decisiones
 * viven en React, encima del canvas. La escena **no lee el store**: recibe
 * órdenes por el bus y no devuelve nada. Es lo que permitirá que el Capítulo 3
 * añada movimiento libre sin tocar el guion.
 *
 * Cámara: la escena encuadra **personas**, no muebles. Antes se plantaba en el
 * puesto declarado por el nodo y no se movía aunque contestaran tres personas
 * distintas; por eso casi ninguna transición cuajaba. Ahora cada línea dice
 * quién habla y a quién, y la cámara va con ella.
 *
 * Las hojas de sprites son las mismas del registro de personajes: 288×288,
 * celdas de 48 px, 6×6. Fila 0 abajo, 1 arriba, 2 izquierda, 3 derecha,
 * 4 hablar, 5 pensar.
 */

const ANCHO = 1280;
const ALTO = 720;
const CELDA = 48;

/**
 * Margen dibujado alrededor del mundo.
 *
 * Existe por la cámara, no por decoración. Con los límites pegados al mundo,
 * `Phaser` recorta el desplazamiento para no enseñar el vacío: a zoom 1.2 la
 * vista mide 600 px de alto y el centro de cámara sólo podía moverse entre
 * y=300 e y=420. El estrado está en y=176, así que **la cámara no podía
 * enfocar a los jueces**: quedaban siempre por encima del encuadre y, con el
 * recorte panorámico de D-027, fuera de pantalla.
 *
 * Con margen, el centro de cámara alcanza cualquier puesto de la sala y el
 * recorte deja de ser el problema, porque quien habla siempre está en el
 * centro del lienzo.
 */
const MARGEN = 300;

/** Paleta. Phaser no lee variables CSS: espeja `src/lib/rpg/art/palette.mjs`. */
const C = {
  ink: 0x12100f,
  charcoal: 0x1b1917,
  charcoalSoft: 0x2a2724,
  charcoalLift: 0x3a3632,
  ivory: 0xede6d6,
  ivoryDeep: 0xb9af99,
  burgundy: 0x8a2432,
  gold: 0xb78c30,
  stone: 0x6e6a63,
  stoneDim: 0x4c4945,
  slate: 0x2e3a4a,
} as const;

interface Puesto {
  x: number;
  y: number;
  /** Zoom que adopta la cámara al enfocar este puesto entero. */
  zoom: number;
}

const PUESTOS: Record<FocusTarget, Puesto> = {
  estrado: { x: 640, y: 176, zoom: 1.2 },
  testigo: { x: 968, y: 300, zoom: 1.4 },
  fiscalia: { x: 372, y: 452, zoom: 1.3 },
  defensa: { x: 908, y: 452, zoom: 1.3 },
  publico: { x: 640, y: 636, zoom: 1.25 },
  sala: { x: 640, y: 380, zoom: 1 },
};

/** Separación de los tres jueces sobre el estrado. */
const ASIENTOS_ESTRADO = [-136, 0, 136];

/** Nombre visible de cada personaje. La escena rotula a quien habla. */
export type Nombres = Record<string, string>;

/** Qué personaje ocupa cada puesto en el Capítulo 0. */
export interface Reparto {
  /** El tribunal es colegiado: tres. El primero preside. */
  estrado: string[];
  fiscalia: string;
  testigo: string;
  defensa: string;
  publico: string[];
}

interface Actor {
  sprite: Phaser.GameObjects.Sprite;
  clave: string;
  puesto: FocusTarget;
  x: number;
  y: number;
  /** Postura a la que vuelve cuando no habla. */
  reposo: string;
}

export class CourtroomScene extends Phaser.Scene {
  private reparto: Reparto;
  private nombres: Nombres;
  private actores = new Map<string, Actor>();
  private foco!: Phaser.GameObjects.Ellipse;
  /** Rótulo con el nombre de quien habla. Sin él no se sabe quién es quién. */
  private rotulo!: Phaser.GameObjects.Text;
  private rotuloFondo!: Phaser.GameObjects.Rectangle;
  private destello!: Phaser.GameObjects.Rectangle;
  private barrido!: Phaser.GameObjects.Rectangle;
  private desuscribir: (() => void)[] = [];
  private movimientoReducido = false;
  /** Último encuadre pedido. Evita repanear cuando no ha cambiado nada. */
  private encuadre: Encuadre = { x: 640, y: 380, zoom: 1 };

  constructor(reparto: Reparto, nombres: Nombres = {}) {
    super('courtroom');
    this.reparto = reparto;
    this.nombres = nombres;
  }

  preload(): void {
    const cargar = (id: string) => {
      if (this.textures.exists(id)) return;
      this.load.spritesheet(id, spritePath(id), { frameWidth: CELDA, frameHeight: CELDA });
    };
    [
      ...this.reparto.estrado,
      this.reparto.fiscalia,
      this.reparto.testigo,
      this.reparto.defensa,
      ...this.reparto.publico,
    ].forEach(cargar);
  }

  create(): void {
    this.movimientoReducido =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.cameras.main.setBackgroundColor(C.ink);
    this.cameras.main.setBounds(-MARGEN, -MARGEN, ANCHO + MARGEN * 2, ALTO + MARGEN * 2);

    this.dibujarSala();

    this.foco = this.add
      .ellipse(PUESTOS.sala.x, PUESTOS.sala.y, 420, 220, C.gold, 0.06)
      .setDepth(2);

    // El tribunal, de izquierda a derecha. El primero de la lista preside y va
    // al centro, que es donde se sienta quien preside.
    const [presidenta, ...vocales] = this.reparto.estrado;
    const ordenEstrado = [vocales[0], presidenta, vocales[1]].filter(Boolean);
    ordenEstrado.forEach((id, i) => {
      this.colocar(id, 'estrado', 'idle_down', ASIENTOS_ESTRADO[i] ?? 0);
    });

    this.colocar(this.reparto.fiscalia, 'fiscalia', 'idle_right');
    this.colocar(this.reparto.testigo, 'testigo', 'idle_left');
    this.colocar(this.reparto.defensa, 'defensa', 'idle_left');
    this.reparto.publico.forEach((id, i) => {
      this.colocar(id, 'publico', 'idle_up', (i - (this.reparto.publico.length - 1) / 2) * 96);
    });

    this.destello = this.add
      .rectangle(ANCHO / 2, ALTO / 2, ANCHO * 2, ALTO * 2, C.gold, 0)
      .setDepth(50)
      .setScrollFactor(0);

    this.barrido = this.add
      .rectangle(-40, ALTO / 2, 10, ALTO * 2, C.gold, 0)
      .setDepth(49);

    // Rótulo de quien habla. Va pegado al personaje, no a una esquina: en una
    // sala con ocho personas, un nombre en una esquina no señala a nadie.
    this.rotuloFondo = this.add
      .rectangle(0, 0, 10, 30, C.ink, 0.82)
      .setDepth(44)
      .setVisible(false);
    this.rotulo = this.add
      .text(0, 0, '', {
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: '20px',
        color: '#D6AE58',
      })
      .setOrigin(0.5, 1)
      .setDepth(45)
      .setVisible(false);

    this.conectarBus();
    this.enfocar('sala');
  }

  /* ── Construcción de la sala ────────────────────────────────────────── */

  private dibujarSala(): void {
    const g = this.add.graphics().setDepth(0);

    // El dibujo desborda el mundo por el margen de cámara: si la cámara puede
    // llegar hasta ahí, ahí tiene que haber sala.
    g.fillStyle(C.charcoal, 1).fillRect(-MARGEN, -MARGEN, ANCHO + MARGEN * 2, ALTO + MARGEN * 2);

    // Piso: baldosa alterna, muy tenue. Da escala sin competir con nadie.
    for (let y = 240; y < ALTO + MARGEN; y += 72) {
      for (let x = -MARGEN; x < ANCHO + MARGEN; x += 72) {
        const claro = ((x / 72 + y / 72) | 0) % 2 === 0;
        g.fillStyle(claro ? C.charcoalSoft : C.charcoal, 1).fillRect(x, y, 72, 72);
      }
    }

    // Muro del fondo y friso.
    g.fillStyle(C.ink, 1).fillRect(-MARGEN, -MARGEN, ANCHO + MARGEN * 2, 240 + MARGEN);
    g.fillStyle(C.charcoalLift, 1).fillRect(-MARGEN, 228, ANCHO + MARGEN * 2, 6);
    g.fillStyle(C.gold, 0.35).fillRect(-MARGEN, 234, ANCHO + MARGEN * 2, 2);

    // Paneles del muro.
    for (let x = -MARGEN + 40; x < ANCHO + MARGEN - 64; x += 168) {
      g.fillStyle(C.charcoal, 1).fillRect(x, 48, 120, 168);
      g.lineStyle(2, C.charcoalLift, 1).strokeRect(x, 48, 120, 168);
    }

    // Estrado: ancho para tres, con separadores entre los asientos.
    this.mueble(g, 640, 208, 620, 96, C.charcoalLift, C.gold);
    ASIENTOS_ESTRADO.slice(0, -1).forEach((dx, i) => {
      const medio = (dx + ASIENTOS_ESTRADO[i + 1]) / 2;
      g.fillStyle(C.ink, 0.55).fillRect(640 + medio - 2, 168, 4, 80);
    });

    // Testigo.
    this.mueble(g, 968, 332, 190, 72, C.charcoalSoft, C.stone);
    // Mesas de las partes.
    this.mueble(g, 372, 486, 300, 78, C.charcoalSoft, C.stone);
    this.mueble(g, 908, 486, 300, 78, C.charcoalSoft, C.gold);
    // Baranda del público.
    g.fillStyle(C.charcoalLift, 1).fillRect(120, 566, ANCHO - 240, 8);
    // Bancas.
    for (let i = 0; i < 3; i += 1) {
      this.mueble(g, 640, 620 + i * 44, 760, 24, C.charcoalSoft, C.stoneDim);
    }

    // Viñeta: dos rectángulos, no un shader. Suficiente y barato.
    const v = this.add.graphics().setDepth(40);
    v.fillStyle(C.ink, 0.45).fillRect(-MARGEN, -MARGEN, ANCHO + MARGEN * 2, 60 + MARGEN);
    v.fillStyle(C.ink, 0.5).fillRect(-MARGEN, ALTO - 70, ANCHO + MARGEN * 2, 70 + MARGEN);
  }

  private mueble(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    w: number,
    h: number,
    relleno: number,
    filete: number,
  ): void {
    const x = cx - w / 2;
    const y = cy - h / 2;
    g.fillStyle(C.ink, 1).fillRect(x + 4, y + 6, w, h);
    g.fillStyle(relleno, 1).fillRect(x, y, w, h);
    g.fillStyle(filete, 0.75).fillRect(x, y, w, 3);
  }

  /* ── Actores ────────────────────────────────────────────────────────── */

  private colocar(clave: string, puesto: FocusTarget, animacion: string, dx = 0): void {
    if (!clave || !this.textures.exists(clave)) return;
    const p = PUESTOS[puesto];
    const x = p.x + dx;
    this.crearAnimaciones(clave);

    const sprite = this.add
      .sprite(x, p.y, clave)
      .setScale(3)
      .setOrigin(0.5, 0.85)
      .setDepth(10 + Math.round(p.y / 10));
    sprite.play(`${clave}:${animacion}`);

    // Sombra de contacto: sin ella los sprites flotan sobre la baldosa.
    this.add.ellipse(x, p.y + 6, 62, 16, C.ink, 0.45).setDepth(sprite.depth - 1);

    this.actores.set(clave, { sprite, clave, puesto, x, y: p.y, reposo: animacion });
  }

  private crearAnimaciones(clave: string): void {
    const def: [string, number, number[], number][] = [
      ['idle_down', 0, [4, 5], 2],
      ['idle_up', 1, [4, 5], 2],
      ['idle_left', 2, [4, 5], 2],
      ['idle_right', 3, [4, 5], 2],
      ['talk', 4, [0, 1, 2, 3], 6],
      ['thinking', 5, [0, 1, 2, 3], 3],
    ];
    def.forEach(([nombre, fila, columnas, fps]) => {
      const key = `${clave}:${nombre}`;
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: columnas.map((c) => ({ key: clave, frame: fila * 6 + c })),
        frameRate: fps,
        repeat: -1,
      });
    });
  }

  /* ── Órdenes ────────────────────────────────────────────────────────── */

  private conectarBus(): void {
    this.desuscribir.push(
      on('enfocar', ({ objetivo }) => this.enfocar(objetivo)),
      on('hablar', ({ personaje, puesto, hacia }) => this.hablar(personaje, puesto, hacia)),
      on('reaccionar', ({ personaje, tipo }) => this.reaccionar(personaje, tipo)),
      on('acierto', () => this.retroalimentar(C.gold, 0.22, 4)),
      on('fallo', () => this.retroalimentar(C.burgundy, 0.28, 9)),
      on('escanear', () => this.escanear()),
    );
  }

  /* ── Cámara ─────────────────────────────────────────────────────────── */

  /**
   * Mueve la cámara sólo si hace falta.
   *
   * Dos líneas seguidas de la misma persona pedían el mismo encuadre y la
   * cámara volvía a arrancar el tween cada vez: un temblor pequeño y constante
   * que era buena parte de lo que se veía mal. Con umbral, quien no se mueve no
   * mueve la cámara.
   */
  private encuadrar(x: number, y: number, zoom: number, duracion = 260): void {
    const nuevo = { x, y, zoom };
    if (!mereceMoverse(this.encuadre, nuevo)) return;

    this.encuadre = nuevo;
    const camara = this.cameras.main;
    const ms = this.movimientoReducido ? 0 : duracion;

    camara.pan(x, y, ms, 'Sine.easeInOut');
    camara.zoomTo(zoom, ms, 'Sine.easeInOut');

    this.tweens.add({
      targets: this.foco,
      x,
      y,
      duration: ms,
      ease: 'Sine.easeInOut',
    });
  }

  private enfocar(objetivo: FocusTarget): void {
    const p = PUESTOS[objetivo];
    this.foco.setFillStyle(C.gold, objetivo === 'sala' ? 0.05 : 0.1);
    this.encuadrar(p.x, p.y, p.zoom, 320);
  }

  /**
   * Encuadra a una persona, o a dos si una le habla a la otra.
   *
   * Con dos, la cámara va al punto medio y se abre lo justo para que quepan
   * ambas dentro de la ventana segura. Es lo que hace legible un
   * contrainterrogatorio: se ve quién pregunta y quién tiene que contestar.
   */
  private encuadrarPersonas(a: Actor, b?: Actor): void {
    if (!b || b === a) {
      const e = encuadreDeUno(a, PUESTOS[a.puesto].zoom);
      this.encuadrar(e.x, e.y, e.zoom);
      return;
    }
    const e = encuadreDeDos(a, b);
    this.encuadrar(e.x, e.y, e.zoom, 300);
  }

  /**
   * Hace hablar a una persona concreta y devuelve a las demás a su reposo.
   *
   * Por persona y no por puesto: en el estrado hay tres jueces y que gesticulen
   * los tres a la vez cuando habla uno es exactamente lo que delata que esto es
   * un decorado.
   */
  private hablar(personaje: string, puesto: FocusTarget, hacia?: string): void {
    const quien = this.actores.get(personaje);
    const destino = this.resolver(hacia);

    this.actores.forEach((actor) => {
      const hablando = actor.clave === personaje;
      actor.sprite.play(`${actor.clave}:${hablando ? 'talk' : actor.reposo}`, true);
      // Quien no habla se apaga un poco. Es la diferencia entre una sala con
      // ocho personas y una sala con ocho personas donde se sabe cuál habla.
      actor.sprite.setAlpha(hablando ? 1 : 0.55);
    });

    // Quien escucha no se queda de piedra: se gira un momento hacia quien habla.
    if (destino) destino.sprite.play(`${destino.clave}:thinking`, true);

    // El encuadre primero: el rótulo se sujeta a la banda visible y necesita
    // saber dónde va a quedar la cámara, no dónde estaba.
    if (quien) this.encuadrarPersonas(quien, destino);
    else this.enfocar(puesto); // Personaje sin cuerpo en la sala: EVA.

    this.rotular(quien);
  }

  /** Pone el nombre de quien habla justo encima de su cabeza. */
  private rotular(actor?: Actor): void {
    const nombre = actor && (this.nombres[actor.clave] ?? '');
    if (!actor || !nombre) {
      this.rotulo.setVisible(false);
      this.rotuloFondo.setVisible(false);
      return;
    }

    /*
     * El rótulo va sobre la cabeza, pero sujeto a la banda visible.
     *
     * Con el recorte panorámico sólo se ve una franja alrededor del centro de
     * cámara, y esa franja se estrecha cuanto más se acerca el zoom. Sin
     * sujetarlo, el rótulo desaparecía justo cuando más falta hace: en los
     * planos de dos, donde hay dos personas y hay que saber cuál habla.
     *
     * BANDA_SEGURA es deliberadamente conservadora —la mitad del alto que se
     * ve en el peor caso—, porque la escena no sabe cuánto la recorta la
     * cabina y prefiere pecar de prudente.
     */
    const BANDA_SEGURA = 110;
    const alcance = BANDA_SEGURA / this.encuadre.zoom;
    const y = Phaser.Math.Clamp(
      actor.y - 96,
      this.encuadre.y - alcance + 24,
      this.encuadre.y + alcance,
    );
    this.rotulo.setText(nombre.toUpperCase()).setPosition(actor.x, y).setVisible(true);
    this.rotuloFondo
      .setSize(this.rotulo.width + 20, this.rotulo.height + 10)
      .setPosition(actor.x, y - this.rotulo.height / 2 - 1)
      .setVisible(true);
  }

  /**
   * Resuelve a quién se dirige una línea.
   *
   * Puede venir un personaje —«a Naveas»— o un puesto —«a la defensa»—, porque
   * quién ocupa la defensa depende del avatar elegido y el guion no lo sabe.
   */
  private resolver(referencia?: string): Actor | undefined {
    if (!referencia) return undefined;
    const porNombre = this.actores.get(referencia);
    if (porNombre) return porNombre;
    for (const actor of this.actores.values()) {
      if (actor.puesto === referencia) return actor;
    }
    return undefined;
  }

  /** Un gesto corto y sin diálogo. Barato, y es lo que da vida a la sala. */
  private reaccionar(personaje: string, tipo: 'asentir' | 'negar' | 'sobresalto'): void {
    const actor = this.actores.get(personaje);
    if (!actor || this.movimientoReducido) return;

    const s = actor.sprite;
    if (tipo === 'asentir') {
      this.tweens.add({ targets: s, y: actor.y + 6, duration: 130, yoyo: true, repeat: 1 });
      return;
    }
    if (tipo === 'negar') {
      this.tweens.add({ targets: s, x: actor.x - 7, duration: 90, yoyo: true, repeat: 2 });
      return;
    }
    this.tweens.add({ targets: s, y: actor.y - 12, duration: 110, yoyo: true, ease: 'Quad.easeOut' });
  }

  private retroalimentar(color: number, alpha: number, sacudida: number): void {
    this.destello.setFillStyle(color, alpha);
    this.tweens.add({
      targets: this.destello,
      fillAlpha: 0,
      duration: this.movimientoReducido ? 0 : 340,
      ease: 'Quad.easeOut',
    });
    if (!this.movimientoReducido && sacudida > 0) {
      this.cameras.main.shake(180, sacudida / 2200);
    }
  }

  private escanear(): void {
    if (this.movimientoReducido) {
      this.retroalimentar(C.gold, 0.12, 0);
      return;
    }
    this.barrido.setX(-40).setFillStyle(C.gold, 0.5);
    this.tweens.add({
      targets: this.barrido,
      x: ANCHO + 40,
      duration: 700,
      ease: 'Quad.easeInOut',
      onComplete: () => this.barrido.setFillStyle(C.gold, 0),
    });
  }

  shutdown(): void {
    this.desuscribir.forEach((fn) => fn());
    this.desuscribir = [];
    this.actores.clear();
  }
}

export const DIMENSIONES = { ANCHO, ALTO };
