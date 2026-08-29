import type { EvidenceClaim, EvidenceLevel, Source, Tone } from '@/types';

/**
 * Capa de investigación profunda.
 *
 * Es la capa de verdad del proyecto: los textos y gráficos deben poder apuntar
 * a un `source_id` de aquí. Arranca vacía porque todavía no hay fuentes
 * cargadas, y una matriz de evidencia con datos de ejemplo es peor que ninguna.
 *
 * Espeja `content/research/source-registry.csv` y `evidence-matrix.csv`.
 */

export const evidenceLevels: Record<
  EvidenceLevel,
  { label: string; definition: string; tone: Tone }
> = {
  FACT: {
    label: 'Hecho',
    definition:
      'Verificable en fuente pública citable. Cualquiera puede abrir el documento y comprobarlo.',
    tone: 'success',
  },
  SIGNAL: {
    label: 'Señal',
    definition:
      'Indicio real pero parcial. Sugiere una dirección; no autoriza a generalizar.',
    tone: 'signal',
  },
  INFERENCE: {
    label: 'Inferencia',
    definition:
      'Conclusión derivada de evidencia disponible. La cadena de razonamiento queda explícita.',
    tone: 'warning',
  },
  HYPOTHESIS: {
    label: 'Hipótesis',
    definition:
      'Formulación por contrastar. Se publica como pregunta, nunca como hallazgo.',
    tone: 'accent',
  },
  PENDING: {
    label: 'Pendiente',
    definition:
      'Dato identificado como necesario y aún no obtenido. El hueco se declara.',
    tone: 'muted',
  },
};

/** El método, escrito para poder ser incumplido a la vista de todos. */
export const researchPrinciples = [
  {
    title: 'Fuente antes que dato',
    body: 'Nada entra al informe sin pasar primero por el registro de fuentes, con URL y fecha de consulta. Un dato sin procedencia no es un dato: es un rumor con formato.',
  },
  {
    title: 'La cadena completa',
    body: 'Fuente → evidencia → dato → visualización → conclusión. Cada eslabón debe poder recorrerse hacia atrás desde el gráfico hasta el documento original.',
  },
  {
    title: 'Cinco niveles, no dos',
    body: 'Hecho, señal, inferencia, hipótesis y pendiente. Colapsarlos en «cierto / falso» es la forma más rápida de convertir una investigación en una opinión.',
  },
  {
    title: 'La ausencia se registra',
    body: 'No encontrar evidencia pública de algo no prueba que no exista. Se anota como ausencia de evidencia y se distingue de la evidencia de ausencia.',
  },
  {
    title: 'Sin salto de generalización',
    body: '«Varias universidades hacen X» no autoriza «X es la tendencia dominante». El salto requiere cobertura, no entusiasmo.',
  },
  {
    title: 'Todo dato tiene fecha',
    body: 'El campo cambia más rápido que el ciclo de verificación. Una cifra sin `last_verified` es una cifra que ya no se puede defender.',
  },
];

export const sources: Source[] = [];

export const claims: EvidenceClaim[] = [];

export function sourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

/** Campos del registro, expuestos en la interfaz para que el método sea auditable. */
export const sourceSchema = [
  { field: 'source_id', desc: 'Identificador estable y citable dentro del proyecto.' },
  { field: 'title', desc: 'Título del documento o página.' },
  { field: 'organization', desc: 'Institución o autor responsable.' },
  { field: 'url', desc: 'Enlace directo al material consultado.' },
  { field: 'published_date', desc: 'Fecha de publicación declarada por la fuente.' },
  { field: 'accessed_date', desc: 'Fecha en que se consultó. Internet se edita.' },
  { field: 'geography', desc: 'Jurisdicción o ámbito territorial.' },
  { field: 'evidence_type', desc: 'Norma, política, programa, nota de prensa, artículo, dato.' },
  { field: 'confidence', desc: '0–100. Cuánto sostiene la fuente lo que se le atribuye.' },
  { field: 'notes', desc: 'Reservas, contexto y advertencias de lectura.' },
];

export const claimSchema = [
  { field: 'claim_id', desc: 'Identificador de la afirmación.' },
  { field: 'claim', desc: 'La afirmación, redactada de forma comprobable.' },
  { field: 'classification', desc: 'FACT · SIGNAL · INFERENCE · HYPOTHESIS · PENDING.' },
  { field: 'source_id', desc: 'Fuente o fuentes que la sostienen.' },
  { field: 'excerpt_or_note', desc: 'Fragmento citado o nota de lectura.' },
  { field: 'confidence', desc: '0–100.' },
  { field: 'report', desc: 'Informe donde se utiliza.' },
  { field: 'last_verified', desc: 'Última comprobación efectiva.' },
];
