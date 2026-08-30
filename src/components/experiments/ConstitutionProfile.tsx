'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Surface } from '@/components/common/ui';
import { cn } from '@/lib/utils';

/**
 * Ama tu Constitución — perfil de preferencias institucionales.
 *
 * Ocho dimensiones de diseño constitucional. En cada una se elige una posición
 * dentro de un eje continuo, y la salida es una representación de esas
 * elecciones, no un veredicto.
 *
 * Lo que el módulo NO hace, deliberadamente:
 *  - no puntúa, no dice qué posición es correcta;
 *  - no asigna etiquetas de identidad política («usted es X»);
 *  - no compara contra ningún país ni ninguna constitución real, porque eso
 *    exigiría un dataset validado que todavía no existe.
 *
 * Lo que sí devuelve —y es el punto— son las tensiones internas: pares de
 * elecciones que empujan en direcciones opuestas. Un test de personalidad da
 * una respuesta; un ejercicio de diseño institucional debería dar un problema.
 */

interface Dimension {
  id: string;
  title: string;
  question: string;
  /** Extremo bajo (valor 0) y extremo alto (valor 4). */
  low: string;
  high: string;
  axis: string;
}

const dimensions: Dimension[] = [
  {
    id: 'rigidez',
    title: 'Rigidez',
    question: '¿Cuánto debe costar reformar la Constitución?',
    axis: 'Flexible ← → Rígida',
    low: 'Reforma por mayoría ordinaria: el texto se adapta al presente.',
    high: 'Quórums altos y trámites agravados: el texto resiste al presente.',
  },
  {
    id: 'reforma',
    title: 'Vía de reforma',
    question: '¿Quién tiene la última palabra sobre el cambio constitucional?',
    axis: 'Representativa ← → Directa',
    low: 'El órgano legislativo decide y responde políticamente por ello.',
    high: 'Ratificación ciudadana obligatoria para toda reforma sustantiva.',
  },
  {
    id: 'ejecutivo',
    title: 'Poder ejecutivo',
    question: '¿Cuánta concentración de poder admite el Ejecutivo?',
    axis: 'Parlamentario ← → Presidencial fuerte',
    low: 'Gobierno responsable ante el legislativo, removible sin crisis.',
    high: 'Presidencia con mandato propio, veto y potestad reglamentaria amplia.',
  },
  {
    id: 'derechos',
    title: 'Catálogo de derechos',
    question: '¿Qué densidad debe tener el catálogo de derechos?',
    axis: 'Mínimo ← → Extenso',
    low: 'Pocos derechos, formulados con precisión y directamente exigibles.',
    high: 'Catálogo amplio, incluidos derechos sociales de realización progresiva.',
  },
  {
    id: 'justicia',
    title: 'Justicia constitucional',
    question: '¿Cuánto puede un tribunal invalidar decisiones del legislador?',
    axis: 'Deferente ← → Activa',
    low: 'Control acotado: la última palabra sustantiva es del legislador.',
    high: 'Control fuerte: el tribunal invalida leyes por incompatibilidad material.',
  },
  {
    id: 'descentralizacion',
    title: 'Descentralización',
    question: '¿Dónde reside la competencia por defecto?',
    axis: 'Central ← → Territorial',
    low: 'Estado unitario con desconcentración administrativa.',
    high: 'Autonomías con competencias propias y recursos garantizados.',
  },
  {
    id: 'participacion',
    title: 'Participación',
    question: '¿Qué lugar ocupan los mecanismos de democracia directa?',
    axis: 'Excepcional ← → Ordinaria',
    low: 'Consultas reservadas a decisiones fundacionales.',
    high: 'Iniciativa popular, revocatoria y referéndum como herramientas habituales.',
  },
  {
    id: 'excepcion',
    title: 'Estados de excepción',
    question: '¿Cuánto margen tiene el poder en la emergencia?',
    axis: 'Restrictivo ← → Amplio',
    low: 'Supuestos tasados, plazos breves y control judicial y parlamentario continuo.',
    high: 'Facultades extraordinarias amplias, con control diferido.',
  },
];

/**
 * Tensiones conocidas del diseño institucional. Se activan cuando ambas
 * posiciones caen en los extremos indicados. No son errores: son costos.
 */
interface Tension {
  id: string;
  a: string;
  b: string;
  /** 'high' | 'low' para cada dimensión. */
  aSide: 'high' | 'low';
  bSide: 'high' | 'low';
  text: string;
}

const tensions: Tension[] = [
  {
    id: 't1',
    a: 'rigidez',
    aSide: 'high',
    b: 'participacion',
    bSide: 'high',
    text: 'Quiere un texto difícil de reformar y, a la vez, mecanismos de participación habituales. La ciudadanía tendrá herramientas para pedir cambios que el procedimiento hará casi imposibles de concretar.',
  },
  {
    id: 't2',
    a: 'derechos',
    aSide: 'high',
    b: 'justicia',
    bSide: 'low',
    text: 'Un catálogo extenso de derechos con control judicial deferente deja buena parte de esos derechos sin quién los haga exigibles frente al legislador.',
  },
  {
    id: 't3',
    a: 'derechos',
    aSide: 'high',
    b: 'justicia',
    bSide: 'high',
    text: 'Catálogo extenso más control fuerte traslada al tribunal decisiones distributivas de gran alcance. Es una opción defendible, pero conviene asumir que se está eligiendo quién decide, no solo qué se protege.',
  },
  {
    id: 't4',
    a: 'ejecutivo',
    aSide: 'high',
    b: 'excepcion',
    bSide: 'high',
    text: 'Ejecutivo fuerte y estados de excepción amplios se refuerzan mutuamente. El margen de la emergencia queda en las mismas manos que ya concentran el poder ordinario.',
  },
  {
    id: 't5',
    a: 'descentralizacion',
    aSide: 'high',
    b: 'ejecutivo',
    bSide: 'high',
    text: 'Autonomías con competencias propias y presidencia fuerte compiten por el mismo espacio. Sin una regla clara de conflicto competencial, la disputa se resolverá caso a caso en tribunales.',
  },
  {
    id: 't6',
    a: 'rigidez',
    aSide: 'low',
    b: 'derechos',
    bSide: 'high',
    text: 'Un catálogo extenso en un texto fácil de reformar protege menos de lo que promete: lo que una mayoría escribe, otra lo borra.',
  },
  {
    id: 't7',
    a: 'reforma',
    aSide: 'high',
    b: 'rigidez',
    bSide: 'high',
    text: 'Ratificación ciudadana obligatoria sumada a quórums agravados puede producir un texto que, en la práctica, solo cambie por crisis.',
  },
];

const STEPS = 5; // 0..4

export function ConstitutionProfile() {
  const [values, setValues] = useState<Record<string, number>>({});

  const answered = Object.keys(values).length;
  const complete = answered === dimensions.length;

  const active = useMemo(() => {
    const side = (id: string): 'high' | 'low' | null => {
      const v = values[id];
      if (v === undefined) return null;
      if (v >= 3) return 'high';
      if (v <= 1) return 'low';
      return null; // posición intermedia: no activa tensión
    };
    return tensions.filter((t) => side(t.a) === t.aSide && side(t.b) === t.bSide);
  }, [values]);

  return (
    <div className="space-y-6">
      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="meta">Ocho decisiones de diseño</p>
          <div className="flex items-center gap-4">
            <span aria-live="polite" className="mono text-[0.75rem] text-muted-foreground">
              {answered}/{dimensions.length}
            </span>
            {answered > 0 && (
              <button
                type="button"
                onClick={() => setValues({})}
                className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Reiniciar
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          No hay respuestas correctas y no se calcula un puntaje. Al terminar, el
          módulo devuelve las tensiones internas de su propia combinación: pares
          de decisiones que empujan en direcciones opuestas.
        </p>
      </Surface>

      <ul className="space-y-3">
        {dimensions.map((d) => {
          const v = values[d.id];
          return (
            <li key={d.id}>
              <Surface className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-serif text-lg text-foreground">{d.title}</h3>
                  <span className="mono text-[0.6875rem] text-muted-foreground">{d.axis}</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{d.question}</p>

                <div
                  role="radiogroup"
                  aria-label={d.question}
                  className="mt-5 flex items-stretch gap-1.5"
                >
                  {Array.from({ length: STEPS }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={v === i}
                      aria-label={`${d.title}: posición ${i + 1} de ${STEPS}`}
                      onClick={() => setValues((p) => ({ ...p, [d.id]: i }))}
                      className={cn(
                        'h-9 flex-1 rounded-md border transition-colors',
                        v === i
                          ? 'border-primary bg-primary/20'
                          : 'border-border hover:border-primary/40 hover:bg-primary/[0.06]',
                      )}
                    >
                      <span className="sr-only">{i + 1}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 text-[0.8125rem] leading-snug sm:grid-cols-2">
                  <p className={cn('text-muted-foreground', v !== undefined && v <= 1 && 'text-foreground')}>
                    {d.low}
                  </p>
                  <p className={cn('text-muted-foreground sm:text-right', v !== undefined && v >= 3 && 'text-foreground')}>
                    {d.high}
                  </p>
                </div>
              </Surface>
            </li>
          );
        })}
      </ul>

      {/* ── Devolución ── */}
      <Surface className="p-6 sm:p-8">
        <p className="meta mb-3 text-primary">Su combinación</p>

        {answered < 2 ? (
          <p className="text-sm text-muted-foreground">
            Responda al menos dos dimensiones para ver las tensiones que produce
            su combinación.
          </p>
        ) : (
          <>
            <p className="font-serif text-xl leading-snug text-foreground">
              {active.length === 0
                ? complete
                  ? 'Sin tensiones detectadas entre las que este módulo reconoce.'
                  : 'Todavía sin tensiones entre lo respondido.'
                : `${active.length} ${active.length === 1 ? 'tensión detectada' : 'tensiones detectadas'}.`}
            </p>

            {active.length > 0 && (
              <ul className="mt-5 space-y-3">
                {active.map((t) => {
                  const da = dimensions.find((d) => d.id === t.a);
                  const db = dimensions.find((d) => d.id === t.b);
                  return (
                    <li
                      key={t.id}
                      className="rounded-md border-l-2 border-l-warning bg-warning/[0.06] px-4 py-3"
                    >
                      <p className="mono mb-1.5 text-[0.625rem] uppercase tracking-widest text-warning">
                        {da?.title} × {db?.title}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/85">{t.text}</p>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-5 max-w-2xl border-t border-border/60 pt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Una tensión no es un error de su parte: es un costo que alguien
              tendrá que pagar. Las posiciones intermedias no activan tensiones,
              lo cual dice menos sobre su moderación que sobre los límites de
              este módulo.
            </p>
          </>
        )}
      </Surface>
    </div>
  );
}
