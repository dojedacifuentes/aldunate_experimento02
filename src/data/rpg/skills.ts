import type { Especialidad, Skill, Stats } from '@/types/game';

export const skills: Skill[] = [
  {
    id: 'analizar',
    tecla: '1',
    nombre: 'Analizar',
    descripcion: 'Destaca lo que no calza: gestos, horas, objetos, relaciones.',
    stat: 'investigacion',
  },
  {
    id: 'presionar',
    tecla: '2',
    nombre: 'Presionar',
    descripcion: 'Sube la presión de la conversación. Funciona hasta que deja de funcionar.',
    stat: 'argumentacion',
  },
  {
    id: 'objetar',
    tecla: '3',
    nombre: 'Objetar',
    descripcion: 'Interrumpe una afirmación cuando hay motivo. Sin motivo, cuesta prestigio.',
    stat: 'estrategia',
  },
  {
    id: 'prueba',
    tecla: '4',
    nombre: 'Prueba',
    descripcion: 'Presenta una pieza del expediente contra lo que acaba de decirse.',
    stat: 'argumentacion',
  },
  {
    id: 'negociar',
    tecla: '5',
    nombre: 'Negociar',
    descripcion: 'Transforma el conflicto en lugar de ganarlo. A veces es lo correcto.',
    stat: 'negociacion',
  },
];

export const skillById = (id: string): Skill | undefined => skills.find((s) => s.id === id);

export const statsBase: Stats = {
  argumentacion: 3,
  investigacion: 3,
  negociacion: 3,
  estrategia: 3,
  integridad: 5,
  prestigio: 1,
};

export const especialidades: {
  id: Especialidad;
  nombre: string;
  lema: string;
  descripcion: string;
  ventaja: Partial<Stats>;
  ventajaTexto: string;
}[] = [
  {
    id: 'litigacion',
    nombre: 'Litigación',
    lema: 'La sala es su terreno',
    descripcion:
      'Aprendió a pensar de pie y en voz alta. Sus alegatos abren puertas que la prudencia deja cerradas.',
    ventaja: { argumentacion: 2 },
    ventajaTexto: '+2 Argumentación',
  },
  {
    id: 'investigacion',
    nombre: 'Investigación',
    lema: 'Lee el expediente dos veces',
    descripcion:
      'Ve lo que sobra y lo que falta. Donde otros ven un documento, usted ve una fecha que no corresponde.',
    ventaja: { investigacion: 2 },
    ventajaTexto: '+2 Investigación',
  },
  {
    id: 'negociacion',
    nombre: 'Negociación',
    lema: 'El juicio es la última opción',
    descripcion:
      'Sabe que casi todo se resuelve antes de la audiencia. El problema es cuando alguien no quiere resolverlo.',
    ventaja: { negociacion: 2 },
    ventajaTexto: '+2 Negociación',
  },
];
