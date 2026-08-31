/**
 * Versión de un solo archivo del Capítulo 0.
 *
 * Misma escena, mismo guion y mismas reglas que la aplicación Next.js: el
 * contenido se vuelca desde `src/data/rpg` en tiempo de compilación, de modo
 * que esta versión no puede desincronizarse del juego sin que alguien lo note.
 *
 * Lo que cambia es sólo la envoltura: React y el enrutador se sustituyen por
 * DOM directo, y los assets viajan incrustados. Ni una petición de red: ni
 * scripts, ni imágenes, ni tipografías.
 */
(() => {
  'use strict';

  const D = window.__AUDACES__;
  const ART = window.__ART__;
  const Phaser = window.Phaser;

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const pantalla = $('#pantalla');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────── Estado y guardado ─────────────────────────── */

  const CLAVE = 'audaces-save';
  const VERSION = 1;

  const INICIAL = () => ({
    saveVersion: VERSION,
    player: null,
    nodeId: null,
    evidencias: [],
    flags: {},
    impulso: 0,
    combo: 0,
    decisiones: [],
    finales: [],
  });

  let S = INICIAL();

  function cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (!crudo) return;
      const datos = JSON.parse(crudo);
      if (!datos || typeof datos !== 'object') return;
      if (typeof datos.saveVersion !== 'number' || datos.saveVersion > VERSION) return;
      S = { ...INICIAL(), ...datos, saveVersion: VERSION };
    } catch {
      /* Un save ilegible se descarta: perder la partida es malo, no arrancar es peor. */
    }
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(S));
    } catch {
      /* Modo privado o almacenamiento bloqueado: se juega igual, sin guardar. */
    }
  }

  /* ──────────────────────────── Puntuación ──────────────────────────────── */

  const UMBRALES = [0, 120, 300, 560, 900, 1320, 1820, 2400];
  const nivelDesde = (xp) => UMBRALES.reduce((n, u, i) => (xp >= u ? i + 1 : n), 1);
  const progresoNivel = (xp) => {
    const n = nivelDesde(xp);
    if (n >= UMBRALES.length) return 1;
    return Math.min(1, Math.max(0, (xp - UMBRALES[n - 1]) / (UMBRALES[n] - UMBRALES[n - 1])));
  };
  const multiplicador = (c) => (c >= 4 ? 4 : c >= 3 ? 3 : c >= 2 ? 2 : 1);

  function aplicar(efectos, acierta) {
    const combo = acierta ? S.combo + 1 : 0;
    if (efectos && efectos.xp) S.player.xp += Math.round(efectos.xp * multiplicador(S.combo));
    if (efectos && efectos.stats) {
      for (const k of Object.keys(efectos.stats)) {
        S.player.stats[k] = Math.max(0, S.player.stats[k] + efectos.stats[k]);
      }
    }
    if (efectos && efectos.flag) S.flags[efectos.flag] = true;
    if (efectos && efectos.otorgaEvidencia) otorgar(efectos.otorgaEvidencia);
    S.combo = combo;
    S.impulso = acierta ? Math.min(100, S.impulso + 34) : Math.floor(S.impulso / 2);
    S.player.nivel = nivelDesde(S.player.xp);
    guardar();
  }

  function otorgar(id) {
    if (S.evidencias.some((e) => e.id === id)) return;
    const pieza = D.evidenceCatalog.find((e) => e.id === id);
    if (pieza) S.evidencias.push(pieza);
  }

  /* ──────────────────────────── Escena Phaser ───────────────────────────── */

  const ANCHO = 1280;
  const ALTO = 720;

  const C = {
    ink: 0x12100f,
    charcoal: 0x1b1917,
    charcoalSoft: 0x2a2724,
    charcoalLift: 0x3a3632,
    burgundy: 0x8a2432,
    gold: 0xb78c30,
    stone: 0x6e6a63,
    stoneDim: 0x4c4945,
  };

  const PUESTOS = {
    estrado: { x: 640, y: 168, zoom: 1.35 },
    testigo: { x: 968, y: 300, zoom: 1.4 },
    fiscalia: { x: 372, y: 452, zoom: 1.3 },
    defensa: { x: 908, y: 452, zoom: 1.3 },
    publico: { x: 640, y: 636, zoom: 1.25 },
    sala: { x: 640, y: 380, zoom: 1 },
  };

  const PUESTO_DE = {
    judge_achurra: 'estrado',
    prosecutor_naveas: 'fiscalia',
    witness_zapata: 'testigo',
    player_tomas: 'defensa',
    player_renata: 'defensa',
    client_marta: 'defensa',
    eva: 'defensa',
    director_sofia: 'publico',
    rival_ignacio: 'publico',
    counterparty_hector: 'publico',
  };

  const reposoDe = (p) =>
    p === 'estrado' ? 'idle_down' : p === 'fiscalia' ? 'idle_right' : p === 'publico' ? 'idle_up' : 'idle_left';

  let juego = null;

  /**
   * La escena viva, o null si todavía no terminó de crearse.
   * Se pregunta al juego en vez de guardar una referencia: así no queda una
   * escena muerta apuntada después de destruir la instancia.
   */
  const sala = () => {
    const s = juego && juego.scene.getScene('sala');
    return s && s.foco ? s : null;
  };

  class Sala extends Phaser.Scene {
    constructor(reparto) {
      super('sala');
      this.reparto = reparto;
      this.actores = {};
    }

    preload() {
      const ids = [
        this.reparto.estrado,
        this.reparto.fiscalia,
        this.reparto.testigo,
        this.reparto.defensa,
        ...this.reparto.publico,
      ];
      for (const id of ids) {
        if (!ART.sprites[id] || this.textures.exists(id)) continue;
        this.load.spritesheet(id, ART.sprites[id], { frameWidth: 48, frameHeight: 48 });
      }
    }

    create() {
      this.cameras.main.setBackgroundColor(C.ink);
      this.cameras.main.setBounds(0, 0, ANCHO, ALTO);
      this.dibujarSala();

      this.foco = this.add.ellipse(PUESTOS.sala.x, PUESTOS.sala.y, 420, 220, C.gold, 0.06).setDepth(2);

      this.colocar(this.reparto.estrado, 'estrado');
      this.colocar(this.reparto.fiscalia, 'fiscalia');
      this.colocar(this.reparto.testigo, 'testigo');
      this.colocar(this.reparto.defensa, 'defensa');
      this.reparto.publico.forEach((id, i) =>
        this.colocar(id, 'publico', (i - (this.reparto.publico.length - 1) / 2) * 96),
      );

      this.destello = this.add
        .rectangle(ANCHO / 2, ALTO / 2, ANCHO * 2, ALTO * 2, C.gold, 0)
        .setDepth(50)
        .setScrollFactor(0);
      this.barrido = this.add.rectangle(-40, ALTO / 2, 10, ALTO * 2, C.gold, 0).setDepth(49);

      this.enfocar('sala');
    }

    mueble(g, cx, cy, w, h, relleno, filete) {
      const x = cx - w / 2;
      const y = cy - h / 2;
      g.fillStyle(C.ink, 1).fillRect(x + 4, y + 6, w, h);
      g.fillStyle(relleno, 1).fillRect(x, y, w, h);
      g.fillStyle(filete, 0.75).fillRect(x, y, w, 3);
    }

    dibujarSala() {
      const g = this.add.graphics().setDepth(0);
      g.fillStyle(C.charcoal, 1).fillRect(0, 0, ANCHO, ALTO);
      for (let y = 240; y < ALTO; y += 72) {
        for (let x = 0; x < ANCHO; x += 72) {
          const claro = ((x / 72 + y / 72) | 0) % 2 === 0;
          g.fillStyle(claro ? C.charcoalSoft : C.charcoal, 1).fillRect(x, y, 72, 72);
        }
      }
      g.fillStyle(C.ink, 1).fillRect(0, 0, ANCHO, 240);
      g.fillStyle(C.charcoalLift, 1).fillRect(0, 228, ANCHO, 6);
      g.fillStyle(C.gold, 0.35).fillRect(0, 234, ANCHO, 2);
      for (let x = 64; x < ANCHO - 64; x += 168) {
        g.fillStyle(C.charcoal, 1).fillRect(x, 48, 120, 168);
        g.lineStyle(2, C.charcoalLift, 1).strokeRect(x, 48, 120, 168);
      }
      this.mueble(g, 640, 200, 460, 92, C.charcoalLift, C.gold);
      this.mueble(g, 968, 332, 190, 72, C.charcoalSoft, C.stone);
      this.mueble(g, 372, 486, 300, 78, C.charcoalSoft, C.stone);
      this.mueble(g, 908, 486, 300, 78, C.charcoalSoft, C.gold);
      g.fillStyle(C.charcoalLift, 1).fillRect(120, 566, ANCHO - 240, 8);
      for (let i = 0; i < 3; i += 1) this.mueble(g, 640, 620 + i * 44, 760, 24, C.charcoalSoft, C.stoneDim);
      const v = this.add.graphics().setDepth(40);
      v.fillStyle(C.ink, 0.45).fillRect(0, 0, ANCHO, 60);
      v.fillStyle(C.ink, 0.5).fillRect(0, ALTO - 70, ANCHO, 70);
    }

    animaciones(clave) {
      const def = [
        ['idle_down', 0, [4, 5], 2],
        ['idle_up', 1, [4, 5], 2],
        ['idle_left', 2, [4, 5], 2],
        ['idle_right', 3, [4, 5], 2],
        ['talk', 4, [0, 1, 2, 3], 6],
      ];
      for (const [nombre, fila, cols, fps] of def) {
        const key = clave + ':' + nombre;
        if (this.anims.exists(key)) continue;
        this.anims.create({
          key,
          frames: cols.map((c) => ({ key: clave, frame: fila * 6 + c })),
          frameRate: fps,
          repeat: -1,
        });
      }
    }

    colocar(clave, puesto, dx = 0) {
      if (!this.textures.exists(clave)) return;
      const p = PUESTOS[puesto];
      this.animaciones(clave);
      const sprite = this.add
        .sprite(p.x + dx, p.y, clave)
        .setScale(3)
        .setOrigin(0.5, 0.85)
        .setDepth(10 + Math.round(p.y / 10));
      sprite.play(clave + ':' + reposoDe(puesto));
      this.add.ellipse(p.x + dx, p.y + 6, 62, 16, C.ink, 0.45).setDepth(sprite.depth - 1);
      (this.actores[puesto] = this.actores[puesto] || []).push({ sprite, clave });
    }

    enfocar(objetivo) {
      const p = PUESTOS[objetivo] || PUESTOS.sala;
      const d = reducido ? 0 : 520;
      this.cameras.main.pan(p.x, p.y, d, 'Cubic.easeInOut');
      this.cameras.main.zoomTo(p.zoom, d, 'Cubic.easeInOut');
      this.tweens.add({
        targets: this.foco,
        x: p.x,
        y: p.y,
        fillAlpha: objetivo === 'sala' ? 0.05 : 0.12,
        duration: d,
        ease: 'Cubic.easeInOut',
      });
    }

    hablar(puesto) {
      for (const p of Object.keys(this.actores)) {
        for (const a of this.actores[p]) {
          a.sprite.play(a.clave + ':' + (p === puesto ? 'talk' : reposoDe(p)), true);
        }
      }
    }

    retroalimentar(color, alpha, sacudida) {
      this.destello.setFillStyle(color, alpha);
      this.tweens.add({ targets: this.destello, fillAlpha: 0, duration: reducido ? 0 : 340, ease: 'Quad.easeOut' });
      if (!reducido && sacudida) this.cameras.main.shake(180, sacudida / 2200);
    }

    escanear() {
      if (reducido) return this.retroalimentar(C.gold, 0.12, 0);
      this.barrido.setX(-40).setFillStyle(C.gold, 0.5);
      this.tweens.add({
        targets: this.barrido,
        x: ANCHO + 40,
        duration: 700,
        ease: 'Quad.easeInOut',
        onComplete: () => this.barrido.setFillStyle(C.gold, 0),
      });
    }
  }

  const bus = {
    enfocar: (o) => sala() && sala().enfocar(o),
    hablar: (p) => sala() && sala().hablar(p),
    acierto: () => sala() && sala().retroalimentar(C.gold, 0.22, 4),
    fallo: () => sala() && sala().retroalimentar(C.burgundy, 0.28, 9),
    escanear: () => sala() && sala().escanear(),
  };

  function montarEscena(host) {
    const reparto = {
      estrado: 'judge_achurra',
      fiscalia: 'prosecutor_naveas',
      testigo: 'witness_zapata',
      defensa: S.player.avatar,
      publico: ['director_sofia', 'rival_ignacio', 'counterparty_hector'],
    };
    juego = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host,
      width: ANCHO,
      height: ALTO,
      backgroundColor: '#12100F',
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [new Sala(reparto)],
    });
  }

  function desmontarEscena() {
    if (juego) juego.destroy(true);
    juego = null;
  }

  /* ─────────────────────────────── Retratos ─────────────────────────────── */

  function retrato(id, mood) {
    const def = D.personajes[id];
    const pedido = mood && def && def.expressions.includes(mood) ? mood : 'neutral';
    return ART.portraits[id + '-' + pedido] || ART.portraits[id + '-neutral'] || '';
  }

  const esc = (t) =>
    String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ─────────────────────────────── Pantallas ────────────────────────────── */

  function irA(nodeId) {
    S.nodeId = nodeId;
    guardar();
    renderJuego();
  }

  function portada() {
    desmontarEscena();
    const hay = Boolean(S.player && S.nodeId);
    pantalla.innerHTML = `
      <main class="hoja">
        <p class="mono oro">RPG jurídico chileno · alpha 0.1</p>
        <h1 class="titulo">La Ley de los Audaces</h1>
        <p class="entrada">Capítulo 0: gane un juicio. Es lo único que tiene que hacer hoy,
        y es lo último que le va a salir bien.</p>
        <div class="botonera">
          <button class="mono primario" id="b-nueva">Nueva partida</button>
          ${hay ? '<button class="mono secundario" id="b-seguir">Continuar</button>' : ''}
        </div>
        <p class="pie">Ficción. Personajes, empresa, documentos, tribunal y causa son inventados.
        Las referencias normativas van rotuladas según su estado de verificación y ninguna se
        presenta como Derecho vigente sin contraste. Esto no es asesoría jurídica.</p>
      </main>`;
    $('#b-nueva').onclick = () => {
      S = INICIAL();
      creacion();
    };
    if (hay) $('#b-seguir').onclick = () => renderJuego();
  }

  function creacion() {
    desmontarEscena();
    let avatar = 'player_tomas';
    let espec = 'litigacion';

    pantalla.innerHTML = `
      <main class="hoja">
        <p class="mono oro">Capítulo 0 · antes de entrar</p>
        <h1 class="titulo chico">¿Quién defiende hoy?</h1>
        <p class="entrada">Tres decisiones. Ninguna es cosmética: la especialidad cambia lo que
        podrá hacer dentro de la sala.</p>

        <label class="mono gris" for="nombre">Nombre</label>
        <input id="nombre" maxlength="32" placeholder="Como quiere que lo llame el tribunal" />

        <p class="mono gris sep">Avatar</p>
        <div class="rejilla dos" id="avatares">
          ${D.avatares
            .map(
              (a) => `<button class="opcion avatar" data-id="${a.id}">
                <img alt="" src="${retrato(a.id, 'neutral')}" />
                <span><strong>${esc(a.label)}</strong><em>${esc(a.blurb)}</em></span>
              </button>`,
            )
            .join('')}
        </div>

        <p class="mono gris sep">Especialidad</p>
        <div class="rejilla tres" id="especialidades">
          ${D.especialidades
            .map(
              (e) => `<button class="opcion" data-id="${e.id}">
                <span class="mono oro">${esc(e.ventajaTexto)}</span>
                <strong>${esc(e.nombre)}</strong>
                <em>${esc(e.lema)}</em>
                <span class="gris">${esc(e.descripcion)}</span>
              </button>`,
            )
            .join('')}
        </div>

        <button class="mono primario grande" id="b-entrar">Entrar a la sala</button>
      </main>`;

    const marcar = (contenedor, valor) => {
      contenedor.querySelectorAll('.opcion').forEach((b) => {
        b.dataset.elegida = String(b.dataset.id === valor);
      });
    };
    const cAv = $('#avatares');
    const cEs = $('#especialidades');
    marcar(cAv, avatar);
    marcar(cEs, espec);
    cAv.onclick = (e) => {
      const b = e.target.closest('.opcion');
      if (b) {
        avatar = b.dataset.id;
        marcar(cAv, avatar);
      }
    };
    cEs.onclick = (e) => {
      const b = e.target.closest('.opcion');
      if (b) {
        espec = b.dataset.id;
        marcar(cEs, espec);
      }
    };

    $('#b-entrar').onclick = () => {
      const perfil = D.especialidades.find((e) => e.id === espec);
      const stats = { ...D.statsBase };
      for (const k of Object.keys(perfil.ventaja)) stats[k] += perfil.ventaja[k];
      S.player = {
        nombre: ($('#nombre').value || '').trim() || 'Sin nombre',
        avatar,
        especialidad: espec,
        stats,
        xp: 0,
        nivel: 1,
      };
      irA(D.prologo.inicio);
    };
  }

  /* ───────────────────────────── Bucle de juego ─────────────────────────── */

  let cola = [];
  let alFinal = null;

  function colaDeEntrada(nodo) {
    const items = [];
    if (nodo.kind === 'dialogo') {
      for (const t of nodo.lines) items.push({ tipo: 'dialogo', id: nodo.speaker, mood: nodo.mood, texto: t });
    }
    if (nodo.eva) items.push({ tipo: 'dialogo', id: 'eva', texto: nodo.eva });
    return items;
  }

  function narrar(textos, despues) {
    cola = textos.map((t) => ({ tipo: 'narracion', texto: t }));
    alFinal = despues;
    pintarPanel();
  }

  function avanzar() {
    if (cola.length <= 1) {
      cola = [];
      const fn = alFinal;
      alFinal = null;
      if (fn) fn();
      else pintarPanel();
      return;
    }
    cola = cola.slice(1);
    pintarPanel();
  }

  function renderJuego() {
    const nodo = D.prologo.nodos[S.nodeId];
    if (!nodo) return portada();

    if (!$('.juego')) {
      pantalla.innerHTML = `
        <div class="juego">
          <div class="col">
            <div class="escena"><div id="host"></div></div>
            <div id="panel"></div>
          </div>
          <aside id="hud"></aside>
        </div>`;
      montarEscena($('#host'));
    }

    cola = colaDeEntrada(nodo);
    alFinal = nodo.kind === 'dialogo' ? () => irA(nodo.next) : null;
    bus.enfocar(nodo.focus || 'sala');
    pintarHud();
    pintarPanel();
  }

  function pintarHud() {
    const p = S.player;
    const mult = multiplicador(S.combo);
    $('#hud').innerHTML = `
      <header class="hud-cab">
        <img alt="" src="${retrato(p.avatar, 'neutral')}" />
        <div><p class="nombre">${esc(p.nombre)}</p>
        <p class="mono gris">Nivel ${p.nivel} · ${p.xp} XP</p></div>
      </header>
      <div class="medidor"><div class="mono gris fila"><span>Nivel</span><span>${Math.round(
        progresoNivel(p.xp) * 100,
      )}%</span></div><div class="barra"><span style="width:${progresoNivel(p.xp) * 100}%"></span></div></div>
      <div class="medidor"><div class="mono gris fila"><span>Impulso</span><span style="color:${
        mult > 1 ? 'var(--gold-lift)' : 'var(--stone)'
      }">${mult > 1 ? 'combo ×' + mult : '—'}</span></div>
      <div class="barra"><span style="width:${S.impulso}%;background:${
        mult > 1 ? 'var(--gold-lift)' : 'var(--gold)'
      }"></span></div></div>
      <div>
        <p class="mono gris">Expediente · ${S.evidencias.length}</p>
        <ul class="expediente">
          ${
            S.evidencias.length === 0
              ? '<li class="vacio">Todavía nada que proyectar.</li>'
              : S.evidencias
                  .map((e) => `<li><strong>${esc(e.nombre)}</strong><span>${esc(e.resumen)}</span></li>`)
                  .join('')
          }
        </ul>
      </div>
      <dl class="stats mono gris">
        ${[
          ['Arg', p.stats.argumentacion],
          ['Inv', p.stats.investigacion],
          ['Neg', p.stats.negociacion],
          ['Est', p.stats.estrategia],
          ['Int', p.stats.integridad],
          ['Pre', p.stats.prestigio],
        ]
          .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
          .join('')}
      </dl>`;
  }

  let tecleo = null;

  function pintarPanel() {
    const panel = $('#panel');
    const nodo = D.prologo.nodos[S.nodeId];
    if (tecleo) {
      clearInterval(tecleo);
      tecleo = null;
    }

    if (cola.length) {
      const it = cola[0];
      if (it.tipo === 'dialogo') {
        const def = D.personajes[it.id];
        const estilo = def.style;
        bus.hablar(PUESTO_DE[it.id] || 'sala');
        panel.innerHTML = `
          <div class="cuadro" id="cuadro" style="--acento:${estilo.accent}">
            <img class="retrato" alt="" src="${retrato(it.id, it.mood || estilo.defaultMood)}" />
            <div class="globo">
              <p class="mono" style="color:${estilo.nameColor}">${esc(def.name)}</p>
              <p class="linea ${estilo.family}" id="linea"></p>
              <p class="mono gris pista">E · Espacio · clic</p>
            </div>
          </div>`;
        escribir($('#linea'), it.texto, reducido ? 0 : estilo.charDelay, () => avanzar());
        return;
      }
      panel.innerHTML = `
        <button class="narracion" data-primario id="b-nar">
          <p>${esc(it.texto)}</p>
          <p class="mono gris pista">${cola.length > 1 ? 'E · continuar' : 'E · seguir'}</p>
        </button>`;
      $('#b-nar').onclick = () => avanzar();
      return;
    }

    if (nodo.kind === 'dialogo') return;

    if (nodo.kind === 'decision') {
      panel.innerHTML = bloque(
        nodo.prompt,
        `<ul class="lista">${nodo.opciones
          .map(
            (o, i) =>
              `<li><button class="opcion" data-i="${i}"><span class="mono oro">${i + 1}</span> ${esc(o.label)}${
                o.skill ? `<span class="mono gris"> · ${esc(o.skill)}</span>` : ''
              }</button></li>`,
          )
          .join('')}</ul>`,
      );
      panel.onclick = (e) => {
        const b = e.target.closest('.opcion');
        if (!b) return;
        const o = nodo.opciones[Number(b.dataset.i)];
        S.decisiones.push({ nodeId: nodo.id, opcionId: o.id, acierta: Boolean(o.acierta) });
        aplicar(o.efectos, Boolean(o.acierta));
        (o.acierta ? bus.acierto : bus.fallo)();
        pintarHud();
        narrar(o.respuesta, () => irA(o.next));
      };
      return;
    }

    if (nodo.kind === 'scan') {
      panel.innerHTML = bloque(
        nodo.prompt,
        `<ul class="lista">${nodo.objetivos
          .map(
            (t, i) =>
              `<li><button class="opcion" data-i="${i}"><span class="mono oro">${i + 1}</span> ${esc(
                t.label,
              )}</button></li>`,
          )
          .join('')}</ul>`,
      );
      panel.onclick = (e) => {
        const b = e.target.closest('.opcion');
        if (!b) return;
        const t = nodo.objetivos[Number(b.dataset.i)];
        bus.escanear();
        if (t.otorgaEvidencia) otorgar(t.otorgaEvidencia);
        aplicar(t.acierta ? { xp: 35, stats: { investigacion: 1 } } : undefined, Boolean(t.acierta));
        (t.acierta ? bus.acierto : bus.fallo)();
        pintarHud();
        narrar([t.revela], () => irA(nodo.next));
      };
      return;
    }

    if (nodo.kind === 'prueba') {
      const piezas = S.evidencias;
      panel.innerHTML = bloque(
        nodo.prompt,
        `<blockquote>${esc(nodo.afirmacion)}</blockquote>
         <ul class="lista">${
           piezas.length
             ? piezas
                 .map(
                   (e, i) =>
                     `<li><button class="opcion" data-i="${i}"><span class="mono oro">${i + 1}</span>
                     <strong>${esc(e.nombre)}</strong><span class="gris bloque">${esc(e.detalle)}</span></button></li>`,
                 )
                 .join('')
             : '<li><button class="opcion" data-i="-1">Continuar sin presentar prueba</button></li>'
         }</ul>`,
      );
      panel.onclick = (e) => {
        const b = e.target.closest('.opcion');
        if (!b) return;
        const i = Number(b.dataset.i);
        if (i < 0) return narrar(nodo.falloTexto, () => irA(nodo.next));
        const pieza = piezas[i];
        const ok = pieza.id === nodo.evidenciaCorrecta;
        S.decisiones.push({ nodeId: nodo.id, opcionId: pieza.id, acierta: ok });
        aplicar(
          ok
            ? { xp: 55, stats: { argumentacion: 1 }, flag: 'contradiccion_probada' }
            : { stats: { prestigio: -1 } },
          ok,
        );
        (ok ? bus.acierto : bus.fallo)();
        pintarHud();
        narrar(ok ? nodo.aciertoTexto : nodo.falloTexto, () => irA(nodo.next));
      };
      return;
    }

    if (nodo.kind === 'alegato') {
      const elegido = {};
      const pinta = () => {
        panel.innerHTML = bloque(
          nodo.prompt,
          `${nodo.slots
            .map(
              (s) => `<fieldset>
                <legend class="mono oro">${esc(s.label)} ${elegido[s.id] ? '✓' : '—'}</legend>
                <p class="gris ayuda">${esc(s.ayuda)}</p>
                <ul class="lista">${s.opciones
                  .map(
                    (o) =>
                      `<li><button class="opcion" data-slot="${s.id}" data-op="${o.id}" data-elegida="${
                        elegido[s.id] === o.id
                      }">${esc(o.label)}</button></li>`,
                  )
                  .join('')}</ul>
              </fieldset>`,
            )
            .join('')}
          <button class="mono alegar" id="b-alegar" data-primario ${
            nodo.slots.every((s) => elegido[s.id]) ? '' : 'disabled'
          }>${nodo.slots.every((s) => elegido[s.id]) ? 'ESPACIO · Alegato final' : 'Faltan piezas'}</button>`,
        );
        panel.onclick = (e) => {
          const b = e.target.closest('.opcion');
          if (b) {
            elegido[b.dataset.slot] = b.dataset.op;
            pinta();
            return;
          }
          if (e.target.closest('#b-alegar') && nodo.slots.every((s) => elegido[s.id])) alegar();
        };
      };
      const alegar = () => {
        const aciertos = nodo.slots.filter((s) => elegido[s.id] === s.correcta).length;
        const perfecto = aciertos === nodo.slots.length;
        aplicar(
          {
            xp: 40 * aciertos,
            stats: perfecto ? { argumentacion: 1, prestigio: 1 } : {},
            flag: perfecto ? 'alegato_perfecto' : 'alegato_incompleto',
          },
          perfecto,
        );
        (perfecto ? bus.acierto : bus.fallo)();
        pintarHud();
        narrar(
          perfecto
            ? [
                'Lo dice en ese orden y en ese orden entra: hecho, prueba, norma. Cuarenta segundos.',
                'La presidenta lo escucha sin anotar. Cuando alguien no necesita anotar, es porque lo está siguiendo.',
              ]
            : [
                `Alega con ${aciertos} de ${nodo.slots.length} piezas en su sitio.`,
                'Se entiende. No convence del todo, pero se entiende, y con la carga en la otra parte eso puede bastar.',
              ],
          () => irA(nodo.next),
        );
      };
      pinta();
      return;
    }

    if (nodo.kind === 'fin') {
      const textos = nodo.cuerpo.concat(nodo.epilogo);
      let paso = 0;
      const pinta = () => {
        const ultima = paso === textos.length - 1;
        panel.innerHTML = `
          <section class="cierre">
            <p class="mono oro">${paso >= nodo.cuerpo.length ? 'Después' : 'Veredicto'}</p>
            <h2>${esc(nodo.titulo)}</h2>
            <p class="remate ${ultima ? 'golpe' : ''}">${esc(textos[paso])}</p>
            <button class="mono secundario" id="b-fin" data-primario>${
              ultima ? 'Fin del Capítulo 0' : 'E · continuar'
            }</button>
          </section>`;
        $('#b-fin').onclick = () => {
          if (!ultima) {
            paso += 1;
            return pinta();
          }
          // La recompensa del desenlace se cobra una sola vez: la marca vive en
          // el guardado, así que recargar sobre el nodo final no la duplica.
          if (!S.flags.veredicto_cobrado) aplicar({ xp: 120, stats: { prestigio: 2 } }, true);
          S.flags.veredicto_cobrado = true;
          if (!S.finales.includes(nodo.desenlace)) S.finales.push(nodo.desenlace);
          guardar();
          cierre();
        };
      };
      pinta();
    }
  }

  function bloque(prompt, cuerpo) {
    return `<section class="panel"><p class="prompt">${esc(prompt)}</p>${cuerpo}</section>`;
  }

  function escribir(el, texto, delay, alClic) {
    let i = 0;
    const completo = () => {
      el.textContent = texto;
      if (tecleo) clearInterval(tecleo);
      tecleo = null;
    };
    if (delay <= 0) completo();
    else {
      el.textContent = '';
      tecleo = setInterval(() => {
        i += 1;
        el.textContent = texto.slice(0, i);
        if (i >= texto.length) completo();
      }, delay);
    }
    const cuadro = $('#cuadro');
    cuadro.onclick = () => (tecleo ? completo() : alClic());
    cuadro.dataset.dialogo = 'true';
  }

  function cierre() {
    desmontarEscena();
    const aciertos = S.decisiones.filter((d) => d.acierta).length;
    pantalla.innerHTML = `
      <main class="hoja">
        <p class="mono oro">Fin del Capítulo 0</p>
        <h1 class="titulo chico">Ganó el juicio.</h1>
        <p class="entrada">${esc(S.player.nombre)}, nivel ${S.player.nivel}, ${S.player.xp} XP.
        Acertó ${aciertos} de ${S.decisiones.length} decisiones con consecuencia.</p>
        <p class="gris">El Capítulo 1 —«La caída»— todavía no existe. Este prototipo termina donde
        empieza el problema, que es exactamente donde debe terminar un vertical slice.</p>
        <button class="mono secundario" id="b-volver">Volver al inicio</button>
        <section class="fuentes">
          <p class="mono gris">Referencias normativas del capítulo</p>
          <ul>${D.legalSources
            .map(
              (f) =>
                `<li><span class="sello ${f.estado === 'VERIFIED' ? 'ok' : 'pend'} mono">${
                  f.estado === 'VERIFIED' ? 'verificada' : 'por verificar'
                }</span> ${esc(f.cuerpo)} ${esc(f.articulo || '')} — ${esc(f.resumen)}</li>`,
            )
            .join('')}</ul>
          <p class="gris">Lo marcado «por verificar» no se presenta como Derecho vigente. Es material
          de ficción hasta que alguien lo contraste con el texto oficial.</p>
        </section>
      </main>`;
    $('#b-volver').onclick = () => {
      S = INICIAL();
      guardar();
      portada();
    };
  }

  /* ──────────────────────────────── Teclado ─────────────────────────────── */

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target && e.target.tagName) || '')) return;

    if (['e', 'E', ' ', 'Enter'].includes(e.key)) {
      const cuadro = document.querySelector('[data-dialogo]');
      if (cuadro) {
        e.preventDefault();
        cuadro.click();
        return;
      }
      const primario = document.querySelector('[data-primario]:not([disabled])');
      if (primario) {
        e.preventDefault();
        primario.click();
      }
      return;
    }

    if (/^[1-9]$/.test(e.key)) {
      const ops = document.querySelectorAll('#panel .opcion:not([disabled])');
      const b = ops[Number(e.key) - 1];
      if (b) {
        e.preventDefault();
        b.click();
      }
    }
  });

  /* ──────────────────────────────── Arranque ────────────────────────────── */

  cargar();
  portada();
})();
