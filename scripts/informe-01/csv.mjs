/**
 * Lector de CSV compartido por los scripts del Informe 01.
 *
 * Sin dependencias: el CSV con comillas dobles es un formato de veinte líneas, y
 * añadir un paquete para leerlo habría metido un árbol de dependencias en la
 * cadena que produce la fuente de verdad del informe.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DATASET = 'content/reports/01_ia_escuelas_derecho_chile/canonical/dataset';

export function leerCsv(archivo, base = DATASET) {
  const texto = readFileSync(join(base, archivo), 'utf8');
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

export const lista = (v) => (v ? v.split('; ').filter(Boolean) : []);
