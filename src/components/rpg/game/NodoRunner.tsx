'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DialogueBox } from '@/components/rpg/DialogueBox';
import { PUESTO_DE } from '@/components/rpg/game/puestos';
import { prologo } from '@/data/rpg/chapters/prologo';
import { legalSources } from '@/data/rpg/legalSources';
import { emit } from '@/lib/rpg/bus';
import { useAudaces } from '@/state/rpg/useAudaces';
import type { Linea, SceneNode, SlotId } from '@/types/game';
import type { CharacterId, DialogueLine } from '@/types/rpg';

/** Una unidad de presentación: alguien habla, o el narrador describe. */
type Item =
  | { tipo: 'dialogo'; linea: DialogueLine; a?: string }
  | { tipo: 'narracion'; texto: string };

/**
 * Normaliza una línea de guion.
 *
 * Una cadena suelta la dice quien lleva el nodo. Una línea con `quien` se la
 * cede a otro, y con `a` declara a quién se dirige: eso es lo que permite que
 * los tres jueces se interrumpan dentro de un mismo nodo y que la cámara sepa
 * a quién encuadrar sin que el guion hable de cámaras.
 */
function aItem(linea: Linea, porDefecto: CharacterId, moodNodo?: DialogueLine['mood']): Item {
  if (typeof linea === 'string') {
    return { tipo: 'dialogo', linea: { characterId: porDefecto, mood: moodNodo, text: linea } };
  }
  return {
    tipo: 'dialogo',
    linea: {
      characterId: linea.quien ?? porDefecto,
      mood: linea.mood ?? moodNodo,
      text: linea.text,
    },
    a: linea.a,
  };
}

/** Lo que se dice tras una decisión: narración si nadie la firma. */
function aItemDeRespuesta(linea: Linea): Item {
  if (typeof linea === 'string') return { tipo: 'narracion', texto: linea };
  if (!linea.quien) return { tipo: 'narracion', texto: linea.text };
  return aItem(linea, linea.quien);
}

const nodoDe = (id: string | null): SceneNode | null =>
  (id && prologo.nodos[id]) || null;

/** Lo que se dice nada más entrar en un nodo, antes de cualquier interacción. */
function colaDeEntrada(nodo: SceneNode): Item[] {
  const items: Item[] = [];
  if (nodo.kind === 'dialogo') {
    nodo.lines.forEach((linea) => items.push(aItem(linea, nodo.speaker, nodo.mood)));
  }
  if (nodo.eva) {
    items.push({ tipo: 'dialogo', linea: { characterId: 'eva', text: nodo.eva } });
  }
  return items;
}

/**
 * Intérprete del grafo de escena.
 *
 * Un solo componente recorre todos los tipos de nodo. Añadir un capítulo es
 * añadir datos; añadir una mecánica nueva es añadir un `case` aquí. Nada del
 * guion vive en este archivo.
 */
export function NodoRunner() {
  const nodeId = useAudaces((s) => s.nodeId);
  const nodo = useMemo(() => nodoDe(nodeId), [nodeId]);
  if (!nodo) return null;
  // `key` reinicia el estado del intérprete al cambiar de nodo. Es la forma
  // idiomática de resetear estado derivado en React: sin efecto y sin
  // renderizados en cascada.
  return <NodoVista key={nodo.id} nodo={nodo} />;
}

function NodoVista({ nodo }: { nodo: SceneNode }) {
  const irA = useAudaces((s) => s.irA);
  const flags = useAudaces((s) => s.flags);
  const aplicar = useAudaces((s) => s.aplicar);
  const registrarDecision = useAudaces((s) => s.registrarDecision);
  const otorgarEvidencia = useAudaces((s) => s.otorgarEvidencia);
  const terminar = useAudaces((s) => s.terminar);
  const evidencias = useAudaces((s) => s.evidencias);

  const [cola, setCola] = useState<Item[]>(() => colaDeEntrada(nodo));
  const [alFinal, setAlFinal] = useState<(() => void) | null>(() =>
    nodo.kind === 'dialogo' ? () => irA(nodo.next) : () => undefined,
  );
  const [alegato, setAlegato] = useState<Partial<Record<SlotId, string>>>({});

  /* ── Entrada al nodo ──────────────────────────────────────────────────── */

  useEffect(() => {
    emit('enfocar', { objetivo: nodo.focus ?? 'sala' });
  }, [nodo]);

  /* ── Avance de la cola ────────────────────────────────────────────────── */

  const actual = cola[0];

  useEffect(() => {
    if (actual?.tipo !== 'dialogo') return;
    const quien = actual.linea.characterId;
    emit('hablar', {
      personaje: quien,
      puesto: PUESTO_DE[quien],
      hacia: actual.a,
    });
  }, [actual]);

  /**
   * Avanza la cola.
   *
   * El salto al nodo siguiente se hace FUERA del actualizador de estado: React
   * ejecuta ese actualizador durante el render, y tocar el store desde ahí
   * actualiza otro componente en mitad de un render ajeno.
   */
  const avanzar = useCallback(() => {
    if (cola.length <= 1) {
      setCola([]);
      alFinal?.();
      return;
    }
    setCola((previa) => previa.slice(1));
  }, [alFinal, cola.length]);

  /** Encola lo que sigue a una elección y define qué ocurre al terminarlo. */
  const narrar = useCallback((lineas: Linea[], despues: () => void) => {
    setCola(lineas.map(aItemDeRespuesta));
    setAlFinal(() => despues);
  }, []);

  /* ── Teclado ──────────────────────────────────────────────────────────── */

  const enDialogo = actual?.tipo === 'dialogo';

  useEffect(() => {
    // El cuadro de diálogo trae su propio manejo de Enter/Espacio: no se pisa.
    const manejar = (e: KeyboardEvent) => {
      const destino = e.target as HTMLElement | null;
      if (destino && ['INPUT', 'TEXTAREA'].includes(destino.tagName)) return;

      if (['e', 'E', ' ', 'Enter'].includes(e.key)) {
        if (enDialogo) return;
        if (cola.length > 0) {
          e.preventDefault();
          avanzar();
          return;
        }
        const primario = document.querySelector<HTMLButtonElement>('#panel-juego [data-primario]');
        if (primario && !primario.disabled) {
          e.preventDefault();
          primario.click();
        }
        return;
      }

      if (/^[1-9]$/.test(e.key)) {
        const opciones = document.querySelectorAll<HTMLButtonElement>(
          '#panel-juego .opcion:not(:disabled)',
        );
        const boton = opciones[Number(e.key) - 1];
        if (boton) {
          e.preventDefault();
          boton.click();
        }
      }
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  }, [avanzar, cola.length, enDialogo]);

  /* ── Presentación de la cola ──────────────────────────────────────────── */

  if (actual) {
    // El paginado del diálogo lo lleva la propia cola: una línea por pantalla.
    // Nunca hay un muro de texto que empuje el botón de avanzar fuera de la
    // vista, porque el botón no está dentro del texto: está en la barra.
    return (
      <>
        <div className="audaces-panel-cuerpo">
          {actual.tipo === 'dialogo' ? (
            <DialogueBox line={actual.linea} onAdvance={avanzar} hasNext={cola.length > 1} />
          ) : (
            <p
              className="mx-auto max-w-3xl leading-relaxed"
              style={{ color: 'var(--ivory-dim)', fontSize: 'var(--texto)' }}
            >
              {actual.texto}
            </p>
          )}
        </div>
        <div className="audaces-acciones">
          <button type="button" data-primario className="boton boton--principal" onClick={avanzar}>
            {cola.length > 1 ? 'Continuar' : 'Seguir'}
          </button>
          <span className="mono audaces-acciones-pista">
            E o Espacio · {cola.length > 1 ? `quedan ${cola.length - 1}` : 'última'}
          </span>
        </div>
      </>
    );
  }

  /* ── Interacción por tipo de nodo ─────────────────────────────────────── */

  switch (nodo.kind) {
    case 'decision':
      return (
        <Bloque
          prompt={nodo.prompt}
          acciones={
            <span className="mono audaces-acciones-pista">
              1–{nodo.opciones.length} · elegir con el teclado
            </span>
          }
        >
          <ul className="grid gap-2">
            {nodo.opciones.map((o, i) => (
              <li key={o.id}>
                <button
                  type="button"
                  className="opcion"
                  onClick={() => {
                    registrarDecision(nodo.id, o.id, Boolean(o.acierta));
                    aplicar(o.efectos, Boolean(o.acierta));
                    emit(o.acierta ? 'acierto' : 'fallo', {});
                    narrar(o.respuesta, () => irA(o.next));
                  }}
                >
                  <span className="mono mr-2" style={{ color: 'var(--gold)' }}>
                    {i + 1}
                  </span>
                  {o.label}
                  {o.skill && (
                    <span className="mono ml-2" style={{ color: 'var(--stone)' }}>
                      · {o.skill}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Bloque>
      );

    case 'scan':
      return (
        <Bloque
          prompt={nodo.prompt}
          acciones={
            <span className="mono audaces-acciones-pista">
              1–{nodo.objetivos.length} · elegir con el teclado
            </span>
          }
        >
          <ul className="grid gap-2">
            {nodo.objetivos.map((t, i) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="opcion"
                  onClick={() => {
                    emit('escanear', {});
                    if (t.otorgaEvidencia) otorgarEvidencia(t.otorgaEvidencia);
                    aplicar(
                      t.acierta ? { xp: 35, stats: { investigacion: 1 } } : undefined,
                      Boolean(t.acierta),
                    );
                    emit(t.acierta ? 'acierto' : 'fallo', {});
                    narrar([t.revela], () => irA(nodo.next));
                  }}
                >
                  <span className="mono mr-2" style={{ color: 'var(--gold)' }}>
                    {i + 1}
                  </span>
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </Bloque>
      );

    case 'prueba':
      return (
        <Bloque
          prompt={nodo.prompt}
          acciones={
            <span className="mono audaces-acciones-pista">
              1–{evidencias.length} · elegir con el teclado
            </span>
          }
        >
          <blockquote
            className="mb-4 border-l-2 pl-4 text-lg italic"
            style={{ borderColor: 'var(--burgundy)', color: 'var(--ivory-dim)' }}
          >
            {nodo.afirmacion}
          </blockquote>
          {evidencias.length === 0 && (
            <p style={{ color: 'var(--stone)' }}>
              No tiene nada en el expediente. Habrá que seguir sin prueba.
            </p>
          )}
          <ul className="grid gap-2">
            {evidencias.map((e, i) => (
              <li key={e.id}>
                <button
                  type="button"
                  className="opcion"
                  onClick={() => {
                    const acierta = e.id === nodo.evidenciaCorrecta;
                    registrarDecision(nodo.id, e.id, acierta);
                    aplicar(
                      acierta
                        ? { xp: 55, stats: { argumentacion: 1 }, flag: 'contradiccion_probada' }
                        : { stats: { prestigio: -1 } },
                      acierta,
                    );
                    emit(acierta ? 'acierto' : 'fallo', {});
                    narrar(acierta ? nodo.aciertoTexto : nodo.falloTexto, () => irA(nodo.next));
                  }}
                >
                  <span className="mono mr-2" style={{ color: 'var(--gold)' }}>
                    {i + 1}
                  </span>
                  <strong className="font-normal">{e.nombre}</strong>
                  <span className="mt-1 block text-sm" style={{ color: 'var(--stone)' }}>
                    {e.detalle}
                  </span>
                </button>
              </li>
            ))}
            {evidencias.length === 0 && (
              <li>
                <button type="button" className="opcion" onClick={() => narrar(nodo.falloTexto, () => irA(nodo.next))}>
                  Continuar sin presentar prueba
                </button>
              </li>
            )}
          </ul>
        </Bloque>
      );

    case 'alegato': {
      const completo = nodo.slots.every((s) => alegato[s.id]);
      const aciertos = nodo.slots.filter((s) => alegato[s.id] === s.correcta).length;
      const puestas = nodo.slots.filter((s) => alegato[s.id]).length;
      return (
        <Bloque
          prompt={nodo.prompt}
          acciones={
            <>
              <button
                type="button"
                data-primario
                disabled={!completo}
                className={`boton ${completo ? 'boton--principal' : ''}`}
                onClick={() => {
                  const perfecto = aciertos === nodo.slots.length;
                  aplicar(
                    {
                      xp: 40 * aciertos,
                      stats: perfecto ? { argumentacion: 1, prestigio: 1 } : {},
                      flag: perfecto ? 'alegato_perfecto' : 'alegato_incompleto',
                    },
                    perfecto,
                  );
                  emit(perfecto ? 'acierto' : 'fallo', {});
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
                }}
              >
                {completo ? 'Espacio · alegato final' : 'Faltan piezas'}
              </button>
              {/* El recuento vive en la barra, no dentro del scroll: se puede
                  saber cuánto falta sin recorrer los tres campos. */}
              <span className="mono audaces-acciones-pista">
                {puestas} de {nodo.slots.length} piezas
              </span>
            </>
          }
        >
          <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-3">
            {nodo.slots.map((slot) => (
              <fieldset
                key={slot.id}
                className="border p-3"
                style={{ borderColor: alegato[slot.id] ? 'var(--gold)' : 'var(--charcoal-lift)' }}
              >
                <legend className="mono px-2" style={{ color: 'var(--gold)' }}>
                  {slot.label} {alegato[slot.id] ? '✓' : '—'}
                </legend>
                {/* Pista de la pieza. Es lo primero que cede cuando falta
                    alto: explica la decisión, pero no es la decisión. */}
                <p className="audaces-ayuda mb-2 text-sm" style={{ color: 'var(--stone)' }}>
                  {slot.ayuda}
                </p>
                <ul className="grid gap-2">
                  {slot.opciones.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        className="opcion"
                        data-elegida={alegato[slot.id] === o.id}
                        onClick={() => setAlegato((a) => ({ ...a, [slot.id]: o.id }))}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ))}
          </div>
        </Bloque>
      );
    }

    case 'fin':
      return (
        <Veredicto
          nodo={nodo}
          onCerrar={() => {
            // La recompensa del desenlace se entrega una sola vez. La marca vive
            // en el guardado, de modo que recargar sobre el nodo final no la
            // vuelve a cobrar.
            if (!flags.veredicto_cobrado) aplicar({ xp: 120, stats: { prestigio: 2 } }, true);
            terminar(nodo.desenlace);
          }}
        />
      );

    default:
      return null;
  }
}

/* ── Piezas de presentación ───────────────────────────────────────────────── */

/**
 * Enunciado fijo, opciones desplazables, acciones fijas.
 *
 * El enunciado no se desplaza porque es la pregunta: desaparecer mientras se
 * responde sería absurdo. Las acciones tampoco, porque son la salida. Lo único
 * que puede desplazarse es la lista de opciones, y sólo cuando no cabe.
 */
function Bloque({
  prompt,
  children,
  acciones,
}: {
  prompt: string;
  children: React.ReactNode;
  acciones?: React.ReactNode;
}) {
  return (
    <>
      <div className="audaces-panel-cabeza">
        <p
          className="leading-relaxed"
          style={{ color: 'var(--ivory)', fontSize: 'var(--texto)' }}
        >
          {prompt}
        </p>
      </div>
      <div className="audaces-panel-cuerpo">{children}</div>
      {acciones && <div className="audaces-acciones">{acciones}</div>}
    </>
  );
}

function Veredicto({
  nodo,
  onCerrar,
}: {
  nodo: Extract<SceneNode, { kind: 'fin' }>;
  onCerrar: () => void;
}) {
  const [paso, setPaso] = useState(0);
  const total = nodo.cuerpo.length + nodo.epilogo.length;
  const texto = [...nodo.cuerpo, ...nodo.epilogo][paso];
  const enEpilogo = paso >= nodo.cuerpo.length;
  const ultima = paso === total - 1;

  // El veredicto se lee paginado —un tramo por pantalla— con el contador a la
  // vista. Es la alternativa a un muro de texto con el botón al final.
  return (
    <>
      <div className="audaces-panel-cabeza">
        <p className="mono" style={{ color: 'var(--gold)' }}>
          {enEpilogo ? 'Después' : 'Veredicto'} · {paso + 1}/{total}
        </p>
        <h2 className="mt-1" style={{ fontSize: 'clamp(1.25rem, 3.2vh, 1.875rem)' }}>
          {nodo.titulo}
        </h2>
      </div>
      <div className="audaces-panel-cuerpo">
        <p
          className="mx-auto max-w-3xl leading-relaxed"
          style={{
            color: ultima ? 'var(--burgundy-lift)' : 'var(--ivory-dim)',
            fontSize: 'clamp(1rem, 2vh, 1.25rem)',
          }}
        >
          {texto}
        </p>
      </div>
      <div className="audaces-acciones">
        <button
          type="button"
          data-primario
          className="boton boton--principal"
          onClick={() => (ultima ? onCerrar() : setPaso((p) => p + 1))}
        >
          {ultima ? 'Fin del Capítulo 0' : 'Continuar'}
        </button>
        <span className="mono audaces-acciones-pista">E o Espacio</span>
      </div>
    </>
  );
}

/** Referencias citadas en el capítulo, con su estado de verificación visible. */
export function FuentesDelCapitulo() {
  return (
    <section className="mt-6 border-t pt-4" style={{ borderColor: 'var(--charcoal-lift)' }}>
      <p className="mono" style={{ color: 'var(--stone)' }}>
        Referencias normativas del capítulo
      </p>
      <ul className="mt-3 grid gap-2">
        {legalSources.map((f) => (
          <li key={f.id} className="text-sm" style={{ color: 'var(--ivory-deep)' }}>
            <span
              className="mono mr-2 px-1"
              style={{
                border: `1px solid ${f.estado === 'VERIFIED' ? 'var(--gold)' : 'var(--burgundy)'}`,
                color: f.estado === 'VERIFIED' ? 'var(--gold)' : 'var(--burgundy-lift)',
              }}
            >
              {f.estado === 'VERIFIED' ? 'verificada' : 'por verificar'}
            </span>
            {f.cuerpo} {f.articulo} — {f.resumen}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm" style={{ color: 'var(--stone)' }}>
        Lo marcado «por verificar» no se presenta como Derecho vigente. Es
        material de ficción hasta que alguien lo contraste con el texto oficial.
      </p>
    </section>
  );
}
