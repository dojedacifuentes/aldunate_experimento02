import * as Phaser from 'phaser';

import { spritePath } from '@/lib/rpg/art/asset-paths.mjs';
import { on } from '@/lib/rpg/bus';
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
 * Las hojas de sprites son las mismas del registro de personajes: 288×288,
 * celdas de 48 px, 6×6. Fila 0 abajo, 1 arriba, 2 izquierda, 3 derecha,
 * 4 hablar, 5 pensar.
 */

const ANCHO = 1280;
const ALTO = 720;
const CELDA = 48;

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
  /** Zoom que adopta la cámara al enfocar este puesto. */
  zoom: number;
}

const PUESTOS: Record<FocusTarget, Puesto> = {
  estrado: { x: 640, y: 168, zoom: 1.35 },
  testigo: { x: 968, y: 300, zoom: 1.4 },
  fiscalia: { x: 372, y: 452, zoom: 1.3 },
  defensa: { x: 908, y: 452, zoom: 1.3 },
  publico: { x: 640, y: 636, zoom: 1.25 },
  sala: { x: 640, y: 380, zoom: 1 },
};

/** Qué personaje ocupa cada puesto en el Capítulo 0. */
export interface Reparto {
  estrado: string;
  fiscalia: string;
  testigo: string;
  defensa: string;
  publico: string[];
}

interface Actor {
  sprite: Phaser.GameObjects.Sprite;
  clave: string;
}

type ActoresPorPuesto = Partial<Record<FocusTarget, Actor[]>>;

export class CourtroomScene extends Phaser.Scene {
  private reparto: Reparto;
  private actores: ActoresPorPuesto = {};
  private foco!: Phaser.GameObjects.Ellipse;
  private destello!: Phaser.GameObjects.Rectangle;
  private barrido!: Phaser.GameObjects.Rectangle;
  private desuscribir: (() => void)[] = [];
  private movimientoReducido = false;

  constructor(reparto: Reparto) {
    super('courtroom');
    this.reparto = reparto;
  }

  preload(): void {
    const cargar = (id: string) => {
      if (this.textures.exists(id)) return;
      this.load.spritesheet(id, spritePath(id), { frameWidth: CELDA, frameHeight: CELDA });
    };
    [
      this.reparto.estrado,
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
    this.cameras.main.setBounds(0, 0, ANCHO, ALTO);

    this.dibujarSala();

    this.foco = this.add
      .ellipse(PUESTOS.sala.x, PUESTOS.sala.y, 420, 220, C.gold, 0.06)
      .setDepth(2);

    this.colocar(this.reparto.estrado, 'estrado', 'idle_down');
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

    this.conectarBus();
    this.enfocar('sala');
  }

  /* ── Construcción de la sala ────────────────────────────────────────── */

  private dibujarSala(): void {
    const g = this.add.graphics().setDepth(0);

    g.fillStyle(C.charcoal, 1).fillRect(0, 0, ANCHO, ALTO);

    // Piso: baldosa alterna, muy tenue. Da escala sin competir con nadie.
    for (let y = 240; y < ALTO; y += 72) {
      for (let x = 0; x < ANCHO; x += 72) {
        const claro = ((x / 72 + y / 72) | 0) % 2 === 0;
        g.fillStyle(claro ? C.charcoalSoft : C.charcoal, 1).fillRect(x, y, 72, 72);
      }
    }

    // Muro del fondo y friso.
    g.fillStyle(C.ink, 1).fillRect(0, 0, ANCHO, 240);
    g.fillStyle(C.charcoalLift, 1).fillRect(0, 228, ANCHO, 6);
    g.fillStyle(C.gold, 0.35).fillRect(0, 234, ANCHO, 2);

    // Paneles del muro.
    for (let x = 64; x < ANCHO - 64; x += 168) {
      g.fillStyle(C.charcoal, 1).fillRect(x, 48, 120, 168);
      g.lineStyle(2, C.charcoalLift, 1).strokeRect(x, 48, 120, 168);
    }

    // Estrado.
    this.mueble(g, 640, 200, 460, 92, C.charcoalLift, C.gold);
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
    v.fillStyle(C.ink, 0.45).fillRect(0, 0, ANCHO, 60);
    v.fillStyle(C.ink, 0.5).fillRect(0, ALTO - 70, ANCHO, 70);
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

  private colocar(
    clave: string,
    puesto: FocusTarget,
    animacion: string,
    dx = 0,
  ): void {
    if (!this.textures.exists(clave)) return;
    const p = PUESTOS[puesto];
    this.crearAnimaciones(clave);

    const sprite = this.add
      .sprite(p.x + dx, p.y, clave)
      .setScale(3)
      .setOrigin(0.5, 0.85)
      .setDepth(10 + Math.round(p.y / 10));
    sprite.play(`${clave}:${animacion}`);

    // Sombra de contacto: sin ella los sprites flotan sobre la baldosa.
    this.add
      .ellipse(p.x + dx, p.y + 6, 62, 16, C.ink, 0.45)
      .setDepth(sprite.depth - 1);

    const lista = this.actores[puesto] ?? [];
    lista.push({ sprite, clave });
    this.actores[puesto] = lista;
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
      on('hablar', ({ puesto }) => this.hablar(puesto)),
      on('acierto', () => this.retroalimentar(C.gold, 0.22, 4)),
      on('fallo', () => this.retroalimentar(C.burgundy, 0.28, 9)),
      on('escanear', () => this.escanear()),
    );
  }

  private enfocar(objetivo: FocusTarget): void {
    const p = PUESTOS[objetivo];
    const camara = this.cameras.main;
    const duracion = this.movimientoReducido ? 0 : 520;

    camara.pan(p.x, p.y, duracion, 'Cubic.easeInOut');
    camara.zoomTo(p.zoom, duracion, 'Cubic.easeInOut');

    this.tweens.add({
      targets: this.foco,
      x: p.x,
      y: p.y,
      fillAlpha: objetivo === 'sala' ? 0.05 : 0.12,
      duration: duracion,
      ease: 'Cubic.easeInOut',
    });
  }

  /**
   * Hace hablar a quien ocupa un puesto y devuelve a los demás a su reposo.
   * Nadie gesticula fuera de turno: en una sala, eso se nota.
   */
  private hablar(puesto: FocusTarget): void {
    (Object.keys(this.actores) as FocusTarget[]).forEach((p) => {
      this.actores[p]?.forEach((actor) => {
        const anim = p === puesto ? 'talk' : reposoDe(p);
        actor.sprite.play(`${actor.clave}:${anim}`, true);
      });
    });
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
    this.actores = {};
  }
}

/** Postura de reposo según hacia dónde mira cada puesto. */
function reposoDe(puesto: FocusTarget): string {
  switch (puesto) {
    case 'estrado':
      return 'idle_down';
    case 'fiscalia':
      return 'idle_right';
    case 'testigo':
    case 'defensa':
      return 'idle_left';
    default:
      return 'idle_up';
  }
}

export const DIMENSIONES = { ANCHO, ALTO };
