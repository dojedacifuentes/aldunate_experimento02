import {
  informe01Cobertura,
  informe01Fuentes,
  informe01Iniciativas,
} from '@/data/informe01';
import type {
  Informe01Capacidad,
  Informe01CapacidadEstado,
  Informe01Iniciativa,
  Informe01Mecanismo,
} from '@/types';

/**
 * Capa de capacidades institucionales · metodología 2.1.
 *
 * ── Por qué existe ──────────────────────────────────────────────────────────
 *
 * La metodología 2.0 comparaba **dimensiones**: pregrado, formación continua,
 * investigación, vinculación, uso institucional, gobernanza, recursos y
 * continuidad. Es una taxonomía de *ámbitos académicos*, y como instrumento
 * comparativo tiene tres defectos que la v0.6.0 dejó a la vista.
 *
 * 1. **Dos de las ocho dimensiones no son ámbitos, sino atributos.** «Recursos y
 *    capacidades» y «Continuidad, cobertura y resultados» describen propiedades
 *    que cualquier iniciativa puede tener, no lugares donde una iniciativa
 *    ocurre. Como el dataset obliga a elegir una `primary_dimension`, ninguna
 *    iniciativa cae nunca ahí: el diplomado con dos cohortes graduadas se
 *    clasifica en «formación continua», y su continuidad —que es el dato— queda
 *    invisible. Las dos columnas vacías de la v0.6.0 son, en parte, un artefacto
 *    del modelo y no sólo un hallazgo sobre las Facultades.
 * 2. **La celda mezclaba cuánto se investigó con cuánto se hace.** Una fila más
 *    poblada indicaba dónde se buscó más. La v0.6.0 lo advertía con un aviso; un
 *    aviso no corrige una lectura visual.
 * 3. **No permitía comparar mecanismos.** Un diplomado, una guía ética y un
 *    seminario contaban lo mismo, y sumarlos produce un recuento sin
 *    significado institucional.
 *
 * ── Qué hace esta capa ──────────────────────────────────────────────────────
 *
 * Añade un eje **ortogonal** al de dimensiones, sin recodificar un solo
 * registro: diez capacidades, cada una derivada por una regla mecánica sobre
 * campos que ya estaban verificados, más el eje `mechanism` incorporado en la
 * metodología 2.1. La 2.0 se conserva íntegra y sigue publicándose.
 *
 * ── La regla que separa cobertura de capacidad ──────────────────────────────
 *
 * Es la aportación principal, y es de una línea:
 *
 * > Una ausencia sólo es informativa si se recorrió la ruta del protocolo que
 * > la habría encontrado.
 *
 * Cada capacidad declara las rutas del protocolo de trece pasos (kit §13) que
 * la acreditarían. Si no hay evidencia **y** esas rutas se recorrieron, la
 * celda dice `NO_LOCALIZADA`. Si no hay evidencia **y** la ruta no se recorrió,
 * dice `NO_CONCLUYENTE`, que no es un juicio sobre la institución sino sobre el
 * trabajo de campo. Así la desigualdad de cobertura deja de ser una advertencia
 * al pie y pasa a estar dentro de cada celda, que es donde el lector la
 * necesita (ISSUE-018).
 *
 * ── Lo que esta capa sigue sin hacer, a propósito ───────────────────────────
 *
 * No suma, no puntúa y no ordena. No hay `capacidadesAcreditadas(universidad)`
 * devolviendo un número comparable, porque contar capacidades reintroduce por
 * la puerta de atrás el ranking que DEC-102 prohíbe: cinco capacidades
 * acreditadas con cinco rutas recorridas y tres con once no son estados
 * ordenables.
 */

/* ── Vocabulario ───────────────────────────────────────────────────────────── */

export const MECANISMOS: {
  id: Informe01Mecanismo;
  label: string;
  short: string;
  definicion: string;
}[] = [
  {
    id: 'UNIDAD',
    label: 'Unidad',
    short: 'Unidad',
    definicion: 'Centro, programa, departamento, dirección, laboratorio o núcleo.',
  },
  {
    id: 'NORMA',
    label: 'Norma o política',
    short: 'Norma',
    definicion: 'Política, guía, lineamiento, decálogo o regla de integridad académica.',
  },
  {
    id: 'PROGRAMA_FORMATIVO',
    label: 'Programa formativo',
    short: 'Programa',
    definicion: 'Diplomado, diploma, minor, curso, taller o capacitación.',
  },
  {
    id: 'ASIGNATURA',
    label: 'Asignatura o malla',
    short: 'Asignatura',
    definicion: 'Actividad dentro de una asignatura o línea declarada de la malla.',
  },
  {
    id: 'HERRAMIENTA',
    label: 'Herramienta',
    short: 'Herramienta',
    definicion: 'Sistema, asistente, plataforma o licencia puesta a disposición.',
  },
  {
    id: 'PROYECTO',
    label: 'Proyecto',
    short: 'Proyecto',
    definicion: 'Investigación, I+D o adjudicación de fondo concursable.',
  },
  {
    id: 'ACTIVIDAD',
    label: 'Actividad',
    short: 'Actividad',
    definicion: 'Seminario, workshop o jornada de una sola ocurrencia.',
  },
  {
    id: 'CONVENIO',
    label: 'Convenio',
    short: 'Convenio',
    definicion: 'Acuerdo o alianza con un tercero.',
  },
  {
    id: 'PUBLICACION',
    label: 'Publicación',
    short: 'Publicación',
    definicion: 'Revista, número monográfico o línea editorial.',
  },
];

export const ESTADOS_CAPACIDAD: {
  id: Informe01CapacidadEstado;
  label: string;
  corto: string;
  definicion: string;
}[] = [
  {
    id: 'EN_OPERACION',
    label: 'En operación',
    corto: 'Operación',
    definicion:
      'La Facultad, un centro suyo o un equipo académico sostiene un mecanismo que ya funciona: actividad recurrente, unidad constituida, programa activo o instrumento vigente.',
  },
  {
    id: 'INCIPIENTE',
    label: 'Incipiente',
    corto: 'Incipiente',
    definicion:
      'Hay un mecanismo de la Facultad, pero en el primer peldaño: una actividad aislada, un piloto o un anuncio. Existe y no está en operación, que son cosas distintas.',
  },
  {
    id: 'SOLO_ENTORNO',
    label: 'Sólo en el entorno',
    corto: 'Entorno',
    definicion:
      'Lo que consta pertenece a la universidad, a una persona o al centro de alumnos, no a la Facultad de Derecho. Es contexto disponible, no capacidad propia (DEC-105).',
  },
  {
    id: 'NO_LOCALIZADA',
    label: 'No localizada',
    corto: 'No localizada',
    definicion:
      'Se recorrieron las rutas del protocolo que la habrían encontrado y no se halló evidencia pública. No significa que la capacidad no exista.',
  },
  {
    id: 'NO_CONCLUYENTE',
    label: 'No concluyente',
    corto: 'No concluyente',
    definicion:
      'La ruta del protocolo que acreditaría esta capacidad no se recorrió en esta institución. La celda no habla de la Facultad: habla del trabajo de campo.',
  },
];

/* ── Las diez capacidades ──────────────────────────────────────────────────── */

interface DefinicionCapacidad {
  id: Informe01Capacidad;
  label: string;
  short: string;
  /** La pregunta que la fila responde. Va impresa: una matriz sin preguntas es una tabla. */
  pregunta: string;
  bloque: 'estructura' | 'docencia' | 'adopcion' | 'conocimiento' | 'resultado';
  /** Escalón mínimo para considerar la capacidad en ejecución y no en anuncio. */
  escalonMinimo: 2 | 3;
  /** Rutas del protocolo (kit §13) cuya ausencia vuelve la celda no concluyente. */
  rutas: string[];
  selector: (i: Informe01Iniciativa) => boolean;
}

export const CAPACIDADES: DefinicionCapacidad[] = [
  {
    id: 'unidad',
    label: 'Unidad especializada',
    short: 'Unidad',
    pregunta: '¿Existe una estructura dedicada dentro de la Facultad?',
    bloque: 'estructura',
    escalonMinimo: 3,
    rutas: ['centros-laboratorios'],
    selector: (i) => i.mechanism === 'UNIDAD',
  },
  {
    id: 'norma',
    label: 'Norma propia',
    short: 'Norma',
    pregunta: '¿La Facultad dictó reglas sobre el uso de inteligencia artificial?',
    bloque: 'estructura',
    escalonMinimo: 3,
    rutas: ['politicas-ia', 'integridad-evaluacion'],
    selector: (i) => i.mechanism === 'NORMA',
  },
  {
    id: 'curriculo',
    label: 'Presencia en pregrado',
    short: 'Pregrado',
    // La regla mide presencia, no currículo formal, y la etiqueta lo dice. Una fila
    // rotulada «integración curricular» contradiría la conclusión C-4, que declara
    // que ninguna de las once acredita una línea obligatoria con syllabus y créditos.
    pregunta: '¿La inteligencia artificial aparece dentro de la enseñanza de pregrado?',
    bloque: 'docencia',
    escalonMinimo: 2,
    rutas: ['malla-curricular', 'programas-syllabus'],
    selector: (i) => i.dimension === 'pregrado',
  },
  {
    id: 'formacion',
    label: 'Formación estructurada',
    short: 'Formación',
    pregunta: '¿Hay diplomados, minors, cursos o capacitaciones con IA?',
    bloque: 'docencia',
    escalonMinimo: 2,
    rutas: ['postgrado-formacion-continua'],
    selector: (i) => i.mechanism === 'PROGRAMA_FORMATIVO',
  },
  {
    id: 'herramienta',
    label: 'Herramienta desplegada',
    short: 'Herramienta',
    pregunta: '¿Hay un sistema de IA efectivamente a disposición?',
    bloque: 'adopcion',
    escalonMinimo: 2,
    rutas: ['herramientas-licencias-convenios'],
    selector: (i) => i.mechanism === 'HERRAMIENTA',
  },
  {
    id: 'adopcion',
    label: 'Adopción en la enseñanza',
    short: 'Adopción',
    pregunta: '¿Consta que la IA se usa dentro de la enseñanza del Derecho?',
    bloque: 'adopcion',
    escalonMinimo: 2,
    rutas: ['herramientas-licencias-convenios', 'integridad-evaluacion'],
    selector: (i) => i.dimension === 'uso-institucional',
  },
  {
    id: 'cobertura',
    label: 'Alcance declarado',
    short: 'Alcance',
    // Declarar a quién alcanza no es medirlo. Esta fila dice si el registro
    // publica un alcance; la fila de evaluación dice si alguien midió el efecto.
    pregunta: '¿El registro declara a quién alcanza lo que se hace?',
    bloque: 'adopcion',
    escalonMinimo: 2,
    rutas: [],
    selector: (i) => i.coverage !== 'No publicada' && i.coverage !== 'No aplica',
  },
  {
    id: 'investigacion',
    label: 'Investigación',
    short: 'I+D',
    pregunta: '¿Hay proyectos o publicaciones sobre inteligencia artificial?',
    bloque: 'conocimiento',
    escalonMinimo: 2,
    rutas: ['proyectos-fondos', 'repositorios-publicaciones'],
    selector: (i) => i.mechanism === 'PROYECTO' || i.mechanism === 'PUBLICACION',
  },
  {
    id: 'transferencia',
    label: 'Transferencia',
    short: 'Transferencia',
    pregunta: '¿Hay convenios o servicios hacia fuera de la Facultad?',
    bloque: 'conocimiento',
    escalonMinimo: 2,
    rutas: ['vinculacion-transferencia'],
    selector: (i) => i.mechanism === 'CONVENIO' || i.dimension === 'vinculacion',
  },
  {
    id: 'evaluacion',
    label: 'Evaluación de efecto',
    short: 'Evaluación',
    pregunta: '¿Se midió si algo de esto mejoró el aprendizaje jurídico?',
    bloque: 'resultado',
    escalonMinimo: 2,
    // Una medición publicada aparecería antes que nada en el repositorio o en la
    // producción académica de la Facultad. La ruta se recorrió en dos de las once.
    rutas: ['repositorios-publicaciones'],
    selector: (i) => i.ladder === 4,
  },
];

export const BLOQUES_CAPACIDAD: { id: DefinicionCapacidad['bloque']; label: string }[] = [
  { id: 'estructura', label: 'Estructura y gobernanza' },
  { id: 'docencia', label: 'Docencia y formación' },
  { id: 'adopcion', label: 'Herramientas y adopción' },
  { id: 'conocimiento', label: 'Conocimiento y vínculo' },
  { id: 'resultado', label: 'Resultado' },
];

/* ── Derivación ────────────────────────────────────────────────────────────── */

/**
 * Atribuciones que cuentan como capacidad **de la Facultad**. `EQUIPO` entra
 * porque es un grupo académico de la propia Facultad; la exigencia de
 * formalización no se resuelve aquí sino en `escalonMinimo`, que es donde el kit
 * la puso. `INSTITUCIONAL_UNIVERSIDAD`, `INDIVIDUAL`, `ESTUDIANTIL` y
 * `EXTERNA_CON_PARTICIPACION` quedan fuera: DEC-105.
 */
const DE_LA_FACULTAD = new Set(['FACULTAD_DERECHO', 'CENTRO_PROGRAMA', 'EQUIPO']);

const fuentesContrastadas = new Set(
  informe01Fuentes.filter((f) => f.verifiedBy).map((f) => f.id),
);

export interface CeldaCapacidad {
  universityId: string;
  capacidad: Informe01Capacidad;
  estado: Informe01CapacidadEstado;
  /**
   * Si alguna de las fuentes que sostienen la celda pasó la verificación
   * sustantiva. **Viaja aparte del estado y nunca lo modifica**: dice cuánto
   * hemos comprobado nosotros, no cuánto hace la institución. Se dibuja como
   * marca, jamás como color más intenso.
   */
  contrastada: boolean;
  /** Las iniciativas que sostienen la celda. Vacío en los dos estados de ausencia. */
  iniciativas: Informe01Iniciativa[];
  /** Por qué la celda dice lo que dice, en una frase. Va al título accesible y al anexo. */
  motivo: string;
  /** Rutas del protocolo declaradas para esta capacidad que no se recorrieron aquí. */
  rutasSinRecorrer: string[];
}

export function celdaCapacidad(
  universityId: string,
  capacidad: Informe01Capacidad,
): CeldaCapacidad {
  const def = CAPACIDADES.find((c) => c.id === capacidad)!;
  const cobertura = informe01Cobertura.find((c) => c.universityId === universityId);
  const rutasSinRecorrer = def.rutas.filter((r) => cobertura?.routesMissing.includes(r));

  const candidatas = informe01Iniciativas.filter(
    (i) => i.universityId === universityId && def.selector(i),
  );
  const propias = candidatas.filter((i) => DE_LA_FACULTAD.has(i.attribution));
  const enOperacion = propias.filter((i) => i.ladder >= def.escalonMinimo);
  const contrastada = (xs: Informe01Iniciativa[]) =>
    xs.some((i) => i.sourceIds.some((s) => fuentesContrastadas.has(s)));

  const base = { universityId, capacidad, rutasSinRecorrer };

  if (enOperacion.length)
    return {
      ...base,
      estado: 'EN_OPERACION',
      contrastada: contrastada(enOperacion),
      iniciativas: enOperacion,
      motivo: `${plural(enOperacion.length, 'mecanismo', 'mecanismos')} de la Facultad en el peldaño ${def.escalonMinimo} o superior.`,
    };

  if (propias.length)
    return {
      ...base,
      estado: 'INCIPIENTE',
      contrastada: contrastada(propias),
      iniciativas: propias,
      motivo: `${plural(propias.length, 'mecanismo', 'mecanismos')} de la Facultad, ${propias.length === 1 ? 'todavía en el primer peldaño' : 'todos en el primer peldaño'}: actividad aislada, piloto o anuncio.`,
    };

  if (candidatas.length)
    return {
      ...base,
      estado: 'SOLO_ENTORNO',
      contrastada: contrastada(candidatas),
      iniciativas: candidatas,
      motivo:
        'Lo que consta pertenece a la universidad, a una persona o al centro de alumnos, no a la Facultad de Derecho.',
    };

  if (rutasSinRecorrer.length)
    return {
      ...base,
      estado: 'NO_CONCLUYENTE',
      contrastada: false,
      iniciativas: [],
      motivo: `No se recorrió ${plural(rutasSinRecorrer.length, 'la ruta', 'las rutas')} ${rutasSinRecorrer.join(', ')}. La celda habla del trabajo de campo, no de la Facultad.`,
    };

  return {
    ...base,
    estado: 'NO_LOCALIZADA',
    contrastada: false,
    iniciativas: [],
    motivo: def.rutas.length
      ? 'Se recorrieron las rutas que la habrían encontrado y no se localizó evidencia pública.'
      : 'Ningún registro del corpus declara esta capacidad.',
  };
}

const plural = (n: number, uno: string, varios: string) =>
  `${n} ${n === 1 ? uno : varios}`;

/** La matriz entera, en el orden en que se publica. Filas alfabéticas, sin puntaje. */
export function matrizCapacidades(universityIds: string[]) {
  return CAPACIDADES.map((def) => ({
    definicion: def,
    celdas: universityIds.map((id) => celdaCapacidad(id, def.id)),
  }));
}

/**
 * Reparto de estados en una capacidad. Es la lectura por fila: cuántas
 * instituciones la acreditan y en cuántas la pregunta sigue abierta porque no se
 * buscó. **No se suma por columna**: eso sería un ranking.
 */
export function repartoDeCapacidad(capacidad: Informe01Capacidad, universityIds: string[]) {
  const celdas = universityIds.map((id) => celdaCapacidad(id, capacidad));
  const cuenta = (e: Informe01CapacidadEstado) =>
    celdas.filter((c) => c.estado === e).length;
  return {
    EN_OPERACION: cuenta('EN_OPERACION'),
    INCIPIENTE: cuenta('INCIPIENTE'),
    SOLO_ENTORNO: cuenta('SOLO_ENTORNO'),
    NO_LOCALIZADA: cuenta('NO_LOCALIZADA'),
    NO_CONCLUYENTE: cuenta('NO_CONCLUYENTE'),
    contrastadas: celdas.filter((c) => c.contrastada).length,
  };
}

/** Mecanismos observados en una institución, con cuántas iniciativas los usan. */
export function mecanismosDe(universityId: string) {
  const inis = informe01Iniciativas.filter((i) => i.universityId === universityId);
  return MECANISMOS.map((m) => ({
    ...m,
    iniciativas: inis.filter((i) => i.mechanism === m.id),
  })).filter((m) => m.iniciativas.length > 0);
}

/** Distribución de mecanismos en toda la cohorte. Sustituye al recuento de iniciativas. */
export function distribucionMecanismos() {
  return MECANISMOS.map((m) => ({
    ...m,
    iniciativas: informe01Iniciativas.filter((i) => i.mechanism === m.id),
    deLaFacultad: informe01Iniciativas.filter(
      (i) => i.mechanism === m.id && DE_LA_FACULTAD.has(i.attribution),
    ).length,
  }));
}

/**
 * Instituciones donde una capacidad está acreditada o declarada, con el mecanismo
 * concreto con que lo hacen. Es el insumo del comparador de mecanismos: responde
 * «¿con qué instrumento lo resolvió quien ya lo resolvió?» y no «¿quién va
 * primero?».
 */
export function referentesDe(capacidad: Informe01Capacidad, universityIds: string[]) {
  return universityIds
    .map((id) => celdaCapacidad(id, capacidad))
    .filter((c) => c.estado === 'EN_OPERACION')
    .map((c) => ({
      universityId: c.universityId,
      estado: c.estado,
      contrastada: c.contrastada,
      iniciativas: c.iniciativas,
    }));
}
