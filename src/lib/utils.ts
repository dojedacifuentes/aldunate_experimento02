import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fecha ISO -> texto legible en español de Chile.
 * Se fuerza UTC: sin eso, una fecha `2026-03-01` retrocede un día al oeste de
 * Greenwich y el informe aparece publicado en febrero.
 */
export function formatDate(iso?: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '—';
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
    ...opts,
  }).format(d);
}

/** Variante corta y monoespaciable: 2026-03-01 -> 01.03.2026 */
export function formatDateCompact(iso?: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

/** Devuelve la versión más reciente por fecha, sin asumir orden en el arreglo. */
export function latestVersion<T extends { date: string }>(versions: T[]): T | undefined {
  if (versions.length === 0) return undefined;
  return [...versions].sort((a, b) => b.date.localeCompare(a.date))[0];
}
