/**
 * png.mjs — codificador PNG mínimo (RGBA de 8 bits, sin entrelazar).
 *
 * Existe para que hornear el arte no dependa de ninguna librería nativa. El
 * motor de dibujo ya entrega píxeles; lo único que falta es envolverlos, y eso
 * cabe en `zlib` más un CRC. Una dependencia menos es una instalación menos que
 * puede fallar en CI.
 */

import { deflateSync } from 'node:zlib';

const TABLA_CRC = (() => {
  const tabla = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c;
  }
  return tabla;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = TABLA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length, 0);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo), 0);
  return Buffer.concat([largo, cuerpo, crc]);
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Uint8ClampedArray|Uint8Array} rgba longitud width*height*4
 * @returns {Buffer}
 */
export function encodePNG(width, height, rgba) {
  const bytesPorFila = width * 4;
  // Cada fila lleva un byte de filtro al inicio. Filtro 0: sin filtrar.
  const cruda = Buffer.alloc((bytesPorFila + 1) * height);
  for (let y = 0; y < height; y += 1) {
    cruda[y * (bytesPorFila + 1)] = 0;
    for (let x = 0; x < bytesPorFila; x += 1) {
      cruda[y * (bytesPorFila + 1) + 1 + x] = rgba[y * bytesPorFila + x];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // profundidad de bit
  ihdr[9] = 6; // color RGBA
  ihdr[10] = 0; // compresión
  ihdr[11] = 0; // filtro
  ihdr[12] = 0; // sin entrelazado

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(cruda, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
