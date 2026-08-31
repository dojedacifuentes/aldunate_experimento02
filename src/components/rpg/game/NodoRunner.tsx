'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DialogueBox } from '@/components/rpg/DialogueBox';
import { PUESTO_DE } from '@/components/rpg/game/puestos';
import { prologo } from '@/data/rpg/chapters/prologo';
import { legalSources } from '@/data/rpg/legalSources';
import { emit } from '@/lib/rpg/bus';
import { useAudaces } from '@/state/rpg/useAudaces';
import type { SceneNode, SlotId } from '@/types/game';
import type { DialogueLine } from '@/types/rpg';

/** Una unidad de presentación: alguien habla, o el narrador describe. */
type Item =
  | { tipo: 'dialogo'; linea: DialogueLine }
  | { tipo: 'narracion'; texto: string };

const nodoDe = (id: string | null): SceneNode | null =>
  (id && prologo.nodos[id]) || null;

/** Lo que se dice nada más entrar en un nodo, antes de cualquier interacción. */
function colaDeEntrada(nodo: SceneNode): Item[] {
  const items: Item[] = [];
  if (nodo.kind === 'dialogo') {
    nodo.lines.forEach((text) =>
      items.push({ tipo: 'dialogo', linea: { characterId: nodo.speaker, mood: nodo.mood, text } }),
    );
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
    if (actual?.tipo === 'dialogo') {
      emit('hablar', { puesto: PUESTO_DE[actual.linea.characterId] });
    }
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

  /** Encola narración y define qué ocurre al terminarla. */
  const narrar = useCallback((textos: string[], despues: () => void) => {
    setCola(textos.map((texto) => ({ tipo: 'narracion' as const, texto })));
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
    return (
      <div className="p-5">
        {actual.tipo === 'dialogo' ? (
          <DialogueBox line={actual.linea} onAdvance={avanzar} hasNext={cola.length > 1} />
        ) : (
          <button
            type="button"
            data-primario
            onClick={avanzar}
            className="w-full cursor-pointer border p-5 text-left"
            style={{ borderColor: 'var(--charcoal-lift)', background: 'var(--charcoal)' }}
          >
            <p className="text-lg leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
              {actual.texto}
            </p>
            <p className="mono mt-3" style={{ color: 'var(--stone)' }}>
              {cola.length > 1 ? 'E · continuar' : 'E · seguir'}
            </p>
          </button>
        )}
      </div>
    );
  }

  /* ── Interacción por tipo de nodo ─────────────────────────────────────── */

  switch (nodo.kind) {
    case 'decision':
      return (
        <Bloque prompt={nodo.prompt}>
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
        <Bloque prompt={nodo.prompt}>
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
        <Bloque prompt={nodo.prompt}>
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
      return (
        <Bloque prompt={nodo.prompt}>
          <div className="grid gap-5">
            {nodo.slots.map((slot) => (
              <fieldset key={slot.id} className="border p-3" style={{ borderColor: 'var(--charcoal-lift)' }}>
                <legend className="mono px-2" style={{ color: 'var(--gold)' }}>
                  {slot.label} {alegato[slot.id] ? '✓' : '—'}
                </legend>
                <p className="mb-2 text-sm" style={{ color: 'var(--stone)' }}>
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

          <button
            type="button"
            data-primario
            disabled={!completo}
            className="mono mt-6 w-full border px-6 py-4"
            style={{
              borderColor: completo ? 'var(--gold)' : 'var(--charcoal-lift)',
              background: completo ? 'var(--gold)' : 'transparent',
              color: completo ? 'var(--ink)' : 'var(--stone)',
              cursor: completo ? 'pointer' : 'not-allowed',
            }}
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
            {completo ? 'ESPACIO · Alegato final' : 'Faltan piezas'}
          </button>
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

function Bloque({ prompt, children }: { prompt: string; children: React.ReactNode }) {
  return (
    <section className="p-5">
      <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--ivory)' }}>
        {prompt}
      </p>
      {children}
    </section>
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

  return (
    <section className="p-5">
      <p className="mono" style={{ color: 'var(--gold)' }}>
        {enEpilogo ? 'Después' : 'Veredicto'}
      </p>
      <h2 className="mt-2 text-3xl">{nodo.titulo}</h2>
      <p
        className="mt-6 text-xl leading-relaxed"
        style={{ color: ultima ? 'var(--burgundy-lift)' : 'var(--ivory-dim)' }}
      >
        {texto}
      </p>
      <button
        type="button"
        data-primario
        className="mono mt-8 border px-6 py-3"
        style={{ borderColor: 'var(--gold)', color: 'var(--gold)', cursor: 'pointer' }}
        onClick={() => (ultima ? onCerrar() : setPaso((p) => p + 1))}
      >
        {ultima ? 'Fin del Capítulo 0' : 'E · continuar'}
      </button>
    </section>
  );
}

/** Referencias citadas en el capítulo, con su estado de verificación visible. */
export function FuentesDelCapitulo() {
  return (
    <section className="border-t p-5" style={{ borderColor: 'var(--charcoal-lift)' }}>
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
