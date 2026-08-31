import type { EvidenceItem } from '@/types/game';

/**
 * Piezas del expediente del prólogo. Todas ficticias.
 *
 * Una pieza sirve para una cosa y sólo una: contradecir una afirmación
 * concreta. Si una evidencia sirve para todo, no es evidencia: es un comodín.
 */
export const evidenceCatalog: EvidenceItem[] = [
  {
    id: 'bitacora',
    nombre: 'Bitácora de accesos',
    resumen: 'Registro electrónico de entradas y salidas de la torre.',
    detalle:
      'Marta Quiroga marca salida a las 18:12 del 3 de marzo. No hay una segunda entrada esa noche. El sistema registra aperturas de torniquete, no voluntades.',
  },
  {
    id: 'metadatos',
    nombre: 'Metadatos del anexo',
    resumen: 'Propiedades del documento cuestionado.',
    detalle:
      'Creado a las 21:03 del 3 de marzo desde el equipo VL-114, asignado al área del querellante. Quiroga usaba el VL-032.',
  },
  {
    id: 'pericia',
    nombre: 'Informe pericial de firma',
    resumen: 'Cotejo caligráfico. Resultado no concluyente.',
    detalle:
      'El perito no descarta ni afirma. Un informe que no concluye sirve para sembrar duda, no para probar un hecho: usarlo como si probara algo es un error que la fiscalía sabrá aprovechar.',
    legalSourceId: 'valoracion-prueba',
  },
];

export const evidenceById = (id: string): EvidenceItem | undefined =>
  evidenceCatalog.find((e) => e.id === id);
