import { CAPACIDADES, celdaCapacidad, distribucionMecanismos } from '@/lib/informe01-capacidades';
import {
  informe01Afirmaciones,
  informe01Cobertura,
  informe01Evidencias,
  informe01Fuentes,
  informe01Iniciativas,
  informe01Recuento,
  informe01Universidades,
} from '@/data/informe01';
import type {
  Informe01Atribucion,
  Informe01Cobertura,
  Informe01Dimension,
  Informe01Direccion,
  Informe01Escalon,
  Informe01Evidencia,
  Informe01Fuente,
  Informe01Iniciativa,
  Informe01Universidad,
} from '@/types';

/**
 * Selectores del Informe 01.
 *
 * Aquí no hay ninguna función que sume niveles por universidad, y la ausencia es
 * deliberada: la escalera se aplica a la iniciativa y no se promedia (DEC-109).
 * Un `maturityScore(university)` es exactamente el atajo que produciría el
 * ranking que la cobertura desigual prohíbe.
 */

export const DIMENSIONES: { id: Informe01Dimension; label: string; short: string }[] = [
  { id: 'pregrado', label: 'Formación de pregrado', short: 'Pregrado' },
  { id: 'formacion-continua', label: 'Formación continua y postgrado', short: 'Continua' },
  { id: 'investigacion', label: 'Investigación y desarrollo', short: 'I+D' },
  { id: 'vinculacion', label: 'Vinculación con el medio', short: 'Vinculación' },
  { id: 'uso-institucional', label: 'Uso institucional de IA', short: 'Uso' },
  { id: 'gobernanza', label: 'Gobernanza y estrategia', short: 'Gobernanza' },
  { id: 'recursos', label: 'Recursos y capacidades', short: 'Recursos' },
  {
    id: 'continuidad-resultados',
    label: 'Continuidad, cobertura y resultados',
    short: 'Resultados',
  },
];

export const DIRECCIONES: {
  id: Informe01Direccion;
  label: string;
  definition: string;
}[] = [
  {
    id: 'IA_PARA_DERECHO',
    label: 'IA para el Derecho',
    definition:
      'La IA se usa para enseñar, investigar, redactar, litigar o atender. Es la dirección donde una Facultad cambia lo que hace.',
  },
  {
    id: 'DERECHO_DE_IA',
    label: 'Derecho de la IA',
    definition:
      'La IA es el objeto jurídico: regulación, responsabilidad, datos, propiedad intelectual, debido proceso.',
  },
  {
    id: 'AMBOS',
    label: 'Ambas direcciones',
    definition: 'La iniciativa integra las dos de forma sustantiva, no de nombre.',
  },
  {
    id: 'ADYACENTE',
    label: 'Adyacente',
    definition:
      'Innovación, datos, legaltech o tecnología donde la IA no es un componente central verificable. Se conserva como contexto y no eleva la lectura.',
  },
];

export const ESCALONES: { nivel: Informe01Escalon; label: string; condition: string }[] = [
  {
    nivel: 0,
    label: 'Sin evidencia pública',
    condition:
      'El protocolo se recorrió y no se localizó evidencia verificable. No significa que la actividad no exista.',
  },
  {
    nivel: 1,
    label: 'Exploración',
    condition: 'Anuncio, evento, piloto o iniciativa aislada.',
  },
  {
    nivel: 2,
    label: 'Operación',
    condition:
      'Actividad recurrente, curso activo o proyecto en ejecución. Varios eventos no producen este nivel por acumulación.',
  },
  {
    nivel: 3,
    label: 'Institucionalización',
    condition:
      'Responsable formal, continuidad, cobertura, política, recursos o integración curricular. Exige al menos una señal formal.',
  },
  {
    nivel: 4,
    label: 'Evaluación',
    condition:
      'Productos, resultados o efectos públicamente revisables. Contar asistentes no basta.',
  },
];

export const ATRIBUCIONES: Record<Informe01Atribucion, { label: string; note: string }> = {
  INSTITUCIONAL_UNIVERSIDAD: {
    label: 'Universidad',
    note: 'Capacidad de la institución completa. Disponible para Derecho, no desarrollada por Derecho.',
  },
  FACULTAD_DERECHO: {
    label: 'Facultad de Derecho',
    note: 'La unidad que la fuente identifica es la propia Facultad o Escuela.',
  },
  CENTRO_PROGRAMA: {
    label: 'Centro o programa',
    note: 'Una unidad especializada dentro de la Facultad.',
  },
  EQUIPO: { label: 'Equipo', note: 'Un grupo académico, sin estructura formal declarada.' },
  INDIVIDUAL: { label: 'Individual', note: 'Adjudicación o autoría de una persona.' },
  ESTUDIANTIL: {
    label: 'Estudiantil',
    note: 'Iniciativa de estudiantes. No es una capacidad de la Facultad.',
  },
  EXTERNA_CON_PARTICIPACION: {
    label: 'Externa con participación',
    note: 'La conduce otra institución y la Facultad participa.',
  },
};

/** Orden alfabético estable. Nunca por cantidad de evidencia: eso sería un ranking. */
export const universidadesOrdenadas: Informe01Universidad[] = [...informe01Universidades].sort(
  (a, b) => a.officialName.localeCompare(b.officialName, 'es'),
);

export function universidad(id: string): Informe01Universidad | undefined {
  return informe01Universidades.find((u) => u.id === id);
}

export function coberturaDe(id: string): Informe01Cobertura | undefined {
  return informe01Cobertura.find((c) => c.universityId === id);
}

export function fuentesDe(id: string): Informe01Fuente[] {
  return informe01Fuentes.filter((f) => f.universityId === id);
}

export function fuente(id: string): Informe01Fuente | undefined {
  return informe01Fuentes.find((f) => f.id === id);
}

export function iniciativasDe(id: string): Informe01Iniciativa[] {
  return informe01Iniciativas.filter((i) => i.universityId === id);
}

export function evidenciasDe(id: string): Informe01Evidencia[] {
  return informe01Evidencias.filter((e) => e.universityId === id);
}

export function evidenciasDeIniciativa(id: string): Informe01Evidencia[] {
  return informe01Evidencias.filter((e) => e.initiativeId === id);
}

export function evidencia(id: string) {
  return informe01Evidencias.find((e) => e.id === id);
}

export function afirmacionesDe(id: string) {
  return informe01Afirmaciones.filter((c) => c.universityId === id);
}

/** Afirmaciones que alcanzan a la cohorte entera o al método, no a una institución. */
export const afirmacionesDeCohorte = informe01Afirmaciones.filter((c) => !c.universityId);

/**
 * Celda de la matriz: qué se localizó de una universidad en una dimensión.
 *
 * Devuelve **cuánta evidencia se localizó** y el escalón más alto alcanzado por
 * alguna de sus iniciativas en esa dimensión. Son dos lecturas distintas y se
 * publican juntas justamente para que no se confundan: mucha evidencia con
 * escalón bajo y poca evidencia con escalón alto son estados diferentes, y
 * cualquiera de los dos números por separado los volvería indistinguibles.
 */
export interface CeldaMatriz {
  universityId: string;
  dimension: Informe01Dimension;
  evidencias: number;
  iniciativas: number;
  /** `null` cuando no se localizó ninguna iniciativa en esa dimensión. */
  escalonMaximo: Informe01Escalon | null;
  /** Sólo capacidades de la universidad, sin ninguna atribuida a Derecho. */
  soloUniversidad: boolean;
  direcciones: Informe01Direccion[];
}

export function celda(universityId: string, dimension: Informe01Dimension): CeldaMatriz {
  const inis = informe01Iniciativas.filter(
    (i) => i.universityId === universityId && i.dimension === dimension,
  );
  const evs = informe01Evidencias.filter(
    (e) => e.universityId === universityId && e.dimension === dimension,
  );
  return {
    universityId,
    dimension,
    evidencias: evs.length,
    iniciativas: inis.length,
    escalonMaximo: inis.length
      ? (Math.max(...inis.map((i) => i.ladder)) as Informe01Escalon)
      : null,
    soloUniversidad:
      inis.length > 0 && inis.every((i) => i.attribution === 'INSTITUCIONAL_UNIVERSIDAD'),
    direcciones: [...new Set(inis.map((i) => i.direction))],
  };
}

/** Distribución de iniciativas por escalón. El nivel 4 sale vacío y ése es el punto. */
export function distribucionEscalera(): { nivel: Informe01Escalon; iniciativas: Informe01Iniciativa[] }[] {
  return ESCALONES.map(({ nivel }) => ({
    nivel,
    iniciativas: informe01Iniciativas.filter((i) => i.ladder === nivel),
  }));
}

export function distribucionDirecciones() {
  return DIRECCIONES.map((d) => ({
    ...d,
    iniciativas: informe01Iniciativas.filter((i) => i.direction === d.id),
  }));
}

/** Dimensiones sin una sola evidencia en las once. Se declaran, no se ocultan. */
export function dimensionesVacias() {
  const conEvidencia = new Set(informe01Evidencias.map((e) => e.dimension));
  return DIMENSIONES.filter((d) => !conEvidencia.has(d.id));
}

/** Hitos fechados, para la línea de tiempo. Las fuentes sin fecha no se inventan. */
export function hitos() {
  return informe01Fuentes
    .filter((f) => f.publishedDate && f.universityId)
    .map((f) => ({ ...f, year: Number(f.publishedDate!.slice(0, 4)) }))
    .sort((a, b) => a.publishedDate!.localeCompare(b.publishedDate!));
}

export function fuentesSinFecha() {
  return informe01Fuentes.filter((f) => !f.publishedDate);
}

/* ── Cifras para la capa narrativa ──────────────────────────────────────────
 * La prosa del borrador cita números con marcas `{clave}` y nunca a mano. Esta
 * es la única tabla que las resuelve, de modo que la web, el Markdown, el HTML
 * y el PDF no puedan decir cifras distintas, y de modo que una verificación
 * futura que cambie el recuento cambie también el texto.                     */

export const CORTE_INFORME_01 = '1 de septiembre de 2026';

export function cifrasInforme01(): Record<string, string | number> {
  const r = informe01Recuento;
  const noVerificadas = r.fuentes - r.fuentesVerificadas;
  const universitarios = informe01Evidencias.filter(
    (e) => e.attribution === 'INSTITUCIONAL_UNIVERSIDAD',
  ).length;
  return {
    ...cifrasDeCapacidad(),
    corte: CORTE_INFORME_01,
    universidades: r.universidades,
    fuentes: r.fuentes,
    iniciativas: r.iniciativas,
    evidencias: r.evidencias,
    afirmaciones: r.afirmaciones,
    verificadas: r.fuentesVerificadas,
    noVerificadas,
    porcentajeVerificado: Math.round((r.fuentesVerificadas / r.fuentes) * 100),
    // Coma decimal. `String(3.7)` escribe «3.7», y un informe en castellano que
    // publica «3.7 veces» delata que el número salió de un programa sin pasar
    // por nadie.
    razonCobertura: String(r.razonCobertura).replace('.', ','),
    universitarios,
    evaluadas: r.iniciativasEvaluadas,
    escalon1: r.iniciativasPorEscalon['1'] ?? 0,
    escalon2: r.iniciativasPorEscalon['2'] ?? 0,
    escalon3: r.iniciativasPorEscalon['3'] ?? 0,
  };
}

/* ── Cifras derivadas de la capa de capacidades (metodología 2.1) ────────────
 * Viven aquí y no en `informe01-capacidades.ts` para que la prosa siga teniendo
 * una sola tabla de marcas. La capa de capacidades calcula; esta función nombra.
 * Ninguna de estas cifras se escribe a mano en ningún texto del informe.       */

/**
 * Cardinales en palabras, del cero al veinte.
 *
 * La prosa académica escribe «en cinco de las once Facultades» y no «en 5 de las
 * once»; mezclar dígito y palabra en la misma frase delata la interpolación. Con
 * esto la cifra sigue viniendo del dataset y el texto sigue leyéndose como texto.
 * Por encima de veinte se escribe el dígito, que es también lo que hace un
 * editor humano.
 */
const PALABRAS = [
  'cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
  'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis',
  'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
];

export const enPalabras = (n: number): string =>
  n >= 0 && n <= 20 ? PALABRAS[n] : String(n);

/**
 * Decimal en castellano: coma, no punto.
 *
 * `String(3.7)` escribe «3.7», y un informe en castellano que publica «3.7 veces
 * mayor» delata que el número salió de un programa sin pasar por nadie. Todo
 * componente que imprima una cifra con decimales del recuento pasa por aquí.
 */
export const decimal = (n: number): string => String(n).replace('.', ',');

function cifrasDeCapacidad(): Record<string, string | number> {
  const ids = universidadesOrdenadas.map((u) => u.id);
  const celdas = ids.flatMap((id) => CAPACIDADES.map((c) => celdaCapacidad(id, c.id)));
  const cuenta = (e: string) => celdas.filter((c) => c.estado === e).length;

  const enOperacionDe = (cap: string) =>
    ids.filter((id) => celdaCapacidad(id, cap as never).estado === 'EN_OPERACION').length;
  const sinConcluirDe = (cap: string) =>
    ids.filter((id) => celdaCapacidad(id, cap as never).estado === 'NO_CONCLUYENTE').length;

  const mecanismos = distribucionMecanismos();
  const mec = (id: string) => mecanismos.find((m) => m.id === id)!;

  const conFecha = informe01Iniciativas.filter((i) => i.startDate);
  const desde2025 = conFecha.filter((i) => Number(i.startDate!.slice(0, 4)) >= 2025).length;

  /* El contraejemplo que prueba que cobertura y capacidad son variables
     distintas. Se calcula, no se elige: es la institución con menos rutas
     recorridas, y su par es la que más tiene con la misma cuenta de
     capacidades. Si la verificación futura cambia el reparto, cambia el texto. */
  const perfil = ids.map((id) => ({
    id,
    nombre: universidadesOrdenadas.find((u) => u.id === id)!.officialName,
    rutas: informe01Cobertura.find((c) => c.universityId === id)!.routesCompleted,
    operacion: CAPACIDADES.filter((c) => celdaCapacidad(id, c.id).estado === 'EN_OPERACION')
      .length,
  }));
  const menos = [...perfil].sort((a, b) => a.rutas - b.rutas)[0];
  const mas = [...perfil].sort((a, b) => b.rutas - a.rutas)[0];

  /* Las mismas cifras en palabras, para la prosa que las necesita así. */
  const enLetra = {
    capacidadesPalabra: enPalabras(CAPACIDADES.length),
    unidadOperacionPalabra: enPalabras(enOperacionDe('unidad')),
    normaOperacionPalabra: enPalabras(enOperacionDe('norma')),
    pregradoOperacionPalabra: enPalabras(enOperacionDe('curriculo')),
    formacionOperacionPalabra: enPalabras(enOperacionDe('formacion')),
    normaSinConcluirPalabra: enPalabras(sinConcluirDe('norma')),
    pregradoSinConcluirPalabra: enPalabras(sinConcluirDe('curriculo')),
    evaluacionSinConcluirPalabra: enPalabras(sinConcluirDe('evaluacion')),
    investigacionSinConcluirPalabra: enPalabras(sinConcluirDe('investigacion')),
    transferenciaIncipientePalabra: enPalabras(
      ids.filter((id) => celdaCapacidad(id, 'transferencia').estado === 'INCIPIENTE').length,
    ),
    mecProgramasPalabra: enPalabras(mec('PROGRAMA_FORMATIVO').iniciativas.length),
    mecUnidadesPalabra: enPalabras(mec('UNIDAD').iniciativas.length),
    mecNormasPalabra: enPalabras(mec('NORMA').iniciativas.length),
    mecAsignaturasPalabra: enPalabras(mec('ASIGNATURA').iniciativas.length),
    mecConveniosPalabra: enPalabras(mec('CONVENIO').iniciativas.length),
    mecActividadesPalabra: enPalabras(mec('ACTIVIDAD').iniciativas.length),
    mecHerramientasPalabra: enPalabras(mec('HERRAMIENTA').iniciativas.length),
    mecHerramientasEntornoPalabra: enPalabras(
      mec('HERRAMIENTA').iniciativas.length - mec('HERRAMIENTA').deLaFacultad,
    ),
    mecProgramasFacultadPalabra: enPalabras(mec('PROGRAMA_FORMATIVO').deLaFacultad),
    universidadesPalabra: enPalabras(ids.length),
  };

  return {
    ...enLetra,
    capacidades: CAPACIDADES.length,
    celdas: celdas.length,
    celdasOperacion: cuenta('EN_OPERACION'),
    celdasIncipiente: cuenta('INCIPIENTE'),
    celdasEntorno: cuenta('SOLO_ENTORNO'),
    celdasNoLocalizada: cuenta('NO_LOCALIZADA'),
    celdasNoConcluyente: cuenta('NO_CONCLUYENTE'),
    unidadOperacion: enOperacionDe('unidad'),
    normaOperacion: enOperacionDe('norma'),
    normaSinConcluir: sinConcluirDe('norma'),
    pregradoOperacion: enOperacionDe('curriculo'),
    pregradoSinConcluir: sinConcluirDe('curriculo'),
    formacionOperacion: enOperacionDe('formacion'),
    investigacionSinConcluir: sinConcluirDe('investigacion'),
    evaluacionSinConcluir: sinConcluirDe('evaluacion'),
    transferenciaIncipiente: ids.filter(
      (id) => celdaCapacidad(id, 'transferencia').estado === 'INCIPIENTE',
    ).length,
    mecProgramas: mec('PROGRAMA_FORMATIVO').iniciativas.length,
    mecProgramasFacultad: mec('PROGRAMA_FORMATIVO').deLaFacultad,
    mecHerramientas: mec('HERRAMIENTA').iniciativas.length,
    mecHerramientasEntorno:
      mec('HERRAMIENTA').iniciativas.length - mec('HERRAMIENTA').deLaFacultad,
    mecAsignaturas: mec('ASIGNATURA').iniciativas.length,
    mecUnidades: mec('UNIDAD').iniciativas.length,
    mecNormas: mec('NORMA').iniciativas.length,
    mecConvenios: mec('CONVENIO').iniciativas.length,
    mecActividades: mec('ACTIVIDAD').iniciativas.length,
    iniciativasFechadas: conFecha.length,
    iniciativasDesde2025: desde2025,
    iniciativasSinFecha: informe01Iniciativas.length - conFecha.length,
    menosInvestigada: menos.nombre,
    menosInvestigadaRutas: menos.rutas,
    menosInvestigadaOperacion: menos.operacion,
    masInvestigada: mas.nombre,
    masInvestigadaRutas: mas.rutas,
    masInvestigadaOperacion: mas.operacion,
  };
}
