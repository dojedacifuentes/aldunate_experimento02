/**
 * Gráficos del capítulo internacional.
 * Fuente: archivo de políticas de inteligencia artificial en facultades de Derecho
 * estadounidenses de Andrew Perlman (agosto de 2026), 128 facultades catalogadas.
 *
 *   node figuras-internacional.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { barrasH, renderizar, COLOR } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));

const graficos = [];

/* i01 · Qué contienen las políticas de las facultades catalogadas */
graficos.push({
  id: 'i01-politicas-eeuu',
  ...barrasH(
    [
      { etiqueta: 'Ofrecen cursos o programas electivos', valor: 66, color: '#4269d0' },
      { etiqueta: 'Regulan el uso en trabajos entregados', valor: 58, color: '#6cc5b0' },
      { etiqueta: 'Regulan el uso en exámenes', valor: 53, color: '#3ca951' },
      { etiqueta: 'Exigen un componente curricular obligatorio', valor: 26, color: '#ff725c' },
      { etiqueta: 'Obligan a declarar la política en el programa', valor: 20, color: '#efb118' },
    ],
    {
      maximo: 128,
      marcas: [0, 32, 64, 96, 128],
      decimales: 0,
      derecha: 60,
      fila: 30,
      grosor: 18,
      maxEtiqueta: 300,
      notaEje: 'Número de facultades, sobre las 128 catalogadas',
    }
  ),
});

const carpeta = path.join(aqui, 'figuras', 'informe-01');
const ids = await renderizar(graficos, carpeta, 3);
console.log('Gráficos del capítulo internacional:\n');
for (const id of ids) console.log('  ' + id);
