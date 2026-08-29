'use client';

import { useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Badge, Surface } from '@/components/common/ui';
import { cn } from '@/lib/utils';

/**
 * Constitution Lab — onda expansiva.
 *
 * Se cambia una palabra en un artículo y se observa qué disposiciones dejan de
 * funcionar. La idea que sostiene la pieza: un texto normativo es una red, no
 * una lista, y la mayoría de las propuestas de reforma se discuten como si
 * fueran una lista.
 *
 * Texto de demostración. No corresponde a norma vigente de ninguna jurisdicción.
 */

type OperatorId = 'debera' | 'podra' | 'no-podra';

interface Operator {
  id: OperatorId;
  word: string;
  label: string;
  force: string;
}

const operators: Operator[] = [
  { id: 'debera', word: 'deberá', label: 'Obligación', force: 'El órgano está obligado a actuar.' },
  { id: 'podra', word: 'podrá', label: 'Facultad', force: 'El órgano decide si actúa o no.' },
  {
    id: 'no-podra',
    word: 'no podrá',
    label: 'Prohibición',
    force: 'El órgano tiene vedado actuar.',
  },
];

interface Dependent {
  id: string;
  ref: string;
  text: string;
  /** Cómo queda esta disposición bajo cada operador. */
  effect: Record<OperatorId, { state: 'coherente' | 'tension' | 'inaplicable'; note: string }>;
}

const dependents: Dependent[] = [
  {
    id: 'plazo',
    ref: 'Art. 12',
    text: 'El plazo para ejercer lo dispuesto en el artículo anterior será de treinta días.',
    effect: {
      debera: {
        state: 'coherente',
        note: 'Un plazo tiene sentido cuando hay un deber que cumplir dentro de él.',
      },
      podra: {
        state: 'tension',
        note: 'El plazo limita una facultad, pero nada obliga a ejercerla. Vence sin consecuencia.',
      },
      'no-podra': {
        state: 'inaplicable',
        note: 'No hay conducta que plazar: la disposición queda sin objeto.',
      },
    },
  },
  {
    id: 'recurso',
    ref: 'Art. 27',
    text: 'Procederá recurso ante la omisión de lo previsto en el artículo 11.',
    effect: {
      debera: {
        state: 'coherente',
        note: 'La omisión de un deber es reclamable. El recurso tiene contenido.',
      },
      podra: {
        state: 'inaplicable',
        note: 'No ejercer una facultad no es una omisión. El recurso pierde su supuesto.',
      },
      'no-podra': {
        state: 'inaplicable',
        note: 'La omisión es precisamente lo exigido. Recurrir contra ella es absurdo.',
      },
    },
  },
  {
    id: 'sancion',
    ref: 'Art. 41',
    text: 'El incumplimiento de lo dispuesto en el artículo 11 hará efectiva la responsabilidad del titular.',
    effect: {
      debera: {
        state: 'coherente',
        note: 'Hay deber, luego hay incumplimiento posible, luego hay responsabilidad.',
      },
      podra: {
        state: 'inaplicable',
        note: 'Una facultad no se incumple. La regla de responsabilidad queda huérfana.',
      },
      'no-podra': {
        state: 'tension',
        note: 'Cambia el sentido: se responde por actuar, no por omitir. La redacción ya no calza.',
      },
    },
  },
  {
    id: 'reglamento',
    ref: 'Art. 58',
    text: 'Un reglamento determinará la forma de dar cumplimiento al artículo 11.',
    effect: {
      debera: {
        state: 'coherente',
        note: 'La remisión reglamentaria desarrolla el modo de cumplir el deber.',
      },
      podra: {
        state: 'tension',
        note: 'El reglamento regularía el ejercicio de una facultad. Posible, pero excede la remisión.',
      },
      'no-podra': {
        state: 'inaplicable',
        note: 'No hay cumplimiento que reglamentar.',
      },
    },
  },
];

const stateMeta = {
  coherente: { label: 'Coherente', tone: 'success' as const },
  tension: { label: 'En tensión', tone: 'warning' as const },
  inaplicable: { label: 'Inaplicable', tone: 'danger' as const },
};

export function ConstitutionLab() {
  const [operatorId, setOperatorId] = useState<OperatorId>('debera');
  const operator = operators.find((o) => o.id === operatorId) ?? operators[0];
  const changed = operatorId !== 'debera';

  const broken = dependents.filter(
    (d) => d.effect[operatorId].state === 'inaplicable',
  ).length;
  const strained = dependents.filter((d) => d.effect[operatorId].state === 'tension').length;

  return (
    <div className="space-y-6">
      {/* ── El artículo que se edita ── */}
      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="meta">Artículo 11 · texto de demostración</p>
          {changed && (
            <button
              type="button"
              onClick={() => setOperatorId('debera')}
              className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Restaurar
            </button>
          )}
        </div>

        <p className="mt-4 font-serif text-xl leading-relaxed text-foreground sm:text-2xl">
          El órgano competente{' '}
          <span
            className={cn(
              'rounded px-1.5 py-0.5 transition-colors duration-300',
              changed ? 'bg-accent/20 text-accent' : 'bg-primary/15 text-primary',
            )}
          >
            {operator.word}
          </span>{' '}
          publicar los antecedentes que sirvieron de fundamento a su decisión.
        </p>

        <div
          role="radiogroup"
          aria-label="Operador deóntico del artículo 11"
          className="mt-6 flex flex-wrap gap-2"
        >
          {operators.map((op) => (
            <button
              key={op.id}
              type="button"
              role="radio"
              aria-checked={op.id === operatorId}
              onClick={() => setOperatorId(op.id)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[0.8125rem] transition-colors',
                op.id === operatorId
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <span className="mono">{op.word}</span>
              <span className="ml-2 opacity-70">{op.label}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{operator.force}</p>
      </Surface>

      {/* ── Resumen de la onda expansiva ── */}
      <div
        aria-live="polite"
        className={cn(
          'flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border-l-2 px-4 py-3 text-sm',
          broken > 0
            ? 'border-l-danger bg-danger/[0.07]'
            : strained > 0
              ? 'border-l-warning bg-warning/[0.07]'
              : 'border-l-success bg-success/[0.07]',
        )}
      >
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Onda expansiva
        </span>
        <span className="text-muted-foreground">
          {broken} {broken === 1 ? 'disposición inaplicable' : 'disposiciones inaplicables'} ·{' '}
          {strained} en tensión · de {dependents.length} que remiten al artículo 11
        </span>
      </div>

      {/* ── Disposiciones dependientes ── */}
      <ul className="grid gap-3 md:grid-cols-2">
        {dependents.map((dep) => {
          const effect = dep.effect[operatorId];
          const meta = stateMeta[effect.state];
          return (
            <li key={dep.id}>
              <Surface
                className={cn(
                  'h-full p-5 transition-colors duration-300',
                  effect.state === 'inaplicable' && 'border-danger/40',
                  effect.state === 'tension' && 'border-warning/40',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="mono text-[0.6875rem] tracking-widest text-muted-foreground">
                    {dep.ref}
                  </span>
                  <Badge tone={meta.tone} dot>
                    {meta.label}
                  </Badge>
                </div>
                <p className="mt-3 font-serif text-base leading-snug text-foreground/85">
                  {dep.text}
                </p>
                <p className="mt-3 border-t border-border/60 pt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {effect.note}
                </p>
              </Surface>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
