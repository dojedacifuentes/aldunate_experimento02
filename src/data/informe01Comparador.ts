/**
 * ARCHIVO GENERADO. No lo edites a mano: la siguiente compilación lo sobrescribe.
 *
 * Fuente de verdad: `tools/informes/informe-01/comparador/matriz-v2.json`, matriz
 * `.v2` — la canónica por D-039 — con la rúbrica del anexo D del Informe 01.
 * Generador: `scripts/informe-01/08-compilar-comparador.mjs`.
 *
 * Existe para que el comparador de la web y las tablas del documento no puedan
 * divergir. Mientras la figura y la tabla salgan de sitios distintos, divergir
 * no es un accidente: es cuestión de tiempo.
 */
import type { Informe01Comparador } from '@/types';

export const informe01Comparador: Informe01Comparador = {
  "capacidades": [
    {
      "clave": "Unidad",
      "corto": "Unidad",
      "rotulo": "Unidad especializada",
      "pregunta": "¿Existe una estructura dedicada dentro de la Facultad?"
    },
    {
      "clave": "Norma",
      "corto": "Norma",
      "rotulo": "Norma propia",
      "pregunta": "¿La Facultad dictó reglas sobre el uso de inteligencia artificial?"
    },
    {
      "clave": "Presencia",
      "corto": "Pregrado",
      "rotulo": "Presencia en pregrado",
      "pregunta": "¿La IA aparece dentro de la enseñanza de pregrado?"
    },
    {
      "clave": "Formacion",
      "corto": "Formación",
      "rotulo": "Formación estructurada",
      "pregunta": "¿Hay diplomados, minors, cursos o capacitaciones con IA?"
    },
    {
      "clave": "Herramienta",
      "corto": "Herram.",
      "rotulo": "Herramienta desplegada",
      "pregunta": "¿Hay un sistema de IA efectivamente a disposición?"
    },
    {
      "clave": "Adopcion",
      "corto": "Adopción",
      "rotulo": "Adopción en la enseñanza",
      "pregunta": "¿Consta que la IA se usa dentro de la enseñanza del Derecho?"
    },
    {
      "clave": "Alcance",
      "corto": "Alcance",
      "rotulo": "Alcance declarado",
      "pregunta": "¿El registro declara a quién alcanza lo que se hace?"
    },
    {
      "clave": "Investigacion",
      "corto": "Investig.",
      "rotulo": "Investigación",
      "pregunta": "¿Hay proyectos o publicaciones sobre inteligencia artificial?"
    },
    {
      "clave": "Transferencia",
      "corto": "Transf.",
      "rotulo": "Transferencia",
      "pregunta": "¿Hay convenios o servicios hacia fuera de la Facultad?"
    },
    {
      "clave": "Evaluacion",
      "corto": "Evaluación",
      "rotulo": "Evaluación de efecto",
      "pregunta": "¿Se midió si algo de esto mejoró el aprendizaje jurídico?"
    }
  ],
  "rubrica": [
    {
      "codigo": "OPF",
      "significa": "En operación, con instrumento formal publicado",
      "puntos": 3
    },
    {
      "codigo": "OP",
      "significa": "En operación",
      "puntos": 2
    },
    {
      "codigo": "INC",
      "significa": "Incipiente",
      "puntos": 1
    },
    {
      "codigo": "ENT",
      "significa": "Sólo en el entorno",
      "puntos": 1
    },
    {
      "codigo": "ADY",
      "significa": "Sólo adyacente",
      "puntos": 1
    },
    {
      "codigo": "NL",
      "significa": "No localizada",
      "puntos": 0
    },
    {
      "codigo": "NC",
      "significa": "No concluyente",
      "puntos": null
    }
  ],
  "filas": [
    {
      "institucion": "P. U. Católica de Chile",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Norma",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Presencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Seminario DER201H-3 íntegramente de IA y Derecho, 2025. No obligatorio.",
            "fuentes": [
              "R2-UC-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 20,
      "techo": 20,
      "sinConcluir": 0,
      "puntosExpuestos": 2
    },
    {
      "institucion": "U. Autónoma de Chile",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OPF",
          "puntos": 3,
          "cierre": {
            "nota": "IA+D creado por Resolución VRIP 118/2020 y adscrito a Derecho.",
            "fuentes": [
              "R2-UAUT-01",
              "R2-UAUT-02"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Norma",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó regla propia de Facultad.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "Usa herramientas de terceros; sin sistema propio desplegado.",
            "fuentes": [
              "R2-UAUT-05",
              "R2-UAUT-06"
            ],
            "contrastada": true
          }
        },
        {
          "capacidad": "Adopcion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Convenio Legalfit: prácticas con automatización e IA.",
            "fuentes": [
              "R2-UAUT-07"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 17,
      "techo": 17,
      "sinConcluir": 0,
      "puntosExpuestos": 5
    },
    {
      "institucion": "U. Central de Chile",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Norma",
          "estado": "OPF",
          "puntos": 3,
          "cierre": {
            "nota": "Resolución 13/2025 del decano aprueba instructivo de uso académico de IA.",
            "fuentes": [
              "R2-UCEN-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Academia y Laboratorio LegalTech selecciona desde segundo año.",
            "fuentes": [
              "R2-UCEN-03"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Ciclos semestrales, mentoring y certificación.",
            "fuentes": [
              "R2-UCEN-03"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Herramienta",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Convenio con la Cámara de Comercio de Sevilla para IA y LegalTech.",
            "fuentes": [
              "R2-UCEN-02"
            ],
            "contrastada": true
          }
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 17,
      "techo": 17,
      "sinConcluir": 0,
      "puntosExpuestos": 7
    },
    {
      "institucion": "U. de Chile",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Norma",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Presencia",
          "estado": "NC",
          "puntos": null,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 12,
      "techo": 14,
      "sinConcluir": 1,
      "puntosExpuestos": 0
    },
    {
      "institucion": "U. Adolfo Ibáñez",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "ADY",
          "puntos": 1,
          "cierre": {
            "nota": "Laboratorio de Justicia Centrada en las Personas: usa IA, su objeto no es IA.",
            "fuentes": [
              "R2-UAI-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Norma",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "Rutas recorridas sin localizar norma propia de Facultad.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Curso de pregrado con prototipos que incorporan IA.",
            "fuentes": [
              "R2-UAI-01",
              "R2-UAI-02"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "IA utilizada dentro de proyectos formativos del curso 2025.",
            "fuentes": [
              "R2-UAI-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Alcance",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "OPF",
          "puntos": 3,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 11,
      "techo": 11,
      "sinConcluir": 0,
      "puntosExpuestos": 5
    },
    {
      "institucion": "U. Andrés Bello",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó estructura de Derecho dedicada a IA o LegalTech.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Norma",
          "estado": "ENT",
          "puntos": 1,
          "cierre": {
            "nota": "Lineamientos de la universidad, no norma propia de Derecho.",
            "fuentes": [
              "R2-UNAB-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 11,
      "techo": 11,
      "sinConcluir": 0,
      "puntosExpuestos": 1
    },
    {
      "institucion": "U. del Desarrollo",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "Observatorio de Derecho y Tecnología, dependiente de un centro de Facultad.",
            "fuentes": [
              "R2-UDD-01"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Norma",
          "estado": "ENT",
          "puntos": 1,
          "cierre": {
            "nota": "Política y reglamento de la universidad, no de Derecho.",
            "fuentes": [
              "R2-UDD-04"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": {
            "nota": "II Versión del curso de IA para Abogados en 2026: continuidad verificable.",
            "fuentes": [
              "R2-UDD-02",
              "R2-UDD-03"
            ],
            "contrastada": false
          }
        },
        {
          "capacidad": "Herramienta",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "NC",
          "puntos": null,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 8,
      "techo": 10,
      "sinConcluir": 1,
      "puntosExpuestos": 5
    },
    {
      "institucion": "U. Diego Portales",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Norma",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "Declara orientación al uso de IA; no se localizó norma publicada.",
            "fuentes": [
              "R2-UDP-02"
            ],
            "contrastada": true
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "INC",
          "puntos": 1,
          "cierre": {
            "nota": "Taller y curso anunciados; falta programa de ejecución.",
            "fuentes": [
              "R2-UDP-02"
            ],
            "contrastada": true
          }
        },
        {
          "capacidad": "Herramienta",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó sistema de IA de Facultad.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Adopcion",
          "estado": "INC",
          "puntos": 1,
          "cierre": {
            "nota": "Incorporación anunciada desde primer y penúltimo semestre; falta ejecución.",
            "fuentes": [
              "R2-UDP-02"
            ],
            "contrastada": true
          }
        },
        {
          "capacidad": "Alcance",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 8,
      "techo": 8,
      "sinConcluir": 0,
      "puntosExpuestos": 0
    },
    {
      "institucion": "U. de los Andes",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó unidad de IA o LegalTech dependiente de Derecho.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Norma",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó norma propia de Derecho.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "NC",
          "puntos": null,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "OP",
          "puntos": 2,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "NC",
          "puntos": null,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 5,
      "techo": 9,
      "sinConcluir": 2,
      "puntosExpuestos": 0
    },
    {
      "institucion": "U. de Concepción",
      "celdas": [
        {
          "capacidad": "Unidad",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "Se localizaron actividades, no una unidad especializada.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Norma",
          "estado": "NL",
          "puntos": 0,
          "cierre": {
            "nota": "No se localizó instrumento propio de Facultad.",
            "fuentes": [],
            "contrastada": true
          }
        },
        {
          "capacidad": "Presencia",
          "estado": "NC",
          "puntos": null,
          "cierre": null
        },
        {
          "capacidad": "Formacion",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Herramienta",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Adopcion",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Alcance",
          "estado": "ENT",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Investigacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        },
        {
          "capacidad": "Transferencia",
          "estado": "INC",
          "puntos": 1,
          "cierre": null
        },
        {
          "capacidad": "Evaluacion",
          "estado": "NL",
          "puntos": 0,
          "cierre": null
        }
      ],
      "piso": 5,
      "techo": 7,
      "sinConcluir": 1,
      "puntosExpuestos": 0
    }
  ],
  "apartada": {
    "institucion": "P. U. Católica de Valparaíso",
    "celdas": [
      {
        "capacidad": "Unidad",
        "estado": "OP",
        "puntos": 2,
        "cierre": null
      },
      {
        "capacidad": "Norma",
        "estado": "ENT",
        "puntos": 1,
        "cierre": null
      },
      {
        "capacidad": "Presencia",
        "estado": "OP",
        "puntos": 2,
        "cierre": null
      },
      {
        "capacidad": "Formacion",
        "estado": "OP",
        "puntos": 2,
        "cierre": null
      },
      {
        "capacidad": "Herramienta",
        "estado": "OPF",
        "puntos": 3,
        "cierre": null
      },
      {
        "capacidad": "Adopcion",
        "estado": "ENT",
        "puntos": 1,
        "cierre": null
      },
      {
        "capacidad": "Alcance",
        "estado": "OP",
        "puntos": 2,
        "cierre": null
      },
      {
        "capacidad": "Investigacion",
        "estado": "OP",
        "puntos": 2,
        "cierre": null
      },
      {
        "capacidad": "Transferencia",
        "estado": "OPF",
        "puntos": 3,
        "cierre": null
      },
      {
        "capacidad": "Evaluacion",
        "estado": "NL",
        "puntos": 0,
        "cierre": null
      }
    ],
    "piso": 18,
    "techo": 18,
    "sinConcluir": 0,
    "puntosExpuestos": 0
  },
  "maximo": 30,
  "cierres": {
    "total": 26,
    "expuestos": 13,
    "puntosExpuestos": 25
  }
};
