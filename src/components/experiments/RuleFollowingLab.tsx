'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Badge, Surface } from '@/components/common/ui';
import { cn } from '@/lib/utils';

/**
 * ¿Qué regla estás siguiendo?
 *
 * El caso clásico: «Ningún vehículo puede entrar al parque». Se clasifica una
 * lista de objetos, después cambia el propósito declarado de la ordenanza y se
 * vuelve a clasificar lo mismo.
 *
 * El ejercicio no evalúa respuestas —no hay clave de corrección— sino que
 * devuelve al usuario sus propias respuestas: cuáles mantuvo estables entre
 * contextos y cuáles cambió. Lo que cambió no fue el texto de la regla.
 *
 * Deliberadamente no se muestran porcentajes ni «lo que responde la mayoría»:
 * no hay datos, y un número inventado arruinaría exactamente el punto.
 */

interface Context {
  id: string;
  label: string;
  purpose: string;
}

const contexts: Context[] = [
  {
    id: 'ruido',
    label: 'Tránsito y ruido',
    purpose:
      'La ordenanza se dictó para preservar la tranquilidad del parque y evitar accidentes con peatones.',
  },
  {
    id: 'emergencia',
    label: 'Emergencia sanitaria',
    purpose:
      'Rige un plan de emergencia: el parque funciona como punto de atención y evacuación.',
  },
  {
    id: 'monumento',
    label: 'Memorial',
    purpose:
      'El parque conmemora a los caídos en una guerra y el municipio quiere instalar un tanque militar como monumento.',
  },
];

interface Item {
  id: string;
  label: string;
  note: string;
}

const items: Item[] = [
  { id: 'auto', label: 'Un automóvil particular', note: 'Motor, cuatro ruedas, uso privado.' },
  { id: 'ambulancia', label: 'Una ambulancia', note: 'Vehículo motorizado en servicio de urgencia.' },
  { id: 'bicicleta', label: 'Una bicicleta', note: 'Con ruedas, sin motor, transporta a una persona.' },
  { id: 'silla', label: 'Una silla de ruedas eléctrica', note: 'Con motor y ruedas; asistencia a la movilidad.' },
  { id: 'patineta', label: 'Una patineta', note: 'Ruedas, sin motor, uso recreativo.' },
  { id: 'coche', label: 'Un coche de bebé', note: 'Ruedas, sin motor, empujado por una persona.' },
  { id: 'dron', label: 'Un dron de reparto', note: 'Motorizado, no toca el suelo.' },
  { id: 'tanque', label: 'Un tanque militar sin motor, sobre un pedestal', note: 'Vehículo por diseño; inmóvil por instalación.' },
];

type Answer = 'entra' | 'no-entra';

export function RuleFollowingLab() {
  const [contextId, setContextId] = useState(contexts[0].id);
  const [answers, setAnswers] = useState<Record<string, Record<string, Answer>>>({});

  const context = contexts.find((c) => c.id === contextId) ?? contexts[0];
  const current = answers[contextId] ?? {};

  const setAnswer = (itemId: string, value: Answer) =>
    setAnswers((prev) => ({
      ...prev,
      [contextId]: { ...(prev[contextId] ?? {}), [itemId]: value },
    }));

  const reset = () => setAnswers({});

  /**
   * Para cada objeto: en cuántos contextos fue respondido y si esas respuestas
   * coinciden. Estable en todos los contextos respondidos = núcleo; distinto en
   * alguno = penumbra.
   */
  const analysis = useMemo(() => {
    const answeredContexts = contexts.filter((c) => Object.keys(answers[c.id] ?? {}).length > 0);
    const perItem = items.map((item) => {
      const given = answeredContexts
        .map((c) => answers[c.id]?.[item.id])
        .filter(Boolean) as Answer[];
      const distinct = new Set(given);
      return {
        item,
        count: given.length,
        stable: given.length > 1 && distinct.size === 1,
        shifted: distinct.size > 1,
      };
    });
    return {
      answeredContexts: answeredContexts.length,
      comparable: perItem.filter((p) => p.count > 1).length,
      shifted: perItem.filter((p) => p.shifted).length,
      perItem,
    };
  }, [answers]);

  const answeredHere = Object.keys(current).length;
  const showAnalysis = analysis.comparable > 0;

  return (
    <div className="space-y-6">
      {/* ── La regla ── */}
      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="meta">La disposición</p>
          {Object.keys(answers).length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Empezar de nuevo
            </button>
          )}
        </div>

        <p className="mt-4 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
          Ningún vehículo puede entrar al parque.
        </p>

        <p className="mt-5 text-sm text-muted-foreground">
          El texto no va a cambiar en todo el ejercicio. Lo único que cambia es
          para qué se dictó.
        </p>

        <div
          role="radiogroup"
          aria-label="Contexto de aplicación"
          className="mt-6 flex flex-wrap gap-2"
        >
          {contexts.map((c) => {
            const done = Object.keys(answers[c.id] ?? {}).length;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={c.id === contextId}
                onClick={() => setContextId(c.id)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-[0.8125rem] transition-colors',
                  c.id === contextId
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {c.label}
                {done > 0 && (
                  <span className="mono ml-2 text-[0.625rem] opacity-70">
                    {done}/{items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-4 rounded-md border-l-2 border-l-primary bg-primary/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/85">
          {context.purpose}
        </p>
      </Surface>

      {/* ── Clasificación ── */}
      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-serif text-lg text-foreground">
            ¿Cuáles quedan prohibidos bajo este propósito?
          </h3>
          <span aria-live="polite" className="mono text-[0.75rem] text-muted-foreground">
            {answeredHere} de {items.length} clasificados
          </span>
        </div>

        <ul className="grid gap-2.5 md:grid-cols-2">
          {items.map((item) => {
            const value = current[item.id];
            const info = analysis.perItem.find((p) => p.item.id === item.id);
            return (
              <li key={item.id}>
                <Surface
                  className={cn(
                    'flex h-full flex-col gap-3 p-4 transition-colors',
                    info?.shifted && 'border-warning/45',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">
                        {item.note}
                      </p>
                    </div>
                    {info?.shifted && <Badge tone="warning">Cambió</Badge>}
                    {info?.stable && <Badge tone="success">Estable</Badge>}
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`${item.label}: ¿entra al parque?`}
                    className="mt-auto flex gap-2"
                  >
                    {(['entra', 'no-entra'] as Answer[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={value === opt}
                        onClick={() => setAnswer(item.id, opt)}
                        className={cn(
                          'flex-1 rounded-md border px-3 py-1.5 text-[0.8125rem] transition-colors',
                          value === opt
                            ? opt === 'entra'
                              ? 'border-success bg-success/10 text-success'
                              : 'border-danger bg-danger/10 text-danger'
                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                        )}
                      >
                        {opt === 'entra' ? 'Puede entrar' : 'Queda prohibido'}
                      </button>
                    ))}
                  </div>
                </Surface>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Devolución ── */}
      {showAnalysis ? (
        <Surface className="p-6 sm:p-8">
          <p className="meta mb-3 text-primary">Sus propias respuestas</p>
          <p className="font-serif text-xl leading-snug text-foreground">
            Cambió {analysis.shifted} de {analysis.comparable}{' '}
            {analysis.comparable === 1 ? 'objeto comparable' : 'objetos comparables'} al
            cambiar de contexto.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            El texto de la disposición fue idéntico en los{' '}
            {analysis.answeredContexts} contextos. Si alguna respuesta cambió, no
            fue porque la regla dijera otra cosa: la regla no dice qué cuenta
            como seguirla. Eso lo aporta la práctica en que se aplica.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Los objetos marcados <span className="text-success">estables</span>{' '}
            son su núcleo de certeza; los marcados{' '}
            <span className="text-warning">cambió</span>, su zona de penumbra.
            Ninguna de las dos categorías estaba en el texto.
          </p>
        </Surface>
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center text-sm text-muted-foreground">
          Clasifique los objetos en al menos dos contextos distintos para ver la
          comparación entre sus propias respuestas.
        </p>
      )}
    </div>
  );
}
