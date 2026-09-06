/* ══════════════════════════════════════════════════════════════════════════
   Comportamiento del lector · informes del laboratorio
   ──────────────────────────────────────────────────────────────────────────
   Sin dependencias y sin módulos: el documento tiene que abrirse desde un
   disco, sin red y sin nada instalado. Es la misma regla que gobierna el
   documento entero —un solo archivo, autónomo— y por eso esto va incrustado
   y no enlazado.

   Hace cuatro cosas:
     1. barra de progreso y capítulo activo en el raíl;
     2. alternador de tema, recordado;
     3. en modo embebido, publica su alto a la página que lo aloja;
     4. en modo embebido, recibe de ella el tema y las órdenes de navegación.
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var raíz = document.documentElement;
  var embebido = raíz.getAttribute('data-modo') === 'embebido';

  /* ── 1 · Progreso y capítulo activo ─────────────────────────────────── */

  var prog = document.getElementById('lector-prog');
  var enlaces = [].slice.call(document.querySelectorAll('.lector-raíl nav a'));
  var destinos = enlaces.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  function alDesplazar() {
    if (prog) {
      var h = document.documentElement;
      var alto = h.scrollHeight - h.clientHeight;
      prog.style.width = (alto > 0 ? (h.scrollTop / alto) * 100 : 0) + '%';
    }

    var activo = -1;
    for (var i = 0; i < destinos.length; i++) {
      var d = destinos[i];
      if (d && d.getBoundingClientRect().top <= 140) activo = i;
    }
    for (var j = 0; j < enlaces.length; j++) {
      enlaces[j].classList.toggle('activo', j === activo);
    }

    /*
      El raíl se desplaza por su cuenta, y en un documento de veinticinco
      capítulos el activo terminaba fuera de su vista: el índice marcaba una
      posición que no se podía ver sin buscarla a mano.
    */
    if (activo >= 0 && enlaces[activo] && !embebido) {
      var a = enlaces[activo];
      var raíl = a.closest('.lector-raíl');
      if (raíl && raíl.scrollHeight > raíl.clientHeight) {
        var ra = a.getBoundingClientRect();
        var rr = raíl.getBoundingClientRect();
        if (ra.top < rr.top + 8 || ra.bottom > rr.bottom - 8) {
          raíl.scrollTop += ra.top - rr.top - raíl.clientHeight / 2.5;
        }
      }
    }
  }

  if (!embebido) {
    addEventListener('scroll', alDesplazar, { passive: true });
    addEventListener('resize', alDesplazar, { passive: true });
    alDesplazar();
  }

  /* ── 2 · Tema ───────────────────────────────────────────────────────────
     Arranca en el del sistema y el botón lo fija. Se recuerda, porque quien
     elige claro para leer treinta y siete páginas no quiere volver a
     elegirlo en cada visita.

     En modo embebido no se toca nada: manda la página que aloja, y dos
     alternadores compitiendo por el mismo píxel es peor que ninguno. */

  var CLAVE = 'informe-lector-tema';

  if (!embebido) {
    try {
      var guardado = localStorage.getItem(CLAVE);
      if (guardado) raíz.setAttribute('data-theme', guardado);
    } catch (e) {
      /* Almacenamiento bloqueado: se lee con el tema del sistema. */
    }

    var botón = document.getElementById('lector-tema');
    if (botón) {
      botón.addEventListener('click', function () {
        var fijado = raíz.getAttribute('data-theme');
        var oscuroAhora = fijado
          ? fijado === 'dark'
          : matchMedia('(prefers-color-scheme: dark)').matches;
        var nuevo = oscuroAhora ? 'light' : 'dark';
        raíz.setAttribute('data-theme', nuevo);
        botón.setAttribute(
          'aria-label',
          nuevo === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        );
        try {
          localStorage.setItem(CLAVE, nuevo);
        } catch (e) {
          /* Sin memoria: el tema dura lo que la pestaña. */
        }
      });
    }
  }

  /* ── 3 · Conversación con la página que aloja ───────────────────────────
     Sólo en modo embebido, y sólo con quien lo abrió. El documento publica
     su alto para que el marco crezca hasta él: así hay un solo
     desplazamiento —el de la página— en vez de uno dentro de otro, que es
     el defecto que hace incómodo leer un documento largo dentro de un marco. */

  if (!embebido) return;

  var últimoAlto = 0;

  /**
   * Alto del contenido, medido en el envoltorio y no en el documento.
   *
   * `document.body.scrollHeight` y `documentElement.scrollHeight` valen **al
   * menos** el alto del marco, y el marco toma su alto justo de lo que se
   * publica aquí. Con eso se cierra un bucle: se informa 1.200, el marco pasa
   * a 1.200, el documento vuelve a medir 1.200 o más, se informa de nuevo…
   * En la primera prueba llegó a 3.147.655 píxeles antes de que lo parara la
   * inspección. `.lector` mide su contenido y nada más, así que no crece
   * porque el marco crezca.
   */
  function altoContenido() {
    var envoltorio = document.querySelector('.lector');
    if (envoltorio) return Math.ceil(envoltorio.getBoundingClientRect().height);
    return document.body.scrollHeight;
  }

  function publicarAlto() {
    var alto = altoContenido();
    /* Sin el umbral, un píxel de diferencia por redondeo mantiene el marco
       redibujándose para siempre. */
    if (Math.abs(alto - últimoAlto) < 2) return;
    últimoAlto = alto;
    parent.postMessage({ tipo: 'lector:alto', alto: alto }, '*');
  }

  function publicarÍndice() {
    var secciones = [].slice
      .call(document.querySelectorAll('.lector-cuerpo .page > h2[id]'))
      .map(function (h) {
        return {
          id: h.id,
          texto: (h.textContent || '').replace(/\s+/g, ' ').trim(),
          anexo: h.getAttribute('data-anexo') === 'sí',
        };
      });
    parent.postMessage({ tipo: 'lector:índice', secciones: secciones }, '*');
  }

  /*
    El alto cambia tres veces después de `load`: cuando llegan las fuentes,
    cuando el navegador reflowea las tablas anchas y cuando cambia el ancho.
    Un solo aviso deja el marco corto y el documento cortado por abajo.
  */
  /*
    El observador va sobre `.lector` y no sobre `body` por la misma razón que
    la medición: `body` cambia de tamaño cuando cambia el marco, y observarlo
    reintroduce el bucle por la puerta de atrás.
  */
  var envoltorio = document.querySelector('.lector');
  if (typeof ResizeObserver === 'function' && envoltorio) {
    new ResizeObserver(publicarAlto).observe(envoltorio);
  }
  addEventListener('load', publicarAlto);
  addEventListener('resize', publicarAlto, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(publicarAlto).catch(function () {});
  }
  publicarAlto();

  /*
    El índice se publica por iniciativa propia y no sólo cuando lo piden. La
    página que aloja lo pedía al dispararse `load` del marco, y ese momento
    puede caer antes de que ella tenga puesto su escuchador: el índice llegaba
    a nadie y la columna de navegación quedaba vacía sin que fallara nada.
  */
  publicarÍndice();
  addEventListener('load', publicarÍndice);

  /* El índice y el tema los pone la página que aloja; llegan por mensaje. */
  addEventListener('message', function (ev) {
    var d = ev.data;
    if (!d || typeof d !== 'object') return;

    if (d.tipo === 'lector:tema' && (d.tema === 'dark' || d.tema === 'light')) {
      raíz.setAttribute('data-theme', d.tema);
      publicarAlto();
    }

    /*
      Saltar a una sección. El marco no se desplaza —crece hasta su
      contenido—, así que aquí no se puede hacer scroll: se devuelve la
      posición de la sección y desplaza la página de fuera, que es la única
      que tiene una barra.
    */
    if (d.tipo === 'lector:ir' && typeof d.id === 'string') {
      var destino = document.getElementById(d.id);
      if (destino) {
        parent.postMessage(
          {
            tipo: 'lector:posición',
            id: d.id,
            arriba: destino.getBoundingClientRect().top + (scrollY || 0),
          },
          '*',
        );
      }
    }

    /* La página pide el índice para dibujarlo con su propia tipografía. */
    if (d.tipo === 'lector:índice') publicarÍndice();

    /*
      Pregunta de apertura.

      El marco se carga con el HTML de la página —va en el servidor— y su
      guion corre mucho antes de que la página termine de hidratar y ponga su
      escuchador. El primer alto y el primer índice se publicaban, por tanto,
      a nadie: el documento se quedaba en su alto provisional de 1.200 px y la
      columna del índice, vacía. Quien pregunta es quien sabe que ya está
      escuchando, así que la respuesta se fuerza y se salta el umbral.
    */
    if (d.tipo === 'lector:pregunta') {
      últimoAlto = 0;
      publicarAlto();
      publicarÍndice();
    }
  });

  /*
    Un enlace interno dentro del marco no puede desplazar la página de fuera
    por su cuenta: sin esto, pulsar el índice impreso del documento no hacía
    absolutamente nada, que es peor que no tenerlo enlazado.
  */
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    ev.preventDefault();
    parent.postMessage(
      {
        tipo: 'lector:posición',
        id: id,
        arriba: document.getElementById(id).getBoundingClientRect().top + (scrollY || 0),
      },
      '*',
    );
  });
})();
