// Gráficos del Documento B. Datos tomados de Graficos.ps1 del Informe 02 v0.3.0
// (tools/informes/informe-02/Graficos.ps1), donde constan con su fuente y advertencia.
//   node figuras-informe-02.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { barrasH, columnas, columnasAgrupadas, barrasDivergentes, renderizar, COLOR, num } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const pct = (v) => `${num(v, 0)} %`;

const graficos = [
  {
    id: 'b01-uso-delegacion',
    ...columnasAgrupadas(
      [
        { etiqueta: '2024', valores: { uso: 53, inserta: 3 } },
        { etiqueta: '2025', valores: { uso: 88, inserta: 8 } },
        { etiqueta: '2026', valores: { uso: 94, inserta: 12 } },
      ],
      [
        { id: 'uso', nombre: 'Usa IA generativa en trabajos evaluados', color: COLOR.serie },
        { id: 'inserta', nombre: 'Inserta texto generado directamente en la entrega', color: COLOR.ordinal.bajo },
      ],
      { maximo: 100, marcas: [0, 25, 50, 75, 100], formatoValor: pct },
    ),
  },
  {
    id: 'b02-rendimiento-aprendizaje',
    ...barrasDivergentes(
      [
        { etiqueta: 'Tutor con andamiaje docente, durante la práctica', valor: 127 },
        { etiqueta: 'Acceso libre a GPT-4, durante la práctica', valor: 48 },
        { etiqueta: 'Acceso libre, al retirar la herramienta', valor: -17 },
      ],
      { minimo: -50, maximo: 150, marcas: [-50, 0, 50, 100, 150], formatoValor: (f) => `${f.valor > 0 ? '+' : ''}${f.valor} %`, formatoMarca: (m) => `${m > 0 ? '+' : ''}${m} %` },
    ),
  },
  {
    id: 'b03-preparacion',
    ...barrasH(
      [
        { etiqueta: 'Preocupación docente por la capacidad crítica', valor: 83 },
        { etiqueta: 'Docentes que perciben falta de claridad', valor: 80 },
        { etiqueta: 'Estudiantes sin orientación suficiente', valor: 57 },
        { etiqueta: 'Docentes al inicio de su alfabetización', valor: 40 },
        { etiqueta: 'Docentes que participaron en la política', valor: 31 },
        { etiqueta: 'Estudiantes que ven preparados a sus docentes', valor: 29 },
        { etiqueta: 'Docentes con nivel avanzado o experto', valor: 17 },
      ],
      { maximo: 100, formatoValor: (f) => pct(f.valor), maxEtiqueta: 330, formatoMarca: (m) => `${m} %` },
    ),
  },
  {
    id: 'b04-politicas',
    ...barrasH(
      [
        { etiqueta: 'Política formal vigente', valor: 19, enfasis: true },
        { etiqueta: 'Marco en desarrollo', valor: 42 },
        { etiqueta: 'Sin política ni marco declarado', valor: 39 },
      ],
      { maximo: 100, formatoValor: (f) => pct(f.valor), formatoMarca: (m) => `${m} %` },
    ),
  },
  {
    id: 'b05-integridad',
    ...columnas(
      [
        { etiqueta: '2022-23', valor: 1.6 },
        { etiqueta: '2023-24', valor: 5.1 },
        { etiqueta: '2024-25 (proyección)', valor: 7.5 },
      ],
      { maximo: 10, marcas: [0, 2, 4, 6, 8, 10], formatoValor: (b) => num(b.valor, 1), alto: 220 },
    ),
  },
  {
    id: 'b06-alucinaciones-juridicas',
    ...barrasH(
      [
        { etiqueta: 'Lexis+ AI', valor: 17 },
        { etiqueta: 'Westlaw AI-Assisted Research', valor: 33 },
        { etiqueta: 'GPT-4 sin recuperación jurídica', valor: 43 },
      ],
      { maximo: 50, marcas: [0, 10, 20, 30, 40, 50], formatoValor: (f) => pct(f.valor), formatoMarca: (m) => `${m} %` },
    ),
  },
  {
    id: 'b07-citas-fabricadas',
    ...columnas(
      [
        { etiqueta: 'Inicios de 2026 (mínimo)', valor: 1200 },
        { etiqueta: 'Julio de 2026', valor: 1668 },
        { etiqueta: '28 de agosto de 2026', valor: 1981 },
      ],
      { maximo: 2200, marcas: [0, 500, 1000, 1500, 2000], formatoValor: (b) => b.valor.toLocaleString('es-CL'), alto: 220 },
    ),
  },
  {
    id: 'b08-mapa-niveles',
    ...columnas(
      [
        { etiqueta: '0 · Ausencia', valor: 0 },
        { etiqueta: '1 · Herramienta', valor: 2 },
        { etiqueta: '2 · Política', valor: 9 },
        { etiqueta: '3 · Integración', valor: 11 },
        { etiqueta: '4 · Currículo', valor: 8 },
        { etiqueta: '5 · Sistémico', valor: 0 },
      ],
      { maximo: 12, marcas: [0, 4, 8, 12], mostrarCeros: true, alto: 220 },
    ),
  },
];

await renderizar(graficos, path.join(aqui, 'figuras', 'informe-02'));
console.log(graficos.map((g) => `${g.id} ${g.ancho}x${Math.round(g.alto)}`).join('\n'));
