import type { Chapter } from '@/types/game';

/**
 * CAPÍTULO 0 — EL JUICIO.
 *
 * Tutorial jugable de 3 a 5 minutos. Enseña, en este orden: leer la sala,
 * analizar, presionar, presentar prueba y ordenar un alegato. Termina en
 * absolución y, un segundo después, en la frase que abre el juego real.
 *
 * Diseño de fracaso: **aquí no se puede perder**. Fallar cuesta impulso,
 * prestigio o integridad, y cambia lo que EVA dirá de usted más adelante, pero
 * nunca reinicia la escena. Un tutorial que castiga con repetición enseña a
 * temerle al botón, no a usarlo.
 *
 * TONO. Comedia de sala. El chiste nunca sale de que el Derecho sea ridículo,
 * sino de que lo hacen personas con hambre, con manías y con ganas de irse a
 * las cinco. Tres reglas al escribir aquí:
 *
 *   1. Nadie hace un chiste a costa de la acusada. Ella es la única que se
 *      juega algo de verdad.
 *   2. El remate va al final de la línea, no al medio.
 *   3. Si una línea es sólo graciosa, sobra. Toda línea informa de algo:
 *      un hecho, una relación o un peligro.
 *
 * EL TRIBUNAL SON TRES Y SE ESCRIBEN DISTINTO.
 *   - Achurra preside. Tiene hambre y una sala que se ocupa a las cinco.
 *     Frases cortas. Corta a todo el mundo.
 *   - Pinilla anota. Interviene por cuestiones administrativas irrelevantes y
 *     nunca por el fondo. No levanta la vista.
 *   - Riquelme pregunta lo que nadie quería preguntar, incluidos sus colegas.
 *     Habla poco y descoloca.
 *
 * Cada línea puede declarar `quien` (quién la dice) y `a` (a quién). La cámara
 * lo lee y encuadra sola; el guion no habla de cámaras.
 *
 * Reparto: el del registro (`src/data/rpg/characters.ts`). Ningún personaje,
 * empresa, documento, tribunal o causa corresponde a algo real.
 */
export const prologo: Chapter = {
  id: 'prologo',
  titulo: 'El juicio',
  subtitulo: 'Capítulo 0',
  entorno: 'Sala de audiencias · tribunal ficticio',
  objetivo: 'Ganar.',
  inicio: 'apertura',

  nodos: {
    /* ── 1. Apertura ─────────────────────────────────────────────────── */
    apertura: {
      id: 'apertura',
      kind: 'dialogo',
      focus: 'estrado',
      speaker: 'judge_achurra',
      mood: 'skeptical',
      lines: [
        'Se reanuda la audiencia. Que conste el ingreso de la defensa.',
        {
          text: 'Señor fiscal, señora defensora: tengo agenda hasta las siete y una sala que se ocupa a las cinco. Sean breves o sean buenos. De preferencia, ambas cosas.',
          mood: 'skeptical',
        },
        {
          quien: 'judge_pinilla',
          text: 'Señoría, antes de continuar. La defensa figura en el acta con dos apellidos y en la carátula con uno.',
          mood: 'neutral',
        },
        {
          quien: 'judge_achurra',
          a: 'judge_pinilla',
          text: '¿Y eso cambia algo, don Óscar?',
          mood: 'skeptical',
        },
        {
          quien: 'judge_pinilla',
          text: 'Cambia el acta.',
          mood: 'neutral',
        },
        {
          quien: 'judge_riquelme',
          a: 'defensa',
          text: 'Yo tengo una pregunta más simple, y es para la defensa: ¿alguien ha visto ese anexo, o todos hemos visto una fotocopia de él?',
          mood: 'thinking',
        },
        {
          quien: 'judge_achurra',
          a: 'judge_riquelme',
          text: 'Amanda, todavía no empezamos.',
          mood: 'angry',
        },
        {
          quien: 'judge_riquelme',
          text: 'Por eso lo pregunto ahora. Después nadie se acuerda.',
          mood: 'neutral',
        },
      ],
      eva: 'Buenos días. Soy EVA. Voy a acompañarle sin resolverle nada, que es la única forma de ayuda que sirve. Tome nota de la jueza de la derecha: es la única que ya leyó la carpeta.',
      next: 'sofia',
    },

    /* ── 2. La socia, desde el público ───────────────────────────────── */
    sofia: {
      id: 'sofia',
      kind: 'dialogo',
      focus: 'publico',
      speaker: 'director_sofia',
      mood: 'neutral',
      lines: [
        'Vine a mirar. No a ayudar: a mirar. Es distinto y le conviene notar la diferencia.',
        'La fiscalía trae una sola testigo. Si ella cae, la acusación cae con ella.',
        {
          text: 'El tribunal son tres. Achurra decide, Pinilla anota y Riquelme piensa. Usted hábleles a los tres y mire a la que piensa.',
          mood: 'thinking',
        },
        {
          text: 'Y una cosa: EVA le va a hablar. No le crea todo. Acierta casi siempre y nunca avisa cuándo no.',
          mood: 'skeptical',
        },
      ],
      eva: 'Ochenta y tres por ciento. El dato lo aporté yo, de modo que trátelo con la desconfianza que corresponde.',
      next: 'fiscal-alegato',
    },

    /* ── 3. Alegato de apertura de la fiscalía ───────────────────────── */
    'fiscal-alegato': {
      id: 'fiscal-alegato',
      kind: 'dialogo',
      focus: 'fiscalia',
      speaker: 'prosecutor_naveas',
      mood: 'neutral',
      lines: [
        { text: 'La acusada alteró un anexo del contrato y lo hizo pasar por firmado.', a: 'estrado' },
        'Tenemos el documento. Tenemos el perjuicio. Y tenemos algo que rara vez tenemos: alguien que la vio hacerlo.',
        {
          text: 'La testigo estaba en la oficina esa noche. Eso es todo, señoría. No necesito más.',
          a: 'judge_achurra',
        },
        {
          quien: 'judge_pinilla',
          text: 'Foja cuarenta y dos.',
          mood: 'neutral',
        },
        {
          quien: 'prosecutor_naveas',
          a: 'judge_pinilla',
          text: '…Cuarenta y tres, señoría.',
          mood: 'surprised',
        },
        {
          quien: 'judge_pinilla',
          text: 'Cuarenta y dos. La cuarenta y tres está en blanco.',
          mood: 'neutral',
        },
        {
          quien: 'judge_achurra',
          text: 'Continúe, fiscal. Con la foja que sea.',
          mood: 'skeptical',
        },
      ],
      eva: 'Interesante. Ha construido su caso sobre una persona. Las personas recuerdan mal las horas y muy bien los agravios.',
      next: 'apertura-decision',
    },

    /* ── 4. Primera decisión ─────────────────────────────────────────── */
    'apertura-decision': {
      id: 'apertura-decision',
      kind: 'decision',
      focus: 'sala',
      prompt:
        'Le toca abrir. Tiene noventa segundos de atención del tribunal y una sala que se ocupa a las cinco.',
      opciones: [
        {
          id: 'breve',
          label: 'Alegato breve: anunciar que toda la acusación depende de una sola testigo.',
          skill: 'objetar',
          acierta: true,
          respuesta: [
            '«Señoría: el señor fiscal acaba de decirlo mejor de lo que yo podría. Todo su caso es una persona. Escuchémosla.»',
            {
              quien: 'judge_achurra',
              text: 'Eso ha durado once segundos. Puede sentarse antes de arruinarlo.',
              mood: 'friendly',
            },
            {
              quien: 'judge_pinilla',
              text: 'Doce.',
              mood: 'neutral',
            },
            'Naveas cambia el peso de pie. Ese movimiento vale más que cualquier aplauso.',
          ],
          efectos: { xp: 40, stats: { prestigio: 1 }, flag: 'apertura_afilada' },
          next: 'testigo-entra',
        },
        {
          id: 'completo',
          label: 'Alegato completo: recorrer los antecedentes del contrato desde el principio.',
          respuesta: [
            'Empieza por la constitución de la sociedad. En el minuto nueve va por el año 2019.',
            {
              quien: 'judge_riquelme',
              text: '¿Vamos a llegar a esta noche, o nos quedamos en esa?',
              mood: 'skeptical',
            },
            {
              quien: 'judge_achurra',
              text: 'Defensa: la parte del medio la damos por leída.',
              mood: 'angry',
            },
            'Nada de lo que afirmó era falso. Simplemente, ya nadie escuchaba cuando llegó a lo importante.',
          ],
          efectos: { xp: 10 },
          next: 'testigo-entra',
        },
        {
          id: 'suspension',
          label: 'Pedir suspensión para explorar una salida alternativa.',
          skill: 'negociar',
          respuesta: [
            {
              quien: 'judge_achurra',
              a: 'defensa',
              text: 'No ha lugar. La sala se ocupa a las cinco y yo no he almorzado.',
              mood: 'angry',
            },
            {
              quien: 'judge_pinilla',
              text: 'Consta el rechazo. ¿Consigno también lo del almuerzo?',
              mood: 'neutral',
            },
            {
              quien: 'judge_achurra',
              a: 'judge_pinilla',
              text: 'No.',
              mood: 'angry',
            },
            'No era una mala idea. Era una idea para hace tres semanas.',
          ],
          efectos: { xp: 5, stats: { prestigio: -1 } },
          next: 'testigo-entra',
        },
      ],
    },

    /* ── 5. Entra la testigo ─────────────────────────────────────────── */
    'testigo-entra': {
      id: 'testigo-entra',
      kind: 'dialogo',
      focus: 'testigo',
      speaker: 'witness_zapata',
      mood: 'neutral',
      lines: [
        'Trabajo en contabilidad desde hace once años. Esa noche me quedé cerrando el mes.',
        {
          text: 'La vi. Estaba en la sala de reuniones del piso once, con el anexo sobre la mesa. Firmó y guardó la carpeta.',
          a: 'estrado',
          mood: 'neutral',
        },
        {
          text: 'Eran las siete cuarenta. Lo recuerdo porque miré la hora pensando en el último metro.',
          mood: 'thinking',
        },
        {
          quien: 'judge_riquelme',
          a: 'witness_zapata',
          text: 'El último metro pasa a las once.',
          mood: 'neutral',
        },
        {
          quien: 'witness_zapata',
          a: 'judge_riquelme',
          text: 'El último que me sirve a mí.',
          mood: 'surprised',
        },
        {
          quien: 'judge_riquelme',
          text: 'Ah. Bueno.',
          mood: 'thinking',
        },
      ],
      eva: 'Recuerda la hora exacta de un hecho de hace catorce meses y la justifica con un motivo doméstico. Es la clase de detalle que se agrega cuando se teme no ser creído.',
      next: 'scan',
    },

    /* ── 6. ANALIZAR ─────────────────────────────────────────────────── */
    scan: {
      id: 'scan',
      kind: 'scan',
      focus: 'testigo',
      prompt:
        'ANALIZAR · Elija dónde mirar. Sólo una de estas tres cosas se puede contrastar con un documento.',
      objetivos: [
        {
          id: 'hora',
          label: 'La hora que acaba de dar: 19:40.',
          acierta: true,
          revela:
            'Una hora es una afirmación de hecho, y las afirmaciones de hecho chocan con registros. En la carpeta está la bitácora de accesos de la torre.',
          otorgaEvidencia: 'bitacora',
        },
        {
          id: 'nervios',
          label: 'Las manos: junta y separa los dedos cada vez que habla.',
          revela:
            'Está nerviosa. También lo estaría usted. El nerviosismo de un testigo no prueba nada, y decirlo en voz alta lo deja a usted como el que no tiene documentos.',
        },
        {
          id: 'fiscal',
          label: 'Mira al fiscal antes de cada respuesta.',
          revela:
            'Lo hace. Es incómodo y no prueba nada: preparar a un testigo es legítimo. Guárdelo para el alegato, no para una objeción.',
        },
      ],
      next: 'contrainterrogatorio',
    },

    /* ── 7. Contrainterrogatorio ─────────────────────────────────────── */
    contrainterrogatorio: {
      id: 'contrainterrogatorio',
      kind: 'decision',
      focus: 'testigo',
      speaker: 'witness_zapata',
      prompt:
        'Tiene el contrainterrogatorio. Lo que haga aquí decide si la hora queda fijada o queda difusa.',
      eva: 'Consejo no solicitado: no le pregunte si está segura. Pregúntele algo que la obligue a repetir el dato.',
      opciones: [
        {
          id: 'fijar',
          label: '«¿A qué hora salió usted del edificio esa noche?»',
          skill: 'presionar',
          acierta: true,
          respuesta: [
            {
              quien: 'witness_zapata',
              a: 'defensa',
              text: 'A las ocho menos cuarto. Salimos casi juntas.',
              mood: 'neutral',
            },
            {
              quien: 'judge_riquelme',
              a: 'judge_achurra',
              text: 'Anote esa.',
              mood: 'thinking',
            },
            {
              quien: 'judge_pinilla',
              text: 'Ya la anoté.',
              mood: 'neutral',
            },
            'Acaba de amarrar su hora a la de ella. Ya no puede corregir una sin corregir la otra.',
          ],
          efectos: { xp: 45, stats: { argumentacion: 1 }, flag: 'hora_fijada' },
          next: 'prueba-hora',
        },
        {
          id: 'segura',
          label: '«¿Está usted segura de lo que dice?»',
          respuesta: [
            {
              quien: 'witness_zapata',
              a: 'defensa',
              text: 'Completamente segura.',
              mood: 'angry',
            },
            {
              quien: 'judge_achurra',
              text: 'Bueno. Eso ya lo sabíamos.',
              mood: 'skeptical',
            },
            'Le regaló la oportunidad de sonar firme delante del tribunal. La testigo se yergue un poco. Naveas, también.',
          ],
          efectos: { xp: 10, stats: { prestigio: -1 } },
          next: 'prueba-hora',
        },
        {
          id: 'acusar',
          label: '«¿Le pidieron que declarara esto?»',
          skill: 'objetar',
          respuesta: [
            {
              quien: 'prosecutor_naveas',
              a: 'estrado',
              text: 'Objeción. Sugiere una conducta sin ningún antecedente.',
              mood: 'angry',
            },
            {
              quien: 'judge_achurra',
              a: 'defensa',
              text: 'Ha lugar. Defensa: traiga documentos o traiga preguntas. Las insinuaciones las dejamos para el pasillo.',
              mood: 'angry',
            },
            {
              quien: 'judge_pinilla',
              text: 'Consta la insinuación.',
              mood: 'neutral',
            },
          ],
          efectos: { xp: 5, stats: { prestigio: -1, integridad: -1 } },
          next: 'prueba-hora',
        },
      ],
    },

    /* ── 8. Presentar prueba ─────────────────────────────────────────── */
    'prueba-hora': {
      id: 'prueba-hora',
      kind: 'prueba',
      focus: 'testigo',
      prompt: 'PRUEBA · Presente la pieza que contradice lo que acaba de declararse.',
      afirmacion: '«La vi firmar a las 19:40. Salimos casi juntas, a las 19:45.»',
      evidenciaCorrecta: 'bitacora',
      aciertoTexto: [
        'Proyecta la bitácora. 18:12, salida. Ninguna entrada posterior esa noche.',
        'La testigo mira la pantalla más tiempo del que necesita para leerla. «Entonces me equivoqué de día», dice.',
        'Riquelme se inclina hacia adelante por primera vez en toda la audiencia. Achurra deja de mirar el reloj.',
        'Cuando un testigo cambia el día para salvar la hora, ha dejado de declarar sobre un recuerdo.',
      ],
      falloTexto: [
        'Presenta la pieza. Naveas ni siquiera objeta: la deja terminar.',
        '«Señoría, eso no contradice nada de lo declarado.» Tiene razón, y usted lo supo a la mitad de la frase.',
        'Pinilla anota algo. No sabe qué, y eso es peor.',
        'La testigo sigue en pie, con su hora intacta. Todavía puede recuperar esto, pero ya no gratis.',
      ],
      next: 'querellante',
    },

    /* ── 9. El querellante interviene ────────────────────────────────── */
    querellante: {
      id: 'querellante',
      kind: 'dialogo',
      focus: 'publico',
      speaker: 'rival_ignacio',
      mood: 'skeptical',
      lines: [
        { text: 'Ignacio Bravo, por el querellante. Con la venia.', a: 'estrado' },
        'Una bitácora registra torniquetes, no personas. Cualquiera puede entrar detrás de otro.',
        {
          text: 'Y aunque la hora fuera otra: el anexo existe, está alterado y beneficia a su representada. La defensa nos ha mostrado un reloj. Nosotros seguimos teniendo un delito.',
          a: 'defensa',
          mood: 'angry',
        },
        {
          quien: 'judge_riquelme',
          a: 'rival_ignacio',
          text: 'Bonita frase. ¿Tiene también un documento?',
          mood: 'skeptical',
        },
        {
          quien: 'rival_ignacio',
          text: '…Tengo el anexo, señoría.',
          mood: 'surprised',
        },
        {
          quien: 'judge_riquelme',
          text: 'Ese lo tenemos todos.',
          mood: 'neutral',
        },
      ],
      eva: 'Ha cambiado de terreno. Ya no discute quién la vio: discute el documento. Sígalo ahí, que ahí es más débil.',
      next: 'metadatos-decision',
    },

    /* ── 10. Metadatos ───────────────────────────────────────────────── */
    'metadatos-decision': {
      id: 'metadatos-decision',
      kind: 'decision',
      focus: 'sala',
      prompt: 'El querellante movió el caso del testimonio al documento. Responda donde él lo puso.',
      opciones: [
        {
          id: 'metadatos',
          label: 'Presentar los metadatos del anexo: creación 21:03, equipo VL-114.',
          skill: 'prueba',
          acierta: true,
          respuesta: [
            '«El anexo se creó a las 21:03, desde el equipo VL-114. Ese equipo está asignado al área del querellante. Mi representada usaba el VL-032 y ya no estaba en el edificio.»',
            'Silencio de dos segundos. En una sala de audiencias, dos segundos son una eternidad y todos saben contarlos.',
            {
              quien: 'judge_pinilla',
              text: 'VL-uno-uno-cuatro. ¿Uve corta?',
              mood: 'neutral',
            },
            {
              quien: 'judge_achurra',
              a: 'judge_pinilla',
              text: 'Óscar.',
              mood: 'angry',
            },
            {
              quien: 'judge_pinilla',
              text: 'Es que después no se entiende el acta.',
              mood: 'neutral',
            },
            {
              quien: 'judge_achurra',
              a: 'defensa',
              text: 'Que se incorpore.',
              mood: 'friendly',
            },
          ],
          efectos: {
            xp: 60,
            stats: { argumentacion: 1, estrategia: 1 },
            otorgaEvidencia: 'metadatos',
            flag: 'metadatos_incorporados',
          },
          next: 'eva-sintesis',
        },
        {
          id: 'pericia',
          label: 'Presentar el informe pericial de firma.',
          skill: 'prueba',
          respuesta: [
            {
              quien: 'rival_ignacio',
              a: 'estrado',
              text: 'El perito no concluye, señoría. No descarta ni afirma.',
              mood: 'friendly',
            },
            {
              quien: 'judge_riquelme',
              a: 'defensa',
              text: 'Defensa, ¿usted trajo un informe que no dice nada, o yo leí otro?',
              mood: 'skeptical',
            },
            'Un informe que no concluye siembra duda cuando lo trae quien no carga con la prueba. Usted lo trajo como si probara algo.',
          ],
          efectos: { xp: 15, otorgaEvidencia: 'pericia' },
          next: 'eva-sintesis',
        },
        {
          id: 'insistir',
          label: 'Insistir en la bitácora y en la contradicción de la testigo.',
          skill: 'presionar',
          respuesta: [
            {
              quien: 'judge_achurra',
              a: 'defensa',
              text: 'Ya lo escuchamos, defensa. ¿Tiene algo sobre el documento?',
              mood: 'angry',
            },
            {
              quien: 'judge_pinilla',
              text: 'Es la tercera vez que consigno la bitácora.',
              mood: 'neutral',
            },
            'Repetir un acierto no lo duplica. Sólo gasta la paciencia que iba a necesitar en el alegato.',
          ],
          efectos: { xp: 10 },
          next: 'eva-sintesis',
        },
      ],
    },

    /* ── 11. Síntesis de EVA ─────────────────────────────────────────── */
    'eva-sintesis': {
      id: 'eva-sintesis',
      kind: 'dialogo',
      focus: 'defensa',
      speaker: 'eva',
      mood: 'thinking',
      lines: [
        'Resumo, que es lo único que hago bien sin supervisión.',
        'La acusación tiene un documento alterado y ninguna forma de ponerlo en las manos de su representada a la hora en que dijo que estuvo.',
        'Eso no prueba que ella sea inocente. Prueba que ellos no probaron que sea culpable, que en este edificio es exactamente lo mismo.',
        {
          text: 'Y un dato de sala: la presidenta lleva cuarenta minutos sin mirar el reloj. Antes lo miraba cada seis. Interprételo usted.',
          mood: 'friendly',
        },
      ],
      eva: 'Ahora ordene el alegato: hecho, prueba y norma, en ese orden. Si empieza por la norma, el tribunal se dormirá antes de saber de qué habla.',
      next: 'alegato',
    },

    /* ── 12. Alegato final ───────────────────────────────────────────── */
    alegato: {
      id: 'alegato',
      kind: 'alegato',
      focus: 'estrado',
      prompt:
        'ALEGATO FINAL · Arme las tres piezas. La cuarta —decirlo— la pone usted con la barra espaciadora.',
      slots: [
        {
          id: 'hecho',
          label: 'Hecho',
          ayuda: 'El que se puede contrastar, no el que le gustaría que fuera cierto.',
          correcta: 'h2',
          opciones: [
            { id: 'h1', label: 'Mi representada es una persona honorable.' },
            { id: 'h2', label: 'Quiroga salió del edificio a las 18:12 y no volvió esa noche.' },
            { id: 'h3', label: 'La testigo declaró bajo presión de la fiscalía.' },
          ],
        },
        {
          id: 'prueba',
          label: 'Prueba',
          ayuda: 'La pieza que sostiene ese hecho concreto. Una, no tres.',
          correcta: 'p2',
          opciones: [
            { id: 'p1', label: 'El informe pericial de firma, que no concluye.' },
            { id: 'p2', label: 'Bitácora de accesos y metadatos del anexo (21:03, equipo VL-114).' },
            { id: 'p3', label: 'El nerviosismo de la testigo durante su declaración.' },
          ],
        },
        {
          id: 'norma',
          label: 'Norma',
          ayuda: 'La regla que convierte esa duda en absolución.',
          correcta: 'n2',
          opciones: [
            { id: 'n1', label: 'La libertad del tribunal para apreciar la prueba.' },
            { id: 'n2', label: 'Sólo se condena cuando no queda duda razonable sobre la participación.' },
            { id: 'n3', label: 'La obligación de las partes de actuar de buena fe.' },
          ],
        },
      ],
      next: 'veredicto',
    },

    /* ── 13. Veredicto ───────────────────────────────────────────────── */
    veredicto: {
      id: 'veredicto',
      kind: 'fin',
      focus: 'estrado',
      desenlace: 'absolucion',
      titulo: 'Absolución',
      cuerpo: [
        'Los tres deliberan de pie, tapándose la boca con la carpeta, como si alguien fuera a leerles los labios desde la cuarta fila.',
        'Vuelven. Pinilla se sienta con el acta ya escrita: la tenía redactada desde los metadatos.',
        'La presidenta lee sin énfasis, como quien lee una dirección.',
        'La acusación no logró situar a la acusada en el lugar ni en la hora del hecho. La prueba documental incorporada por la defensa introduce una duda que el tribunal no puede resolver en contra.',
        'Se absuelve.',
      ],
      epilogo: [
        'Riquelme la mira un segundo de más antes de levantarse. No es felicitación: es curiosidad.',
        'Marta Quiroga le da la mano dos veces, como si la primera no hubiera contado.',
        'Sofía Aldana no aplaude. Sonríe apenas, se levanta y sale antes que nadie.',
        'Afuera, alguien saca una foto. En el estudio ya se habla de sociedad.',
        'Su teléfono vibra. Número desconocido. Siete palabras.',
        'NO DEBISTE GANAR ESE JUICIO.',
      ],
    },
  },
};
