import type { Report, ReportReading, ReportVersion } from '@/types';

/**
 * Versiones de un informe: orden, búsqueda y rutas.
 *
 * Existe porque el sitio ordenaba versiones por fecha y el Informe 01 publicó
 * la v0.7.0 y la v0.8.0 el mismo día. Con dos fechas iguales el orden pasaba a
 * depender del orden de escritura del arreglo, que es exactamente lo que
 * `latestVersion` prometía no hacer. Aquí manda el número, y la fecha sólo
 * desempata.
 *
 * Todo lo que la interfaz necesita saber de una versión se deriva aquí y no en
 * cada pantalla: si es la vigente, cómo se lee, qué se puede descargar. Añadir
 * una versión nueva es añadir una entrada a `versions` y dejar los archivos en
 * `public/descargas/`. Ninguna pantalla se toca.
 */

/** Compara dos números de versión por segmentos numéricos. Mayor primero. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** De la más reciente a la más antigua. No muta el arreglo original. */
export function sortedVersions(versions: readonly ReportVersion[]): ReportVersion[] {
  return [...versions].sort(
    (a, b) => compareVersions(a.version, b.version) || b.date.localeCompare(a.date),
  );
}

/** La versión vigente: la mayor, no la última escrita. */
export function currentVersion(report: Report): ReportVersion | undefined {
  return sortedVersions(report.versions)[0];
}

/** Las que ya no son la vigente. Se conservan enteras: ninguna se sobrescribe. */
export function historicVersions(report: Report): ReportVersion[] {
  return sortedVersions(report.versions).slice(1);
}

export function findVersion(report: Report, version: string): ReportVersion | undefined {
  return report.versions.find((v) => v.version === version);
}

export function isCurrent(report: Report, version: string): boolean {
  return currentVersion(report)?.version === version;
}

/**
 * Cómo se lee una versión en línea.
 *
 * Se declara en el dato cuando hay algo que declarar y si no se deduce: con
 * documento autónomo, se muestra el documento; sin él, no hay lectura en línea
 * y la pantalla lo dice en vez de ofrecer un lector vacío.
 */
export function readingMode(version: ReportVersion): ReportReading {
  return version.reading ?? (version.html ? 'documento' : 'ninguna');
}

export function hasOnlineReading(version: ReportVersion): boolean {
  return readingMode(version) !== 'ninguna';
}

/** Ruta del lector de una versión. Un solo sitio la construye. */
export function versionHref(slug: string, version: string): string {
  return `/informes/${slug}/v/${version}`;
}

export function versionsHref(slug: string): string {
  return `/informes/${slug}/versiones`;
}

/**
 * Descargas de una versión.
 *
 * `artifacts` es la lista completa cuando existe. Las versiones anteriores a
 * este modelo sólo declaran `pdf` y `html` sueltos, y se traducen aquí para
 * que las pantallas no tengan que conocer las dos formas.
 */
export function versionArtifacts(version: ReportVersion) {
  if (version.artifacts?.length) return version.artifacts;
  const derived = [];
  if (version.pdf) {
    derived.push({
      format: 'PDF' as const,
      label: 'Leer o imprimir',
      href: version.pdf,
      description: 'Documento completo en A4, tal como se envía y se archiva.',
    });
  }
  if (version.html) {
    derived.push({
      format: 'HTML' as const,
      label: 'Abrir la versión web',
      href: version.html,
      description: 'Documento autónomo, legible sin descargar nada.',
    });
  }
  return derived;
}
