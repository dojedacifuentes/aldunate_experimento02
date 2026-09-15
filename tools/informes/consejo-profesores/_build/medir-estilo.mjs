// Mide rasgos de estilo en borradores .md (formato-borrador.md) para usarlos como compuerta.
//   node medir-estilo.mjs <archivo.md | carpeta> [--json]
// Cuenta sobre la prosa del cuerpo: excluye títulos, directivas, tablas y definiciones de nota.
import fs from 'node:fs';
import path from 'node:path';

const objetivo = path.resolve(process.argv[2]);
const comoJson = process.argv.includes('--json');
const archivos = fs.statSync(objetivo).isDirectory()
  ? fs.readdirSync(objetivo).filter((f) => f.endsWith('.md')).sort().map((f) => path.join(objetivo, f))
  : [objetivo];

const MULETILLAS = [
  'exactamente', 'precisamente', 'conviene', 'cabe destacar', 'cabe señalar', 'es importante', 'es crucial',
  'crucial', 'fundamental', 'en definitiva', 'en última instancia', 'vale la pena', 'dicho de otro modo',
  'lo que está en juego', 'ventana', 'costura', 'eslabón', 'hoja de ruta', 'ecosistema', 'robust', 'potenciar',
  'no solo', 'sin duda', 'claramente', 'en suma', 'en rigor', 'lo cierto es que', 'la pregunta no es',
];

function medir(texto) {
  const lineas = texto.replace(/\r\n/g, '\n').split('\n');
  const titulos = lineas.filter((l) => /^#{1,3}\s/.test(l));
  const notasDef = lineas.filter((l) => /^\[\^[^\]]+\]:/.test(l));
  const prosa = lineas
    .filter((l) => !/^#{1,3}\s/.test(l) && !/^::/.test(l.trim()) && !/^\|/.test(l.trim()) && !/^\[\^[^\]]+\]:/.test(l) && !/^( {2,}|\t)\S/.test(l))
    .join('\n');
  const parrafos = prosa.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter((p) => p.length > 0);
  const limpio = parrafos.join('\n').replace(/\[\^[^\]]+\]/g, '').replace(/\*\*?/g, '');
  const palabras = (limpio.match(/[\p{L}\p{N}]+/gu) || []).length || 1;
  const oraciones = limpio.split(/(?<=[.?!»])\s+(?=[«¿¡"(]?[\p{Lu}\p{N}])/u).map((s) => s.trim()).filter((s) => /[\p{L}]/u.test(s));
  const largos = oraciones.map((s) => (s.match(/[\p{L}\p{N}]+/gu) || []).length).sort((a, b) => a - b);
  const k = 1000 / palabras;
  const cuenta = (re) => (limpio.match(re) || []).length;
  const muletillas = Object.fromEntries(MULETILLAS.map((m) => [m, cuenta(new RegExp(`\\b${m}`, 'giu'))]).filter(([, n]) => n > 0));
  const r = {
    palabras,
    oraciones: oraciones.length,
    media_oracion: +(largos.reduce((s, v) => s + v, 0) / (largos.length || 1)).toFixed(1),
    mediana_oracion: largos[Math.floor(largos.length / 2)] || 0,
    pct_mas_40: +((100 * largos.filter((v) => v > 40).length) / (largos.length || 1)).toFixed(1),
    fragmentos_hasta_5: largos.filter((v) => v <= 5).length,
    palabras_por_parrafo: +(palabras / (parrafos.length || 1)).toFixed(1),
    rayas_x1000: +(cuenta(/—|\s–\s/g) * k).toFixed(2),
    dos_puntos_x1000: +(cuenta(/:/g) * k).toFixed(2),
    punto_y_coma_x1000: +(cuenta(/;/g) * k).toFixed(2),
    antitesis: cuenta(/\bno (?:es|son|era|fue|está|están|se trata de|mide|dice|prueba|acredita)\b[^.;:\n]{1,80}[:;—]\s*(?:es|son|sino|se trata|mide|dice)\b/giu) + cuenta(/\bNo es que\b/gu),
    no_sino: cuenta(/\bno\b[^.\n]{1,90}\bsino\b/giu),
    y_no_x1000: +(cuenta(/\by no\b/giu) * k).toFixed(2),
    inicio_y_pero: oraciones.filter((s) => /^(Y|Pero)\s/u.test(s)).length,
    negritas: (texto.match(/\*\*[^*]+\*\*/g) || []).length,
    titulos: titulos.length,
    titulos_con_dos_puntos: titulos.filter((t) => t.includes(':')).length,
    notas: notasDef.length,
    notas_x1000: +(notasDef.length * k).toFixed(2),
    muletillas,
  };
  return r;
}

const UMBRALES = { rayas_x1000: 1.5, antitesis: 0, titulos_con_dos_puntos: 0, negritas: 0, fragmentos_x1000: 1.0, y_no_x1000: 1.5 };

const resultados = archivos.map((f) => ({ archivo: path.basename(f), ...medir(fs.readFileSync(f, 'utf8')) }));
const total = medir(archivos.map((f) => fs.readFileSync(f, 'utf8')).join('\n\n'));
const alertas = [];
for (const r of [...resultados, { archivo: 'TOTAL', ...total }]) {
  const frag = (r.fragmentos_hasta_5 * 1000) / r.palabras;
  if (r.rayas_x1000 > UMBRALES.rayas_x1000) alertas.push(`${r.archivo}: rayas ${r.rayas_x1000}/1000`);
  if (r.antitesis > UMBRALES.antitesis) alertas.push(`${r.archivo}: ${r.antitesis} antítesis`);
  if (r.titulos_con_dos_puntos > 0) alertas.push(`${r.archivo}: ${r.titulos_con_dos_puntos} títulos con dos puntos`);
  if (r.negritas > 0) alertas.push(`${r.archivo}: ${r.negritas} negritas`);
  if (frag > UMBRALES.fragmentos_x1000) alertas.push(`${r.archivo}: ${r.fragmentos_hasta_5} oraciones de 5 palabras o menos`);
  if (r.y_no_x1000 > UMBRALES.y_no_x1000) alertas.push(`${r.archivo}: «y no» ${r.y_no_x1000}/1000`);
  const mul = Object.values(r.muletillas).reduce((s, n) => s + n, 0);
  if ((mul * 1000) / r.palabras > 2) alertas.push(`${r.archivo}: muletillas ${JSON.stringify(r.muletillas)}`);
}

if (comoJson) console.log(JSON.stringify({ resultados, total, alertas }, null, 1));
else {
  console.table(resultados.map(({ muletillas, ...r }) => r));
  console.log('TOTAL', JSON.stringify(total));
  console.log(alertas.length ? `ALERTAS:\n- ${alertas.join('\n- ')}` : 'Sin alertas.');
}
