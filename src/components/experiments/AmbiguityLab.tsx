'use client';

import { useState } from 'react';
import { Surface } from '@/components/common/ui';
import { cn } from '@/lib/utils';

/**
 * Ejercicio de ambigüedad sintáctica.
 *
 * Una misma oración normativa, dos análisis igualmente gramaticales, dos
 * consecuencias jurídicas incompatibles. La pieza no resuelve la ambigüedad:
 * la vuelve visible. Elegir una lectura es una decisión, y este componente
 * existe para que se note que alguien la tomó.
 *
 * Texto de demostración. No corresponde a norma vigente.
 */

interface Reading {
  id: string;
  label: string;
  /** Fragmentos de la oración, marcando los que esta lectura agrupa. */
  parse: { text: string; bound: boolean }[];
  gloss: string;
  consequence: string;
}

interface Case {
  id: string;
  title: string;
  sentence: string;
  pivot: string;
  readings: [Reading, Reading];
}

const cases: Case[] = [
  {
    id: 'coma',
    title: 'El adjetivo y los dos sustantivos',
    sentence:
      'Quedan exentos los establecimientos educacionales y hospitales públicos.',
    pivot: '¿«públicos» alcanza también a los establecimientos educacionales?',
    readings: [
      {
        id: 'amplia',
        label: 'Lectura amplia',
        parse: [
          { text: 'Quedan exentos los ', bound: false },
          { text: 'establecimientos educacionales', bound: true },
          { text: ' y ', bound: false },
          { text: 'hospitales', bound: true },
          { text: ' ', bound: false },
          { text: 'públicos', bound: true },
          { text: '.', bound: false },
        ],
        gloss:
          '«Públicos» modifica a los dos sustantivos coordinados. La exención cubre establecimientos educacionales públicos y hospitales públicos.',
        consequence:
          'Un colegio particular queda fuera de la exención. El universo de beneficiarios se reduce.',
      },
      {
        id: 'restringida',
        label: 'Lectura restringida',
        parse: [
          { text: 'Quedan exentos los ', bound: false },
          { text: 'establecimientos educacionales', bound: false },
          { text: ' y ', bound: false },
          { text: 'hospitales', bound: true },
          { text: ' ', bound: false },
          { text: 'públicos', bound: true },
          { text: '.', bound: false },
        ],
        gloss:
          '«Públicos» modifica solo al sustantivo más cercano. La exención cubre todos los establecimientos educacionales y, además, los hospitales públicos.',
        consequence:
          'Un colegio particular queda exento. El universo de beneficiarios se amplía considerablemente.',
      },
    ],
  },
  {
    id: 'alcance',
    title: 'La excepción y su alcance',
    sentence:
      'Se prohíbe el ingreso de vehículos y maquinaria, salvo autorización escrita.',
    pivot: '¿La excepción alcanza a los vehículos, o solo a la maquinaria?',
    readings: [
      {
        id: 'ambos',
        label: 'Excepción general',
        parse: [
          { text: 'Se prohíbe el ingreso de ', bound: false },
          { text: 'vehículos', bound: true },
          { text: ' y ', bound: false },
          { text: 'maquinaria', bound: true },
          { text: ', ', bound: false },
          { text: 'salvo autorización escrita', bound: true },
          { text: '.', bound: false },
        ],
        gloss:
          'La cláusula final modifica toda la enumeración. Con autorización escrita puede ingresar cualquiera de los dos.',
        consequence:
          'La autorización es una vía general de excepción. La prohibición es más débil de lo que aparenta.',
      },
      {
        id: 'ultimo',
        label: 'Excepción acotada',
        parse: [
          { text: 'Se prohíbe el ingreso de ', bound: false },
          { text: 'vehículos', bound: false },
          { text: ' y ', bound: false },
          { text: 'maquinaria', bound: true },
          { text: ', ', bound: false },
          { text: 'salvo autorización escrita', bound: true },
          { text: '.', bound: false },
        ],
        gloss:
          'La cláusula final modifica solo al último elemento. Los vehículos quedan prohibidos sin excepción posible.',
        consequence:
          'La prohibición de vehículos es absoluta. Ninguna autorización la levanta.',
      },
    ],
  },
];

export function AmbiguityLab() {
  return (
    <div className="space-y-6">
      {cases.map((item) => (
        <CaseCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function CaseCard({ item }: { item: Case }) {
  const [activeId, setActiveId] = useState(item.readings[0].id);
  const active = item.readings.find((r) => r.id === activeId) ?? item.readings[0];

  return (
    <Surface className="overflow-hidden p-6 sm:p-8">
      <p className="meta mb-3">{item.title}</p>

      {/* La oración, con el análisis de la lectura activa resaltado. */}
      <p className="font-serif text-xl leading-relaxed text-foreground sm:text-2xl">
        {active.parse.map((frag, i) => (
          <span
            key={i}
            className={cn(
              'transition-colors duration-300',
              frag.bound &&
                'rounded bg-primary/15 px-0.5 text-primary decoration-primary/50 underline-offset-4',
            )}
          >
            {frag.text}
          </span>
        ))}
      </p>

      <p className="mt-4 text-sm italic text-muted-foreground">{item.pivot}</p>

      {/* Selector de lectura. */}
      <div
        role="radiogroup"
        aria-label={`Lecturas de: ${item.title}`}
        className="mt-6 flex flex-wrap gap-2"
      >
        {item.readings.map((reading) => (
          <button
            key={reading.id}
            type="button"
            role="radio"
            aria-checked={reading.id === activeId}
            onClick={() => setActiveId(reading.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-[0.8125rem] transition-colors',
              reading.id === activeId
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {reading.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2">
        <div>
          <p className="meta mb-1.5">Análisis</p>
          <p className="text-sm leading-relaxed text-foreground/85">{active.gloss}</p>
        </div>
        <div>
          <p className="meta mb-1.5 text-warning">Consecuencia</p>
          <p className="text-sm leading-relaxed text-foreground/85">{active.consequence}</p>
        </div>
      </div>
    </Surface>
  );
}
