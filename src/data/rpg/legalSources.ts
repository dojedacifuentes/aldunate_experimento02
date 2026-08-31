import type { LegalSource } from '@/types/game';

/**
 * Registro de referencias normativas.
 *
 * REGLA DURA. No se inventan artículos, sentencias, roles ni jurisprudencia.
 * Una referencia sólo pasa a `VERIFIED` cuando alguien la contrastó contra el
 * texto oficial y anotó dónde. Mientras tanto queda `UNVERIFIED`, la interfaz
 * la rotula como tal y el juego **no la presenta como Derecho vigente**: la usa
 * como material de ficción rotulado.
 *
 * Este archivo es la única fuente de citas del juego. Ningún diálogo cita una
 * norma por su cuenta.
 */
export const legalSources: LegalSource[] = [
  {
    id: 'presuncion-inocencia',
    jurisdiccion: 'CL',
    cuerpo: 'Código Procesal Penal',
    articulo: 'art. 4',
    resumen:
      'Ninguna persona es considerada culpable ni tratada como tal mientras no fuere condenada por sentencia firme.',
    estado: 'UNVERIFIED',
    pendiente:
      'Contrastar redacción y vigencia en el texto oficial (bcn.cl/leychile) y anotar fecha de verificación.',
  },
  {
    id: 'duda-razonable',
    jurisdiccion: 'CL',
    cuerpo: 'Código Procesal Penal',
    articulo: 'art. 340',
    resumen:
      'El tribunal sólo condena cuando adquiere, más allá de toda duda razonable, la convicción de que se cometió el hecho punible y de la participación del acusado.',
    estado: 'UNVERIFIED',
    pendiente:
      'Contrastar redacción y vigencia en el texto oficial (bcn.cl/leychile) y anotar fecha de verificación.',
  },
  {
    id: 'valoracion-prueba',
    jurisdiccion: 'CL',
    cuerpo: 'Código Procesal Penal',
    articulo: 'art. 297',
    resumen:
      'Los tribunales aprecian la prueba con libertad, sin contradecir los principios de la lógica, las máximas de la experiencia y los conocimientos científicamente afianzados.',
    estado: 'UNVERIFIED',
    pendiente:
      'Contrastar redacción y vigencia en el texto oficial (bcn.cl/leychile) y anotar fecha de verificación.',
  },
];

export const legalSourceById = (id: string): LegalSource | undefined =>
  legalSources.find((s) => s.id === id);
