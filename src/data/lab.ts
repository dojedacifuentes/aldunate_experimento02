import type { LabCategory, LabTool, Tone, ToolStatus } from '@/types';

/**
 * Lab IA + Derecho.
 *
 * Criterio: el laboratorio cataloga *trabajo propio* — herramientas, flujos y
 * prototipos de este proyecto —, no logos de proveedores. Cada ficha declara
 * qué entra, qué sale y qué NO hace. Las limitaciones se muestran siempre.
 *
 * Ninguna entrada se marca `stable` sin uso real documentado.
 */

export const labCategories: { id: LabCategory; label: string; blurb: string }[] = [
  {
    id: 'prompting-juridico',
    label: 'Prompting jurídico',
    blurb: 'Formulación de instrucciones para tareas jurídicas acotadas y auditables.',
  },
  {
    id: 'flujos-verificables',
    label: 'Flujos verificables',
    blurb: 'Procedimientos donde cada afirmación queda anclada a una fuente comprobable.',
  },
  {
    id: 'analisis-documental',
    label: 'Análisis documental',
    blurb: 'Lectura asistida de sentencias, normas y documentos extensos.',
  },
  {
    id: 'comparacion-modelos',
    label: 'Comparación de modelos',
    blurb: 'Mismo insumo, distintos sistemas, diferencias registradas.',
  },
  {
    id: 'prototipos',
    label: 'Prototipos',
    blurb: 'Piezas jugables que existen para probar una idea, no para escalar.',
  },
  {
    id: 'visualizacion-juridica',
    label: 'Visualización jurídica',
    blurb: 'Estructura normativa y argumental convertida en algo que se puede mirar.',
  },
  {
    id: 'agentes-automatizacion',
    label: 'Agentes y automatización',
    blurb: 'Encadenamiento de tareas con supervisión humana explícita.',
  },
  {
    id: 'evaluacion-trazabilidad',
    label: 'Evaluación y trazabilidad',
    blurb: 'Cómo se mide si una salida sirve, y cómo se demuestra de dónde vino.',
  },
  {
    id: 'seguridad-privacidad',
    label: 'Seguridad y privacidad',
    blurb: 'Datos sensibles, confidencialidad y lo que no debe salir del escritorio.',
  },
  {
    id: 'ensenanza-asistida',
    label: 'Enseñanza jurídica asistida',
    blurb: 'Material docente, ejercicios y evaluación con apoyo de IA.',
  },
];

export const statusMeta: Record<ToolStatus, { label: string; tone: Tone }> = {
  idea: { label: 'Idea', tone: 'muted' },
  prototype: { label: 'Prototipo', tone: 'signal' },
  beta: { label: 'Beta', tone: 'warning' },
  stable: { label: 'Estable', tone: 'success' },
  archived: { label: 'Archivado', tone: 'muted' },
};

export const labTools: LabTool[] = [
  {
    id: 'prompt-juridico-acotado',
    title: 'Prompt jurídico acotado',
    summary:
      'Plantilla que obliga a declarar jurisdicción, materia, fuente admisible y criterio de rechazo antes de pedir nada. Reduce la respuesta ambiciosa y falsa a una respuesta modesta y comprobable.',
    status: 'prototype',
    category: 'prompting-juridico',
    maturity: 'en-prueba',
    inputs: ['Problema jurídico', 'Jurisdicción', 'Fuentes admisibles', 'Formato de salida'],
    outputs: ['Instrucción estructurada', 'Criterios de verificación asociados'],
    limitations: [
      'No valida el contenido normativo: valida la forma de la pregunta.',
      'No sustituye la lectura de la fuente citada.',
      'Rendimiento no medido de forma sistemática entre modelos.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'flujo-verificable',
    title: 'Flujo verificable',
    summary:
      'Procedimiento de cuatro pasos —afirmar, localizar, cotejar, registrar— que impide que una cita llegue al documento final sin haber sido abierta por una persona.',
    status: 'prototype',
    category: 'flujos-verificables',
    maturity: 'en-prueba',
    inputs: ['Borrador con afirmaciones', 'Listado de fuentes candidatas'],
    outputs: ['Afirmaciones con `source_id`', 'Bitácora de verificación', 'Lista de pendientes'],
    limitations: [
      'El cuello de botella sigue siendo humano: alguien tiene que abrir la fuente.',
      'No detecta fuentes reales mal interpretadas, solo fuentes ausentes.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'lector-sentencias',
    title: 'Lectura estructurada de sentencias',
    summary:
      'Descompone una resolución en hechos, cuestión debatida, razonamiento y decisión, dejando visible qué parte del texto sostiene cada bloque.',
    status: 'idea',
    category: 'analisis-documental',
    maturity: 'exploratoria',
    inputs: ['Texto completo de la resolución'],
    outputs: ['Estructura por bloques', 'Citas ancladas al párrafo de origen'],
    limitations: [
      'Sin corpus de prueba cargado todavía.',
      'La segmentación de razonamiento es interpretativa y debe revisarse.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'banco-comparacion',
    title: 'Banco de comparación de modelos',
    summary:
      'Mismo conjunto de tareas jurídicas ejecutado en distintos sistemas, con las diferencias registradas en vez de promediadas.',
    status: 'idea',
    category: 'comparacion-modelos',
    maturity: 'exploratoria',
    inputs: ['Batería de tareas', 'Rúbrica de evaluación'],
    outputs: ['Tabla comparativa', 'Casos de divergencia documentados'],
    limitations: [
      'Sin rúbrica cerrada: comparar sin criterio publicado es ruido con tabla.',
      'Los resultados caducan con cada actualización de modelo.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'mapa-normativo',
    title: 'Mapa de estructura normativa',
    summary:
      'Representación navegable de la arquitectura de un texto normativo: qué remite a qué, qué depende de qué, dónde se concentran las remisiones.',
    status: 'idea',
    category: 'visualizacion-juridica',
    maturity: 'exploratoria',
    inputs: ['Texto normativo estructurado'],
    outputs: ['Grafo de remisiones', 'Métricas de densidad'],
    limitations: [
      'Requiere el texto ya segmentado por artículo e inciso.',
      'Una remisión detectada no equivale a una relación jurídica relevante.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'rubrica-trazabilidad',
    title: 'Rúbrica de trazabilidad',
    summary:
      'Instrumento para calificar un trabajo por la solidez de su cadena de evidencia y no solo por su redacción final.',
    status: 'prototype',
    category: 'evaluacion-trazabilidad',
    maturity: 'en-prueba',
    inputs: ['Trabajo escrito', 'Registro de fuentes del autor'],
    outputs: ['Puntaje por dimensión', 'Observaciones accionables'],
    limitations: [
      'Diseñada para trabajos con fuentes públicas; no cubre material reservado.',
      'No mide originalidad ni calidad argumental.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'protocolo-datos-sensibles',
    title: 'Protocolo de datos sensibles',
    summary:
      'Lista de decisión sobre qué material jurídico no debe entrar nunca a un sistema de terceros, y qué hacer cuando ya entró.',
    status: 'idea',
    category: 'seguridad-privacidad',
    maturity: 'exploratoria',
    inputs: ['Tipo de documento', 'Naturaleza de los datos', 'Contexto de uso'],
    outputs: ['Decisión de tratamiento', 'Medidas de mitigación'],
    limitations: [
      'Orientación de trabajo interno, no asesoría en protección de datos.',
      'Pendiente de revisión frente a normativa chilena vigente.',
    ],
    updatedAt: '2026-08-29',
  },
  {
    id: 'taller-docente',
    title: 'Secuencia docente asistida',
    summary:
      'Estructura de sesión para enseñar uso verificable de IA en Derecho: una tarea, un error inducido, una verificación, un registro.',
    status: 'prototype',
    category: 'ensenanza-asistida',
    maturity: 'en-prueba',
    inputs: ['Objetivo de aprendizaje', 'Duración', 'Nivel del grupo'],
    outputs: ['Guion de sesión', 'Material de sala', 'Instrumento de cierre'],
    limitations: [
      'Probada en formato taller corto; sin evidencia en curso semestral completo.',
      'Depende fuertemente de la preparación previa del docente.',
    ],
    updatedAt: '2026-08-29',
  },
];
