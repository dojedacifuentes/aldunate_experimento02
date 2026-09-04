/**
 * Capa editorial del Informe 01: lo que se escribe, frente a lo que se calcula.
 *
 * Los seis CSV canónicos contienen los datos; este archivo contiene el texto que
 * los interpreta —lagunas, auditoría de la línea base, tabla de la PUCV— y vive
 * en `src/data` y no dentro de un componente, porque un componente con un
 * párrafo dentro es un componente que habrá que editar para corregir una fecha.
 *
 * Nada de aquí puede afirmar más de lo que el dataset sostiene. Cuando un texto
 * necesita una cifra, la cifra se lee de `informe01Recuento` en el componente y
 * no se copia aquí.
 */

/** Estado de un tema en la tabla de la PUCV. */
export type Informe01EstadoTema = 'existe' | 'parcial' | 'no-demostrado';

export interface Informe01Laguna {
  id: string;
  titulo: string;
  cuerpo: string;
  /** Qué haría falta para cerrarla. Una laguna sin salida es una queja. */
  cierre: string;
  ronda: 1 | 2 | 3;
  alcance: 'cohorte' | 'metodo' | 'institucion';
}

/**
 * Las lagunas declaradas. L-1 a L-5 vienen de la primera fusión, L-6 a L-10 de
 * la segunda, y L-11 y L-12 se abren en la tercera.
 *
 * Se publican porque el hueco declarado es un dato y el hueco tapado es un
 * error: quien vaya a citar el informe necesita saber qué no puede citar.
 */
export const informe01Lagunas: Informe01Laguna[] = [
  {
    id: 'L-1',
    titulo: 'La cobertura es desigual por diseño, y eso impide cualquier ranking',
    cuerpo:
      'Las tres universidades del piloto reúnen catorce fuentes de media y recorrieron 9,7 de las trece rutas del protocolo. Las otras ocho reúnen 3,8 fuentes y recorrieron 4,0 rutas. Esa diferencia mide esfuerzo de investigación, no actividad institucional.',
    cierre:
      'Aplicar el protocolo completo a las ocho universidades restantes. Hasta entonces no hay comparación nacional posible, por muchas fuentes que se acumulen.',
    ronda: 1,
    alcance: 'metodo',
  },
  {
    id: 'L-2',
    titulo: 'La posición relativa de la PUCV no puede sostenerse con lo que hay',
    cuerpo:
      'La evidencia de 2026 le es favorable —unidad oficializada en 2020, financiamiento competitivo en 2025 y 2026, herramienta propia, taller ejecutado, participación en la gobernanza universitaria—, y aun así no se localizó evidencia comparable a la de otras Facultades sobre mandato curricular, cobertura docente medida o herramienta con métricas de uso.',
    cierre:
      'Se publica como inferencia rotulada y nunca como hallazgo, arrastrando la advertencia de L-1: la PUCV se observa desde información privilegiada.',
    ronda: 1,
    alcance: 'institucion',
  },
  {
    id: 'L-3',
    titulo: 'Cinco iniciativas prueban anuncio y no ejecución',
    cuerpo:
      'Una malla orientada a admisión 2027, una innovación curricular anunciada en la presentación de una dirección, un convenio firmado sin cobertura publicada, una convocatoria abierta al corte y un ecosistema en implementación progresiva. Existir no es funcionar.',
    cierre:
      'Verificar ejecución en la ronda siguiente. Que hoy sea anuncio no permite anticipar que no se ejecute.',
    ronda: 1,
    alcance: 'cohorte',
  },
  {
    id: 'L-4',
    titulo: 'Ninguna fuente mide efecto sobre el aprendizaje jurídico',
    cuerpo:
      'Todo el corpus documenta existencia, implementación y adopción. Nada mide si funciona. Es la casilla vacía del cuarto peldaño de la escalera y la conclusión más sólida del informe hasta ahora, porque tres rondas independientes llegaron a ella por separado.',
    cierre:
      'Es el vacío que el Informe 02 cubre con evidencia internacional, y la costura por la que los dos informes se enlazan en vez de duplicarse.',
    ronda: 1,
    alcance: 'cohorte',
  },
  {
    id: 'L-5',
    titulo: 'La verificación sustantiva de las fuentes sigue pendiente y no se delega',
    cuerpo:
      'Las URL fueron abiertas por los modelos que produjeron los documentos de investigación, no por quien firma. Que una URL responda no prueba que diga lo que se le atribuye.',
    cierre:
      'Abrir cada fuente y contrastar cinco cosas: lo que dice de verdad, la fecha del hecho frente a la de publicación, la unidad a la que se atribuye, lo anunciado frente a lo ejecutado, y qué mide exactamente. Sólo entonces una fuente recibe fecha de verificación.',
    ronda: 1,
    alcance: 'metodo',
  },
  {
    id: 'L-6',
    titulo: 'Falta el acto formal de creación de casi todas las unidades',
    cuerpo:
      'Nombre comunicacional y unidad administrativa formal no son lo mismo. De las estructuras registradas, sólo una aparece en una estructura orgánica publicada; de las demás consta el anuncio de su creación y no su documento constitutivo.',
    cierre:
      'Resolución, organigrama o acta para cada unidad. Es un documento por institución y cambiaría la lectura de la dimensión de gobernanza.',
    ronda: 2,
    alcance: 'cohorte',
  },
  {
    id: 'L-7',
    titulo: 'La integración curricular efectiva es la mayor incógnita',
    cuerpo:
      'Hay mallas y anuncios. Faltan syllabus de 2026 con obligatoriedad, semestre, créditos y matrícula real. Sin eso, un taller optativo y una línea curricular obligatoria se confunden, y la diferencia entre ambos es justamente lo que separa actividad de capacidad.',
    cierre:
      'Un syllabus público por institución. No se localizó en ninguna de las once, de modo que la laguna es del campo y no de una universidad.',
    ronda: 2,
    alcance: 'cohorte',
  },
  {
    id: 'L-8',
    titulo: 'Los proyectos con financiamiento público no están verificados en ANID',
    cuerpo:
      'Un Fondecyt y dos referencias a FONDEF constan por noticia universitaria. La fuente gubernamental —código, monto, duración, equipo— debe sustituir a la nota de prensa, no complementarla.',
    cierre: 'Consultar los repositorios de ANID por código de proyecto.',
    ronda: 2,
    alcance: 'cohorte',
  },
  {
    id: 'L-9',
    titulo: 'Falta una línea base congelada de 2025',
    cuerpo:
      'El documento tratado como línea base histórica contiene actividades fechadas en abril, junio, agosto y septiembre de 2026. Una comparación mecánica mezclaría cambios reales con incorporaciones hechas retrospectivamente sobre el propio archivo.',
    cierre:
      'Mientras no exista un corte auténticamente congelado, ninguna afirmación de la forma «X aumentó desde 2025» es publicable. Requiere una decisión humana sobre qué se considera público al 31 de diciembre de 2025.',
    ronda: 2,
    alcance: 'metodo',
  },
  {
    id: 'L-10',
    titulo: 'Las herramientas heredadas pueden ser páginas históricas',
    cuerpo:
      'Tres herramientas constan en fuentes de 2025 o anteriores. Falta comprobar que siguen operativas en 2026 antes de presentarlas como capacidad actual.',
    cierre: 'Abrir cada herramienta y comprobar vigencia, no sólo que su página responda.',
    ronda: 2,
    alcance: 'cohorte',
  },
  {
    id: 'L-11',
    titulo: 'El corpus no contiene ninguna fuente de contraste externo',
    cuerpo:
      'La ruta 13 del protocolo está sin recorrer en las once instituciones. Salvo dos bases oficiales, todas las fuentes son publicaciones de las propias universidades, de modo que el corpus hereda íntegro el sesgo de autodescripción: mide lo que las instituciones cuentan de sí mismas.',
    cierre:
      'Prensa especializada, registros de organismos públicos, memorias de servicios con los que las Facultades firmaron convenios. No se corrige agregando más fuentes institucionales.',
    ronda: 3,
    alcance: 'metodo',
  },
  {
    id: 'L-12',
    titulo: 'Dos de las ocho dimensiones están vacías en las once instituciones',
    cuerpo:
      'Recursos y capacidades, y continuidad, cobertura y resultados no reúnen una sola evidencia en toda la cohorte. No es un descuido del registro: no se localizó ninguna fuente pública que declare dotación asignada, presupuesto basal o medición de resultados en ninguna Facultad de Derecho chilena.',
    cierre:
      'Es la laguna con la consecuencia más directa: mientras siga abierta, el informe puede describir qué se hace y no puede decir con qué se sostiene ni con qué efecto.',
    ronda: 3,
    alcance: 'cohorte',
  },
];

export interface Informe01AuditoriaFila {
  institucion: string;
  suma: string;
  total: string;
  nota: string;
}

/**
 * Auditoría de la línea base.
 *
 * El informe antecedente no se corrige en silencio: se audita a la vista y se
 * conserva como está. Sus totales no salen de sus propias puntuaciones, y sumar
 * o restar décimas a un total que no cuadra con sus sumandos propaga el error
 * con apariencia de precisión.
 */
export const informe01AuditoriaBase: Informe01AuditoriaFila[] = [
  {
    institucion: 'Universidad Adolfo Ibáñez',
    suma: '7,5',
    total: '6,2',
    nota: 'El total escrito es menor que la suma de sus cinco dimensiones.',
  },
  {
    institucion: 'Universidad Andrés Bello',
    suma: '7,75',
    total: '8,75',
    nota: 'El total escrito excede en un punto entero a la suma.',
  },
  {
    institucion: 'Universidad Central de Chile',
    suma: '8,0',
    total: '8,5',
    nota: 'Media décima de diferencia, sin origen declarado.',
  },
  {
    institucion: 'Universidad Diego Portales',
    suma: '1,0',
    total: '0,75',
    nota: 'Inconsistencia interna en la dimensión de investigación y desarrollo.',
  },
];

export interface Informe01TemaPucv {
  tema: string;
  estado: Informe01EstadoTema;
  evidencia: string;
  salto: string;
}

/**
 * Los doce temas de la tabla PUCV.
 *
 * El orden no es casual: los cinco primeros son lo que existe, y van primero
 * porque una sección que empieza por lo que falta es un alegato, no un informe.
 * La última columna es la que le da utilidad: cada carencia trae el hecho
 * concreto que la cerraría, y todos son actos verificables y baratos.
 */
export const informe01TemasPucv: Informe01TemaPucv[] = [
  {
    tema: 'Unidad dedicada',
    estado: 'existe',
    evidencia:
      'El Núcleo se oficializó en 2020 y en 2026 opera como Programa DIAT, con actividad documentada en 2024, 2025 y 2026.',
    salto:
      'Publicar el acto formal de creación: resolución, organigrama o documento constitutivo.',
  },
  {
    tema: 'Laboratorio de innovación legal',
    estado: 'existe',
    evidencia:
      'LMIL existe desde 2022, con colaboración externa y participación en un FDI del Ministerio de Educación en 2023.',
    salto:
      'Distinguir públicamente qué parte de LMIL es innovación legal y qué parte es IA: hoy la fuente sostiene lo primero.',
  },
  {
    tema: 'Herramienta propia de IA',
    estado: 'existe',
    evidencia:
      'ScribeClaroPUCV nació para estudiantes de Derecho, con apoyo del Programa de Desarrollo Docente.',
    salto: 'Publicar uso: cuántos estudiantes, en qué asignaturas, con qué resultado.',
  },
  {
    tema: 'Formación recurrente',
    estado: 'existe',
    evidencia:
      'El Taller de IA y Prompting Jurídico se ejecutó en 2025 con cerca de noventa participantes y volvió a obtener financiamiento en 2026.',
    salto:
      'Medir aprendizaje, no asistencia. Una prueba antes y después bastaría para ser la primera evidencia de cuarto nivel del país.',
  },
  {
    tema: 'Participación en la gobernanza universitaria',
    estado: 'existe',
    evidencia:
      'El decálogo institucional de uso ético de la IA lo lideró una profesora de Derecho desde la Unidad de Integridad Académica.',
    salto:
      'Convertir la participación en norma propia: una guía de Facultad, como la que ya tiene otra institución de la cohorte.',
  },
  {
    tema: 'Infraestructura disponible',
    estado: 'parcial',
    evidencia:
      'La Universidad habilitó Gemini para su comunidad desde marzo de 2026. Es acceso institucional, no adopción en Derecho.',
    salto: 'Publicar métricas de uso de la Facultad, aunque sean agregadas.',
  },
  {
    tema: 'Financiamiento',
    estado: 'parcial',
    evidencia:
      'Adjudicaciones competitivas de Vinculación con el Medio en 2025 y en 2026. La fuente oficial del Núcleo declara que su presupuesto basal no está públicamente determinado.',
    salto:
      'Declarar si existe presupuesto basal. Financiar proyectos demuestra interés; sobre financiar capacidad la evidencia pública no dice nada, aquí ni en las otras diez.',
  },
  {
    tema: 'Política propia de Facultad sobre IA',
    estado: 'no-demostrado',
    evidencia:
      'No se localizó. La regla vigente que alcanza a Derecho es universitaria, y la única política de Facultad de todo el corpus pertenece a otra institución.',
    salto:
      'Una guía de Escuela sobre uso, declaración y evaluación, con responsable nombrado.',
  },
  {
    tema: 'Línea curricular obligatoria',
    estado: 'no-demostrado',
    evidencia:
      'La página de Derecho declara competencia en tecnologías de información y enlaza al plan de estudios; la revisión pública no permitió verificar una trayectoria explícita en IA.',
    salto:
      'Publicar el syllabus con obligatoriedad, semestre, créditos y matrícula. No se localizó en ninguna de las once.',
  },
  {
    tema: 'Dotación específicamente asignada',
    estado: 'no-demostrado',
    evidencia:
      'No se localizó. La dimensión de recursos y capacidades está vacía en las once instituciones de la cohorte.',
    salto: 'Declarar horas o cargos asignados al programa, aunque sean parciales.',
  },
  {
    tema: 'Adopción cuantificada en la Facultad',
    estado: 'no-demostrado',
    evidencia:
      'No se localizó. La única cobertura docente cuantificada del corpus pertenece a otra institución y alcanza a cerca del 80 % de su profesorado de Derecho.',
    salto: 'Una encuesta docente publicada. Es el dato más barato de producir de esta lista.',
  },
  {
    tema: 'Evaluación de resultados',
    estado: 'no-demostrado',
    evidencia:
      'No se localizó, y no se localizó en ninguna de las once. Es la casilla vacía de todo el informe.',
    salto:
      'Medir el efecto de una sola actividad ya existente. No hace falta un programa nuevo para ser el primero.',
  },
];
