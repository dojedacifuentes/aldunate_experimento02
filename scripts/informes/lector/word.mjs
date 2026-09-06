/**
 * Lleva el `.docx` publicado al formato de paper: cuerpo de 12 puntos.
 *
 * El Word que llegó con la v2.0.0 estaba compuesto a **10 pt**, con 1.610
 * pasajes a ese tamaño y otros 2.500 entre 6,5 y 9,5. Ninguno a 12. Es el
 * documento que se ofrece para anotar y devolver con control de cambios, así
 * que es justo el que se lee de cerca y con más tiempo.
 *
 * Qué hace: reescribe todos los tamaños de fuente del paquete OOXML con un
 * factor de 1,2 —10 pt pasa a 12, y todo lo demás sube con él para conservar
 * la jerarquía— y fija el tamaño por defecto del documento, que no estaba
 * declarado. No toca ni una palabra, ni una tabla, ni el orden de nada.
 *
 *   node scripts/informes/lector/word.mjs
 *
 * El `.docx` es un ZIP de XML. Se descomprime con el sistema y se vuelve a
 * escribir aquí, para no depender de que la herramienta de compresión del
 * sistema ordene las partes como Word espera.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

import { DOCUMENTOS } from './documentos.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..');

/** 10 pt → 12 pt. El resto de la escala sube igual y la jerarquía se conserva. */
const FACTOR = 1.2;

/** Tamaño por defecto del documento, en medios puntos. 24 = 12 pt. */
const POR_DEFECTO = 24;

/* ── ZIP mínimo, sólo escritura ──────────────────────────────────────────── */

function crc32(buf) {
  let c;
  const tabla = [];
  for (let n = 0; n < 256; n += 1) {
    c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) crc = tabla[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function escribirZip(entradas) {
  const locales = [];
  const central = [];
  let desplazamiento = 0;

  for (const { nombre, datos } of entradas) {
    const nom = Buffer.from(nombre, 'utf8');
    const crc = crc32(datos);
    /* Desinflado: almacenar sin comprimir multiplicaba por diez el tamaño del
       paquete, y un Word de 1,8 MB para un documento de texto se nota al
       enviarlo por correo. */
    const comprimido = zlib.deflateRawSync(datos, { level: 9 });
    const usaDeflate = comprimido.length < datos.length;
    const carga = usaDeflate ? comprimido : datos;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // versión
    local.writeUInt16LE(0, 6); // banderas
    local.writeUInt16LE(usaDeflate ? 8 : 0, 8); // 8 = desinflado
    local.writeUInt16LE(0, 10); // hora
    local.writeUInt16LE(0x21, 12); // fecha
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(carga.length, 18);
    local.writeUInt32LE(datos.length, 22);
    local.writeUInt16LE(nom.length, 26);
    local.writeUInt16LE(0, 28);
    locales.push(local, nom, carga);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0, 8);
    dir.writeUInt16LE(usaDeflate ? 8 : 0, 10);
    dir.writeUInt16LE(0, 12);
    dir.writeUInt16LE(0x21, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(carga.length, 20);
    dir.writeUInt32LE(datos.length, 24);
    dir.writeUInt16LE(nom.length, 28);
    dir.writeUInt32LE(desplazamiento, 42);
    central.push(dir, nom);

    desplazamiento += local.length + nom.length + carga.length;
  }

  const cuerpoCentral = Buffer.concat(central);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(cuerpoCentral.length, 12);
  fin.writeUInt32LE(desplazamiento, 16);

  return Buffer.concat([...locales, cuerpoCentral, fin]);
}

/* ── Transformación ──────────────────────────────────────────────────────── */

function reescalar(xml) {
  let cambios = 0;
  /* `w:sz` es el tamaño y `w:szCs` el de escritura compleja: si sólo se toca
     el primero, Word muestra una cosa y mide otra en las tablas. */
  const salida = xml.replace(/<w:(sz|szCs) w:val="(\d+)"\s*\/>/g, (todo, etq, val) => {
    const nuevo = Math.round(Number(val) * FACTOR);
    cambios += 1;
    return `<w:${etq} w:val="${nuevo}"/>`;
  });
  return { xml: salida, cambios };
}

function fijarPorDefecto(styles) {
  /* El paquete no declaraba tamaño por defecto: todo lo llevaban los pasajes
     uno por uno, de modo que cualquier párrafo nuevo que escriba quien anote
     el documento nacía con el tamaño de Word y no con el del informe. */
  if (/<w:rPrDefault><w:rPr>/.test(styles) && !/<w:rPrDefault>[\s\S]{0,400}?<w:sz /.test(styles)) {
    return styles.replace(
      /(<w:rPrDefault><w:rPr>)/,
      `$1<w:sz w:val="${POR_DEFECTO}"/><w:szCs w:val="${POR_DEFECTO}"/>`,
    );
  }
  return styles;
}

/* ── Ejecución ───────────────────────────────────────────────────────────── */

let fallos = 0;

for (const doc of DOCUMENTOS) {
  /* La fuente es el Word entregado, intocado, igual que con el HTML: así
     volver a ejecutarlo produce exactamente lo mismo y no escala dos veces. */
  const origen = path.join(raíz, doc.fuente).replace(/\.html$/, '.docx');
  const docx = path.join(raíz, doc.destino).replace(/\.html$/, '.docx');
  if (!fs.existsSync(origen)) {
    console.log(`· sin Word de origen: ${path.basename(origen)}`);
    continue;
  }

  const trabajo = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-'));
  const zipTmp = path.join(trabajo, 'd.zip');
  const extraído = path.join(trabajo, 'x');
  fs.copyFileSync(origen, zipTmp);

  try {
    execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${zipTmp}' -DestinationPath '${extraído}' -Force`,
      ],
      { stdio: 'pipe' },
    );
  } catch {
    console.error(`✗ no se pudo abrir ${path.basename(docx)}`);
    fallos += 1;
    continue;
  }

  /* Se recorre el paquete conservando el orden y los nombres tal cual: Word
     es tolerante con el orden, pero no con una parte que cambie de nombre. */
  const entradas = [];
  let cambios = 0;

  const recorrer = (dir, prefijo) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const completo = path.join(dir, e.name);
      const nombre = prefijo ? `${prefijo}/${e.name}` : e.name;
      if (e.isDirectory()) {
        recorrer(completo, nombre);
        continue;
      }
      let datos = fs.readFileSync(completo);
      if (/\.xml$/.test(nombre) && /document|styles|header|footer|numbering/.test(nombre)) {
        let texto = datos.toString('utf8');
        const r = reescalar(texto);
        texto = r.xml;
        cambios += r.cambios;
        if (nombre.endsWith('styles.xml')) texto = fijarPorDefecto(texto);
        datos = Buffer.from(texto, 'utf8');
      }
      entradas.push({ nombre, datos });
    }
  };
  recorrer(extraído, '');

  /* `[Content_Types].xml` debe ir primero: es lo único del orden que Word
     exige de verdad. */
  entradas.sort((a, b) =>
    a.nombre === '[Content_Types].xml' ? -1 : b.nombre === '[Content_Types].xml' ? 1 : 0,
  );

  fs.writeFileSync(docx, escribirZip(entradas));
  fs.rmSync(trabajo, { recursive: true, force: true });

  const kb = Math.round(fs.statSync(docx).size / 1024);
  console.log(
    `✓ ${doc.destino.replace(/\.html$/, '.docx').replace('public/descargas/', '')} · ` +
      `${cambios} tamaños reescalados ×${FACTOR} · ${kb} KB`,
  );
}

process.exit(fallos > 0 ? 1 : 0);
