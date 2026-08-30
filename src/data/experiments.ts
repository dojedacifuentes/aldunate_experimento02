import type { Experiment } from '@/types';

/**
 * Experimentos.
 *
 * Aquí un prototipo argumenta mejor que un párrafo. Todo lo que se muestre con
 * contenido de demostración lleva `demoContent: true` y la interfaz lo rotula:
 * un ejemplo sin etiqueta se convierte en dato al segundo día.
 */

export const experiments: Experiment[] = [
  {
    id: 'constitution-lab',
    slug: 'constitucion',
    title: 'Constitution Lab',
    tagline: 'Ama tu Constitución',
    description:
      'Espacio para manipular texto constitucional y observar qué se rompe. Cambiar una palabra, seguir la remisión, ver hasta dónde llega la onda expansiva. La Constitución todavía no tiene botón de deshacer; aquí sí, y esa diferencia es el ejercicio.',
    status: 'jugable',
    demoContent: true,
    family: 'constitucion',
    href: '/experimentos/constitucion',
  },
  {
    id: 'mapa-calor',
    slug: 'constitucion',
    title: 'Mapa de calor constitucional',
    tagline: 'Dónde se concentra la disputa',
    description:
      'Visualización de densidad: qué artículos concentran remisiones, reformas o litigio. La intensidad de un texto no está repartida de manera uniforme y el mapa lo hace evidente.',
    status: 'idea',
    demoContent: true,
    family: 'constitucion',
    href: '/experimentos/constitucion',
  },
  {
    id: 'gramatiquerias',
    slug: 'gramatiquerias',
    title: 'Gramatiquerías',
    tagline: 'La coma que decide el caso',
    description:
      'Colección de ejercicios sobre ambigüedad sintáctica en textos normativos. Una misma oración, dos lecturas legítimas, consecuencias jurídicas distintas. El lenguaje no es el envase de la norma: es la norma.',
    status: 'jugable',
    demoContent: true,
    family: 'gramatiquerias',
    href: '/experimentos/gramatiquerias',
  },
  {
    id: 'wittgenstein',
    slug: 'gramatiquerias',
    title: 'Wittgenstein: ¿qué regla estás siguiendo?',
    tagline: 'Seguir una regla no es obedecer un texto',
    description:
      '«Ningún vehículo puede entrar al parque»: ocho objetos, tres propósitos distintos y el mismo texto en los tres. El ejercicio no corrige respuestas; devuelve las suyas y muestra cuáles cambió al cambiar el contexto. Núcleo y penumbra no estaban en la disposición.',
    status: 'jugable',
    demoContent: true,
    family: 'gramatiquerias',
    href: '/experimentos/gramatiquerias',
  },
  {
    id: 'borges',
    slug: 'gramatiquerias',
    title: 'Borges: el jardín de las interpretaciones que se bifurcan',
    tagline: 'Todas las lecturas posibles, simultáneas',
    description:
      'Una disposición y unos hechos fijos, desplegados como árbol de interpretaciones. Cada nodo es una decisión hermenéutica apoyada en un canon reconocible; cada hoja, un desenlace distinto. Cinco resultados defendibles del mismo texto, desde el archivo sin sanción hasta la agravada contra dos personas.',
    status: 'jugable',
    demoContent: true,
    family: 'lectura',
    href: '/experimentos/gramatiquerias',
  },
  {
    id: 'eco',
    slug: 'gramatiquerias',
    title: 'Módulo Eco',
    tagline: 'Los límites de la interpretación',
    description:
      'Contrapeso del jardín anterior: no toda lectura es admisible. Ejercicios sobre sobreinterpretación y sobre qué hace que una interpretación jurídica sea defendible y no simplemente ingeniosa.',
    status: 'idea',
    demoContent: true,
    family: 'lectura',
    href: '/experimentos/gramatiquerias',
  },
  {
    id: 'ley-audaces',
    slug: 'juegos',
    title: 'La Ley de los Audaces',
    tagline: 'Juego de decisión normativa',
    description:
      'Se legisla bajo presión de tiempo e información incompleta. Cada decisión produce consecuencias que aparecen varias jugadas después, cuando ya es tarde para atribuirlas a su causa.',
    status: 'idea',
    demoContent: true,
    family: 'juegos',
    href: '/experimentos/juegos',
  },
  {
    id: 'lex-note',
    slug: 'juegos',
    title: 'Lex Note',
    tagline: 'Anotación jurídica con trazabilidad',
    description:
      'Herramienta de lectura anotada: cada nota queda vinculada a su fragmento de origen y a su fuente. Pensada para que una idea de marzo siga siendo verificable en octubre.',
    status: 'idea',
    demoContent: true,
    family: 'juegos',
    href: '/experimentos/juegos',
  },
];

export const experimentFamilies = [
  {
    id: 'constitucion' as const,
    label: 'Constitución',
    href: '/experimentos/constitucion',
    blurb:
      'Texto constitucional como objeto manipulable: qué se rompe cuando se cambia una palabra.',
  },
  {
    id: 'gramatiquerias' as const,
    label: 'Gramatiquerías',
    href: '/experimentos/gramatiquerias',
    blurb:
      'Lenguaje, ambigüedad e interpretación. Donde la sintaxis decide el resultado.',
  },
  {
    id: 'juegos' as const,
    label: 'Juegos',
    href: '/experimentos/juegos',
    blurb:
      'Piezas jugables sobre decisión normativa, lectura anotada y consecuencias diferidas.',
  },
];
