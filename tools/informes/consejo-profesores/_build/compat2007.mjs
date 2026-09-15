// Ajusta el paquete que genera la libreria docx para que lo abra Word 2007,
// que es el Word instalado en este equipo y el que exporta el PDF.
// Cada regla corrige una incompatibilidad comprobada; no se agregan reglas "por si acaso".
import JSZip from 'jszip';

const REGLAS = [
  // Word 2007 no conoce el atributo title de wp:docPr (esquema de Word 2010).
  { nombre: 'docPr-title', patron: /(<wp:docPr\b[^>]*?)\s+title="[^"]*"/g, reemplazo: '$1' },
  // Word 2007 exige anchos pct en cincuentavos de punto (5000 = 100 %); la libreria escribe "100%".
  {
    nombre: 'ancho-pct',
    patron: /(<w:(?:tblW|tcW|tblInd)\b[^>]*?w:w=")(\d+(?:\.\d+)?)%(")/g,
    reemplazo: (_, a, n, c) => `${a}${Math.round(Number(n) * 50)}${c}`,
  },
];

export async function compat2007(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const partes = Object.keys(zip.files).filter((n) => /^word\/[^/]+\.xml$/.test(n));
  const cambios = [];
  for (const n of partes) {
    let x = await zip.file(n).async('string');
    for (const r of REGLAS) {
      const conteo = (x.match(r.patron) || []).length;
      if (conteo) {
        x = x.replace(r.patron, r.reemplazo);
        cambios.push(`${n}:${r.nombre}x${conteo}`);
      }
    }
    zip.file(n, x);
  }
  return { buffer: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), cambios };
}
