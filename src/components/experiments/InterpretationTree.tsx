'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, GitBranch, RotateCcw } from 'lucide-react';
import { Badge, Surface } from '@/components/common/ui';
import type { Tone } from '@/types';
import { cn } from '@/lib/utils';

/**
 * El jardín de las interpretaciones que se bifurcan.
 *
 * Una disposición ficticia, unos hechos fijos y tres decisiones hermenéuticas
 * encadenadas. Cada decisión abre una rama; el texto no cambia en ninguna.
 *
 * El árbol es asimétrico a propósito. La primera decisión, si se resuelve de
 * cierta manera, cierra el caso y las dos preguntas siguientes nunca llegan a
 * formularse. Esa es la parte que un esquema de opciones equilibradas oculta:
 * hay decisiones interpretativas que no responden una pregunta, sino que
 * vuelven irrelevantes las demás.
 *
 * Sin textos de Borges: la estructura es el préstamo, no la prosa.
 *
 * Disposición y hechos son material de demostración. No corresponden a norma
 * vigente ni a caso real.
 */

type NodeId = string;

interface Option {
  label: string;
  /** El canon o criterio en que se apoya la lectura. */
  canon: string;
  gloss: string;
  next: NodeId;
}

interface QuestionNode {
  kind: 'question';
  id: NodeId;
  term: string;
  question: string;
  options: [Option, Option];
}

interface OutcomeNode {
  kind: 'outcome';
  id: NodeId;
  title: string;
  detail: string;
  tone: Tone;
  label: string;
}

type TreeNode = QuestionNode | OutcomeNode;

const provision =
  'Artículo 7.º — Quien altere un bien declarado de interés cultural será sancionado. Si la alteración fuere irreversible, la sanción se agravará.';

const facts = [
  'Un restaurador limpió un mural colonial con un disolvente autorizado para otros soportes.',
  'La imagen quedó intacta y legible.',
  'La pátina original —el depósito acumulado durante tres siglos— se perdió y no puede reponerse.',
  'El restaurador actuó siguiendo una instrucción escrita del director del museo.',
];

const nodes: Record<NodeId, TreeNode> = {
  alterar: {
    kind: 'question',
    id: 'alterar',
    term: 'alterar',
    question: '¿Qué cuenta como «alterar» un bien de interés cultural?',
    options: [
      {
        label: 'Toda modificación física del bien',
        canon: 'Lectura literal · amplia',
        gloss:
          'El verbo no distingue entre modificaciones buenas y malas. Quitar la pátina modifica el bien; hay conducta típica y el análisis continúa.',
        next: 'irreversible',
      },
      {
        label: 'Solo lo que menoscaba el valor protegido',
        canon: 'Lectura teleológica · restringida',
        gloss:
          'La norma protege el valor cultural, no la materia por sí misma. Una restauración autorizada persigue conservarlo, no menoscabarlo: no hay conducta típica.',
        next: 'atipico',
      },
    ],
  },

  irreversible: {
    kind: 'question',
    id: 'irreversible',
    term: 'irreversible',
    question: '¿Cuándo una alteración es «irreversible»?',
    options: [
      {
        label: 'Cuando no puede deshacerse con la técnica disponible',
        canon: 'Criterio empírico · estado del arte',
        gloss:
          'La pátina de tres siglos no se reconstruye. Bajo este criterio la alteración es irreversible y opera la agravante.',
        next: 'autoria-agravada',
      },
      {
        label: 'Cuando el bien pierde su identidad cultural',
        canon: 'Criterio conceptual · identidad del bien',
        gloss:
          'La imagen sobrevive y el mural sigue siendo reconocible como lo que era. El bien no perdió identidad: la alteración no es irreversible en sentido normativo.',
        next: 'autoria-simple',
      },
    ],
  },

  'autoria-agravada': {
    kind: 'question',
    id: 'autoria-agravada',
    term: 'quien',
    question: '¿A quién alcanza el «quien» de la disposición?',
    options: [
      {
        label: 'Solo a quien ejecuta materialmente',
        canon: 'Lectura estricta · autoría material',
        gloss:
          'La norma describe una conducta física. Quien la realizó fue el restaurador.',
        next: 'r1',
      },
      {
        label: 'También a quien ordena o permite',
        canon: 'Lectura extensiva · dominio del hecho',
        gloss:
          'Quien decide que la conducta ocurra responde por ella. La instrucción escrita del director es parte del hecho.',
        next: 'r2',
      },
    ],
  },

  'autoria-simple': {
    kind: 'question',
    id: 'autoria-simple',
    term: 'quien',
    question: '¿A quién alcanza el «quien» de la disposición?',
    options: [
      {
        label: 'Solo a quien ejecuta materialmente',
        canon: 'Lectura estricta · autoría material',
        gloss:
          'La norma describe una conducta física. Quien la realizó fue el restaurador.',
        next: 'r3',
      },
      {
        label: 'También a quien ordena o permite',
        canon: 'Lectura extensiva · dominio del hecho',
        gloss:
          'Quien decide que la conducta ocurra responde por ella. La instrucción escrita del director es parte del hecho.',
        next: 'r4',
      },
    ],
  },

  atipico: {
    kind: 'outcome',
    id: 'atipico',
    label: 'Sin sanción',
    title: 'No hay conducta típica',
    detail:
      'La restauración no menoscabó el valor protegido. El caso se archiva sin entrar a discutir irreversibilidad ni autoría: esas dos preguntas quedaron sin objeto.',
    tone: 'muted',
  },
  r1: {
    kind: 'outcome',
    id: 'r1',
    label: 'Agravada · restaurador',
    title: 'Sanción agravada al restaurador',
    detail:
      'Hubo alteración, fue irreversible y responde solo quien manipuló el mural. El director, que ordenó por escrito, queda fuera.',
    tone: 'danger',
  },
  r2: {
    kind: 'outcome',
    id: 'r2',
    label: 'Agravada · ambos',
    title: 'Sanción agravada al restaurador y al director',
    detail:
      'Hubo alteración, fue irreversible y la instrucción escrita integra el hecho. Es el resultado más severo que admite el mismo texto.',
    tone: 'danger',
  },
  r3: {
    kind: 'outcome',
    id: 'r3',
    label: 'Simple · restaurador',
    title: 'Sanción simple al restaurador',
    detail:
      'Hubo alteración, pero el bien conservó su identidad cultural. No opera la agravante y responde solo el autor material.',
    tone: 'warning',
  },
  r4: {
    kind: 'outcome',
    id: 'r4',
    label: 'Simple · ambos',
    title: 'Sanción simple al restaurador y al director',
    detail:
      'Hubo alteración sin agravante, y la responsabilidad alcanza a quien la ordenó.',
    tone: 'warning',
  },
};

const ROOT: NodeId = 'alterar';

/**
 * Hojas del árbol, recorridas una vez al cargar el módulo. El árbol es
 * estático: contar los desenlaces a mano invitaría a que el número quedara
 * desfasado la primera vez que alguien añada una rama.
 */
const allOutcomes: OutcomeNode[] = (() => {
  const found: OutcomeNode[] = [];
  const visit = (id: NodeId) => {
    const node = nodes[id];
    if (node.kind === 'outcome') {
      if (!found.some((o) => o.id === node.id)) found.push(node);
      return;
    }
    node.options.forEach((o) => visit(o.next));
  };
  visit(ROOT);
  return found;
})();

interface Step {
  nodeId: NodeId;
  optionIndex: number;
}

export function InterpretationTree() {
  const [path, setPath] = useState<Step[]>([]);
  const [reached, setReached] = useState<NodeId[]>([]);

  // El nodo actual se deduce del camino: no hay estado duplicado que sincronizar.
  const currentId = useMemo(() => {
    let id = ROOT;
    for (const step of path) {
      const node = nodes[id];
      if (node.kind !== 'question') break;
      id = node.options[step.optionIndex].next;
    }
    return id;
  }, [path]);

  const current = nodes[currentId];

  const choose = (optionIndex: number) => {
    const node = nodes[currentId];
    if (node.kind !== 'question') return;
    const nextId = node.options[optionIndex].next;
    setPath((p) => [...p, { nodeId: currentId, optionIndex }]);
    if (nodes[nextId].kind === 'outcome') {
      setReached((r) => (r.includes(nextId) ? r : [...r, nextId]));
    }
  };

  const back = () => setPath((p) => p.slice(0, -1));
  const reset = () => setPath([]);

  return (
    <div className="space-y-6">
      {/* ── La disposición y los hechos ── */}
      <Surface className="p-6 sm:p-8">
        <p className="meta mb-3">Disposición · texto de demostración</p>
        <p className="font-serif text-xl leading-relaxed text-foreground sm:text-2xl">
          {provision}
        </p>

        <div className="mt-6 border-t border-border/60 pt-5">
          <p className="meta mb-2.5">Hechos, fijos en todo el ejercicio</p>
          <ul className="space-y-1.5">
            {facts.map((f) => (
              <li key={f} className="text-sm leading-relaxed text-muted-foreground">
                · {f}
              </li>
            ))}
          </ul>
        </div>
      </Surface>

      {/* ── Camino recorrido ── */}
      {path.length > 0 && (
        <nav aria-label="Decisiones tomadas" className="flex flex-wrap items-center gap-2">
          {path.map((step, i) => {
            const node = nodes[step.nodeId];
            if (node.kind !== 'question') return null;
            return (
              <span key={`${step.nodeId}-${i}`} className="flex items-center gap-2">
                <span className="rounded-md border border-primary/40 bg-primary/[0.08] px-2.5 py-1 text-[0.75rem] text-primary">
                  <span className="mono mr-1.5 opacity-70">{node.term}</span>
                  {node.options[step.optionIndex].label}
                </span>
                {i < path.length - 1 && (
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      {/* ── Nodo actual ── */}
      {current.kind === 'question' ? (
        <Surface className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="meta text-primary">
              Decisión {path.length + 1} · «{current.term}»
            </p>
            {path.length > 0 && (
              <button
                type="button"
                onClick={back}
                className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Volver
              </button>
            )}
          </div>

          <h3 className="mt-3 font-serif text-xl leading-snug text-foreground sm:text-2xl">
            {current.question}
          </h3>

          {/* No son radios: elegir una rama es una acción que avanza el árbol,
              no una selección reversible dentro de un grupo. Botones nativos,
              que ya son accesibles por teclado sin patrón ARIA prestado. */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  'rounded-lg border border-border p-5 text-left transition-colors',
                  'hover:border-primary/50 hover:bg-primary/[0.04]',
                )}
              >
                <span className="mono block text-[0.625rem] uppercase tracking-widest text-primary">
                  {opt.canon}
                </span>
                <span className="mt-2 block font-sans text-[0.9375rem] font-medium text-foreground">
                  {opt.label}
                </span>
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {opt.gloss}
                </span>
              </button>
            ))}
          </div>
        </Surface>
      ) : (
        <Surface className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone={current.tone} dot>
              Resultado
            </Badge>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={back}
                className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3 w-3" aria-hidden />
                Volver
              </button>
              <button
                type="button"
                onClick={reset}
                className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Desde el principio
              </button>
            </div>
          </div>

          <h3 className="mt-4 font-serif text-2xl leading-snug text-foreground">
            {current.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {current.detail}
          </p>

          <p className="mt-6 border-t border-border/60 pt-5 text-sm leading-relaxed text-foreground/80">
            Se llegó aquí en {path.length}{' '}
            {path.length === 1 ? 'decisión' : 'decisiones'}. El texto del artículo
            7.º no cambió en ninguna de ellas, y los hechos tampoco.
          </p>
        </Surface>
      )}

      {/* ── El jardín completo ── */}
      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="meta inline-flex items-center gap-2 text-primary">
            <GitBranch className="h-3.5 w-3.5" aria-hidden />
            El jardín completo
          </p>
          <span aria-live="polite" className="mono text-[0.75rem] text-muted-foreground">
            {reached.length}/{allOutcomes.length} recorridos
          </span>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          La misma disposición y los mismos hechos admiten {allOutcomes.length}{' '}
          desenlaces. Ninguno exige forzar el texto; cada uno se apoya en un canon
          interpretativo reconocible.
        </p>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {allOutcomes.map((o) => {
            const seen = reached.includes(o.id);
            return (
              <li key={o.id}>
                <div
                  className={cn(
                    'flex h-full items-center gap-3 rounded-md border px-4 py-3 transition-colors',
                    seen ? 'border-primary/40 bg-primary/[0.05]' : 'border-dashed border-border',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      seen ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'text-sm',
                      seen ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {seen ? o.label : 'Rama sin recorrer'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {reached.length === allOutcomes.length && (
          <p className="mt-5 rounded-md border-l-2 border-l-primary bg-primary/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/85">
            Recorrió el jardín entero. Un mismo artículo, unos mismos hechos y{' '}
            {allOutcomes.length} desenlaces defendibles —desde el archivo sin
            sanción hasta la agravada contra dos personas—. La rama que un
            tribunal elige es la única que suele quedar escrita; las otras
            existieron igual.
          </p>
        )}
      </Surface>
    </div>
  );
}
