/**
 * Escritor de ZIP mínimo y determinista, sin dependencias.
 *
 * Por qué a mano: el paquete se publica con `checksums.sha256`, y un ZIP con
 * marcas de tiempo del sistema produce un archivo distinto en cada ejecución
 * aunque el contenido sea idéntico. Un control de integridad que cambia sin que
 * cambie el contenido no controla nada.
 *
 * Aquí la fecha de cada entrada es fija y la compresión es determinista, de modo
 * que el mismo dataset produce siempre el mismo ZIP y el mismo hash.
 */
import { deflateRawSync } from 'node:zlib';

const CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  return tabla;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Fecha fija en formato MS-DOS: 1 de enero de 1980, la época del propio formato. */
const FECHA = 0;
const HORA = 0;

/**
 * @param {{ nombre: string, contenido: Buffer }[]} entradas
 * @returns {Buffer}
 */
export function crearZip(entradas) {
  const locales = [];
  const centrales = [];
  let offset = 0;

  for (const { nombre, contenido } of entradas) {
    const nombreBuf = Buffer.from(nombre.replace(/\\/g, '/'), 'utf8');
    const crc = crc32(contenido);
    // `deflateRaw` y no `deflate`: el formato ZIP guarda el flujo desnudo, sin la
    // cabecera zlib. Con `deflate` el archivo se escribe, se abre y falla al
    // extraer, que es la peor forma de estar roto.
    const comprimido = deflateRawSync(contenido, { level: 9 });
    // Sólo se comprime cuando de verdad ahorra: si no, se guarda tal cual y el
    // archivo sigue siendo legible con cualquier herramienta.
    const usarDeflate = comprimido.length < contenido.length;
    const datos = usarDeflate ? comprimido : contenido;
    const metodo = usarDeflate ? 8 : 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(metodo, 8);
    local.writeUInt16LE(HORA, 10);
    local.writeUInt16LE(FECHA, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(datos.length, 18);
    local.writeUInt32LE(contenido.length, 22);
    local.writeUInt16LE(nombreBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locales.push(local, nombreBuf, datos);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(metodo, 10);
    central.writeUInt16LE(HORA, 12);
    central.writeUInt16LE(FECHA, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(datos.length, 20);
    central.writeUInt32LE(contenido.length, 24);
    central.writeUInt16LE(nombreBuf.length, 28);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centrales.push(central, nombreBuf);

    offset += local.length + nombreBuf.length + datos.length;
  }

  const centralBuf = Buffer.concat(centrales);
  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(0x06054b50, 0);
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(centralBuf.length, 12);
  fin.writeUInt32LE(offset, 16);

  return Buffer.concat([...locales, centralBuf, fin]);
}
