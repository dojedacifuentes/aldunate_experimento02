// @ts-check
/**
 * Compila los seis CSV canónicos del Informe 01 a `src/data/informe01.ts`.
 *
 *   node scripts/informe-01/06-compilar-a-typescript.mjs
 *
 * Los CSV son la fuente de verdad; el módulo TypeScript es su proyección para
 * el sitio. Por eso el archivo generado lleva un aviso y **no se edita a mano**:
 * la siguiente compilación lo sobrescribe.
 *
 * Aquí también se calculan los contadores. Ninguna cifra del sitio se escribe a
 * mano —fue así como el sitio llegó a decir a la vez «v0.2.0 publicada» y «los
 * hallazgos aún no están definidos»—, de modo que el hero, el changelog y las
 * descargas leen del mismo objeto y no pueden contradecirse.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATASET = 'content/reports/01_ia_escuelas_derecho_chile/canonical/dataset';
const SALIDA = 'src/data/informe01.ts';
const DIMENSIONES_TOTALES = 8;

/** Vocabulario cerrado de mecanismos institucionales (metodología 2.1 §M-2). */
const MECANISMOS = new Set([
  'UNIDAD',
  'NORMA',
  'PROGRAMA_FORMATIVO',
  'ASIGNATURA',
  'HERRAMIENTA',
  'PROYECTO',
  'ACTIVIDAD',
  'CONVENIO',
  'PUBLICACION',
]);

/** Lector de CSV con comillas dobles. Sin dependencias: es un formato, no un problema. */
function leerCsv(archivo) {
  const texto = readFileSync(join(DATASET, archivo), 'utf8');
  const filas = [];
  let campo = '';
  let fila = [];
  let entreComillas = false;
  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i += 1;
        } else entreComillas = false;
      } else campo += c;
      continue;
    }
    if (c === '"') entreComillas = true;
    else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else if (c !== '\r') campo += c;
  }
  if (campo !== '' || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }
  const cabecera = filas.shift();
  return filas
    .filter((f) => f.some((v) => v !== ''))
    .map((f) => Object.fromEntries(cabecera.map((k, i) => [k, f[i] ?? ''])));
}

const lista = (v) => (v ? v.split('; ').filter(Boolean) : []);

const universidades = leerCsv('universidades.csv').map((r) => ({
  id: r.university_id,
  officialName: r.official_name,
  unitName: r.unit_name,
  cohortId: r.cohort_id,
  cohortVersion: r.cohort_version,
  status: r.status,
  notes: r.notes,
}));

const fuentes = leerCsv('fuentes.csv').map((r) => ({
  id: r.source_id,
  universityId: r.university_id,
  title: r.title,
  publisher: r.publisher,
  type: r.source_type,
  url: r.url,
  ...(r.archived_url ? { archivedUrl: r.archived_url } : {}),
  ...(r.published_date && r.published_date !== 'FECHA_NO_DECLARADA'
    ? { publishedDate: r.published_date }
    : {}),
  datePrecision: r.date_precision,
  accessedDate: r.accessed_date,
  documentStatus: r.document_status,
  confidence: Number(r.confidence),
  workflowStatus: r.workflow_status,
  createdBy: r.created_by,
  verifiedBy: r.verified_by,
  notes: r.notes,
}));

const iniciativas = leerCsv('iniciativas.csv').map((r) => ({
  id: r.initiative_id,
  universityId: r.university_id,
  name: r.name,
  attribution: r.institutional_level,
  direction: r.direction,
  dimension: r.primary_dimension,
  mechanism: r.mechanism_type,
  ...(r.start_date ? { startDate: r.start_date } : {}),
  ...(r.end_date ? { endDate: r.end_date } : {}),
  ladder: Number(r.current_status),
  trajectory: r.temporal_change,
  audience: r.audience,
  coverage: r.coverage,
  responsibleUnit: r.responsible_unit,
  products: r.products,
  outcomes: r.outcomes,
  workflowStatus: r.workflow_status,
  sourceIds: lista(r.source_ids),
  notes: r.notes,
}));

const evidencias = leerCsv('evidencias.csv').map((r) => ({
  id: r.evidence_id,
  sourceId: r.source_id,
  initiativeId: r.initiative_id,
  universityId: r.university_id,
  direction: r.direction,
  dimension: r.dimension,
  statement: r.factual_statement,
  attribution: r.institutional_level,
  temporalStatus: r.temporal_status,
  lastVerified: r.last_verified,
  workflowStatus: r.workflow_status,
  createdBy: r.created_by,
  verifiedBy: r.verified_by,
  limitations: r.limitations,
}));

const cobertura = leerCsv('cobertura.csv').map((r) => ({
  universityId: r.university_id,
  inPilot: r.in_pilot === 'si',
  routesCompleted: Number(r.routes_completed),
  routesTotal: Number(r.routes_total),
  coveragePercent: Number(r.coverage_percent),
  sources: Number(r.sources),
  evidence: Number(r.evidence),
  initiatives: Number(r.initiatives),
  dimensionsCovered: Number(r.dimensions_covered),
  dimensionsTotal: Number(r.dimensions_total),
  routesMissing: lista(r.routes_missing),
  substantivelyVerifiedSources: Number(r.substantively_verified_sources),
  notes: r.notes,
}));

const afirmaciones = leerCsv('afirmaciones.csv').map((r) => ({
  id: r.claim_id,
  universityId: r.university_id,
  text: r.claim_text,
  classification: r.classification,
  evidenceIds: lista(r.evidence_ids),
  counterevidenceIds: lista(r.counterevidence_ids),
  reasoning: r.reasoning,
  limitations: r.limitations,
  confidence: Number(r.confidence),
  lastVerified: r.last_verified,
  workflowStatus: r.workflow_status,
  createdBy: r.created_by,
  verifiedBy: r.verified_by,
}));

/* ── Integridad referencial. Si falla, no se escribe nada. ────────────────── */
const errores = [];
const idFuentes = new Set(fuentes.map((f) => f.id));
const idIniciativas = new Set(iniciativas.map((i) => i.id));
const idEvidencias = new Set(evidencias.map((e) => e.id));
const idUniversidades = new Set(universidades.map((u) => u.id));

const unico = (arr, etiqueta) => {
  const vistos = new Set();
  for (const x of arr) {
    if (vistos.has(x)) errores.push(`${etiqueta} repetido: ${x}`);
    vistos.add(x);
  }
};
unico(fuentes.map((f) => f.id), 'source_id');
unico(fuentes.map((f) => f.url), 'url');
unico(iniciativas.map((i) => i.id), 'initiative_id');
unico(evidencias.map((e) => e.id), 'evidence_id');
unico(afirmaciones.map((c) => c.id), 'claim_id');

for (const f of fuentes) {
  if (f.universityId && !idUniversidades.has(f.universityId))
    errores.push(`${f.id} apunta a una universidad inexistente: ${f.universityId}`);
  if (!/^https:\/\//.test(f.url)) errores.push(`${f.id} tiene una URL que no es https`);
  if (f.publishedDate && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(f.publishedDate))
    errores.push(`${f.id} tiene una fecha mal formada: ${f.publishedDate}`);
  // DEC-108 (enmendada el 04-09-2026): la verificación sustantiva ya existe, de
  // modo que la guarda deja de prohibirla y pasa a exigir que sea coherente. Un
  // registro no puede declarar quién lo contrastó sin estar contrastado, ni
  // decirse contrastado sin decir quién lo hizo.
  if (f.verifiedBy && !['CONTRASTADO', 'ACEPTADO'].includes(f.workflowStatus))
    errores.push(`${f.id} declara verified_by pero su estado es ${f.workflowStatus}`);
  if (f.workflowStatus === 'CONTRASTADO' && !f.verifiedBy)
    errores.push(`${f.id} está CONTRASTADO sin declarar quién lo verificó`);
}
for (const i of iniciativas) {
  if (!idUniversidades.has(i.universityId))
    errores.push(`${i.id} apunta a una universidad inexistente`);
  if (i.sourceIds.length === 0) errores.push(`${i.id} no cita ninguna fuente`);
  for (const s of i.sourceIds)
    if (!idFuentes.has(s)) errores.push(`${i.id} cita una fuente inexistente: ${s}`);
  if (i.ladder < 0 || i.ladder > 4) errores.push(`${i.id} tiene un escalón fuera de 0–4`);
  // El vocabulario de mecanismos es cerrado (metodología 2.1 §M-2). Sin esta
  // guarda, una errata escribe una categoría nueva y la matriz de capacidades
  // deja de contarla en silencio, que es la peor forma de perder un dato.
  if (!MECANISMOS.has(i.mechanism))
    errores.push(`${i.id} declara un mecanismo fuera del vocabulario: «${i.mechanism}»`);
}
for (const e of evidencias) {
  if (!idFuentes.has(e.sourceId)) errores.push(`${e.id} cita una fuente inexistente`);
  if (!idIniciativas.has(e.initiativeId))
    errores.push(`${e.id} cita una iniciativa inexistente`);
  // Fecha y firma de la verificación viajan juntas o no viajan. Y una evidencia
  // no puede estar verificada si la fuente que la sostiene no lo está: la cadena
  // fuente → evidencia no admite que el eslabón débil sea el primero.
  if (Boolean(e.lastVerified) !== Boolean(e.verifiedBy))
    errores.push(`${e.id} declara last_verified y verified_by de forma desigual`);
  if (e.lastVerified && !fuentes.find((f) => f.id === e.sourceId)?.verifiedBy)
    errores.push(`${e.id} se declara verificada pero su fuente ${e.sourceId} no lo está`);
}
for (const c of afirmaciones) {
  for (const e of [...c.evidenceIds, ...c.counterevidenceIds])
    if (!idEvidencias.has(e)) errores.push(`${c.id} cita una evidencia inexistente: ${e}`);
  // Una afirmación sobre una institución debe apoyarse en evidencia. Las
  // metodológicas hablan del corpus, no de universidades, y por eso no la citan.
  if (c.evidenceIds.length === 0 && !c.id.startsWith('clm-metodo-'))
    errores.push(`${c.id} no cita ninguna evidencia y no es metodológica`);
  // `ACEPTADO` sigue exigiendo decisión humana (kit §22): que una afirmación esté
  // contrastada no la habilita para publicarse como resultado. Y ninguna puede
  // aceptarse mientras alguna de sus evidencias siga sin verificar.
  if (c.workflowStatus === 'ACEPTADO')
    errores.push(`${c.id} está ACEPTADO, y aceptar exige decisión humana registrada (kit §22)`);
  if (c.verifiedBy && c.workflowStatus !== 'CONTRASTADO')
    errores.push(`${c.id} declara verified_by pero su estado es ${c.workflowStatus}`);
}
if (errores.length > 0) {
  console.error('Integridad referencial rota. No se escribió nada:\n');
  for (const e of errores) console.error('  ·', e);
  process.exit(1);
}

/* ── Contadores derivados ─────────────────────────────────────────────────── */
const cuenta = (arr, clave) =>
  arr.reduce((acc, x) => ({ ...acc, [clave(x)]: (acc[clave(x)] ?? 0) + 1 }), {});
const piloto = cobertura.filter((c) => c.inPilot);
const resto = cobertura.filter((c) => !c.inPilot);
const media = (arr, f) => arr.reduce((s, x) => s + f(x), 0) / arr.length;
const redondear = (n) => Math.round(n * 10) / 10;

const coberturaPiloto = redondear(media(piloto, (c) => c.sources));
const coberturaResto = redondear(media(resto, (c) => c.sources));

const recuento = {
  universidades: universidades.length,
  fuentes: fuentes.length,
  fuentesInstitucionales: fuentes.filter((f) => f.universityId).length,
  fuentesUniversoNacional: fuentes.filter((f) => !f.universityId).length,
  iniciativas: iniciativas.length,
  evidencias: evidencias.length,
  afirmaciones: afirmaciones.length,
  fuentesVerificadas: fuentes.filter((f) => f.verifiedBy).length,
  iniciativasEvaluadas: iniciativas.filter((i) => i.ladder === 4).length,
  afirmacionesPorNivel: cuenta(afirmaciones, (c) => c.classification),
  iniciativasPorEscalon: cuenta(iniciativas, (i) => String(i.ladder)),
  iniciativasPorDireccion: cuenta(iniciativas, (i) => i.direction),
  dimensionesConEvidencia: new Set(evidencias.map((e) => e.dimension)).size,
  dimensionesTotales: DIMENSIONES_TOTALES,
  coberturaPiloto,
  coberturaResto,
  razonCobertura: redondear(coberturaPiloto / coberturaResto),
  rutasPiloto: redondear(media(piloto, (c) => c.routesCompleted)),
  rutasResto: redondear(media(resto, (c) => c.routesCompleted)),
};

const json = (v) => JSON.stringify(v, null, 2).replace(/\n/g, '\n');
const salida = `/**
 * ARCHIVO GENERADO. No lo edites a mano: la siguiente compilación lo sobrescribe.
 *
 * Fuente de verdad: los CSV de
 * \`content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/\`.
 * Generador: \`scripts/informe-01/06-compilar-a-typescript.mjs\`.
 *
 * Los contadores se calculan aquí y no se escriben a mano en ninguna pantalla.
 */
import type {
  Informe01Afirmacion,
  Informe01Cobertura,
  Informe01Evidencia,
  Informe01Fuente,
  Informe01Iniciativa,
  Informe01Recuento,
  Informe01Universidad,
} from '@/types';

export const informe01Universidades: Informe01Universidad[] = ${json(universidades)};

export const informe01Fuentes: Informe01Fuente[] = ${json(fuentes)};

export const informe01Iniciativas: Informe01Iniciativa[] = ${json(iniciativas)};

export const informe01Evidencias: Informe01Evidencia[] = ${json(evidencias)};

export const informe01Cobertura: Informe01Cobertura[] = ${json(cobertura)};

export const informe01Afirmaciones: Informe01Afirmacion[] = ${json(afirmaciones)};

export const informe01Recuento: Informe01Recuento = ${json(recuento)};
`;

writeFileSync(SALIDA, salida, 'utf8');
console.log(`${SALIDA} escrito.`);
console.log(
  `  ${recuento.universidades} universidades · ${recuento.fuentes} fuentes · ` +
    `${recuento.iniciativas} iniciativas · ${recuento.evidencias} evidencias · ` +
    `${recuento.afirmaciones} afirmaciones`,
);
console.log(
  `  cobertura piloto ${recuento.coberturaPiloto} vs resto ${recuento.coberturaResto} ` +
    `(${recuento.razonCobertura}:1) · rutas ${recuento.rutasPiloto} vs ${recuento.rutasResto}`,
);
console.log(
  `  iniciativas en nivel 4: ${recuento.iniciativasEvaluadas} · ` +
    `fuentes con verificación sustantiva: ${recuento.fuentesVerificadas}`,
);
