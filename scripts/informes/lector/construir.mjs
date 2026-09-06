/* ══════════════════════════════════════════════════════════════════════════
   Constructor del lector en línea
   ──────────────────────────────────────────────────────────────────────────
   Toma un documento tal como lo entrega la cadena editorial —maquetado para
   papel, en milímetros y puntos— y le añade una capa de lectura en pantalla:
   anclas, índice navegable, raíl, progreso, modo claro y oscuro, y el
   protocolo para vivir dentro de una página del sitio.

   No toca el contenido. Añade atributos y envoltorios, y nada más: ninguna
   palabra, ninguna cifra y ningún orden cambian. Es la condición para que el
   documento que se lee en pantalla siga siendo el mismo que se imprime.

   Uso:
     node scripts/informes/lector/construir.mjs

   Lee de  content/reports/<informe>/entregas/<versión>/*.html   (intocado)
   Escribe en public/descargas/<carpeta>/*.html                   (publicado)

   Es idempotente: la fuente nunca se modifica, así que volver a ejecutarlo
   produce exactamente el mismo resultado. Cuando llegue la versión
   siguiente, se añade su entrada a DOCUMENTOS y se ejecuta.
   ══════════════════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..');

const ESTILOS = fs.readFileSync(path.join(aquí, 'estilos.css'), 'utf8');
const COMPORTAMIENTO = fs.readFileSync(path.join(aquí, 'comportamiento.js'), 'utf8');

import { DOCUMENTOS } from './documentos.mjs';

/* ── Utilidades ─────────────────────────────────────────────────────────── */

const sinEtiquetas = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

/** Clave de comparación: sin acentos, sin mayúsculas, sin puntuación suelta. */
const normalizar = (s) =>
  sinEtiquetas(s)
    .toLowerCase()
    .normalize('NFD')
    // Rango de diacríticos combinantes, escrito con escapes: un carácter
    // combinante literal en el código fuente es invisible y cualquier editor
    // que normalice el archivo lo borra sin que se note.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function babosa(texto, usadas) {
  let base = normalizar(texto).replace(/\s+/g, '-').slice(0, 60) || 'seccion';
  let s = base;
  let n = 2;
  while (usadas.has(s)) s = `${base}-${n++}`;
  usadas.add(s);
  return s;
}

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── Transformación ─────────────────────────────────────────────────────── */

function construir(doc) {
  const rutaFuente = path.join(raíz, doc.fuente);
  let html = fs.readFileSync(rutaFuente, 'utf8');

  if (html.includes('id="lector-prog"')) {
    throw new Error(
      `${doc.fuente} ya lleva capa de lector. La fuente debe ser el documento entregado, intocado.`,
    );
  }

  const iCuerpo = html.indexOf('<body');
  const aperturaFin = html.indexOf('>', iCuerpo) + 1;
  const iFin = html.lastIndexOf('</body>');
  const cabeza = html.slice(0, aperturaFin);
  let cuerpo = html.slice(aperturaFin, iFin);
  const cola = html.slice(iFin);

  /* 1 · Clasificar las secciones del índice impreso en cuerpo y anexos.
        El documento no marca cuál es cuál en el `h2`; lo dice su índice, con
        dos rótulos `.toc-h`. Se lee de ahí en vez de adivinarlo por el
        título, que es lo que se rompería con el informe siguiente. */
  const grupoDe = new Map();
  let grupoActual = 'cuerpo';
  const reÍndice = /<div class="toc-h">([\s\S]*?)<\/div>|<span class="toc-t">([\s\S]*?)<\/span>/g;
  for (const m of cuerpo.matchAll(reÍndice)) {
    if (m[1] !== undefined) {
      grupoActual = /anexo/i.test(sinEtiquetas(m[1])) ? 'anexo' : 'cuerpo';
    } else if (m[2] !== undefined) {
      grupoDe.set(normalizar(m[2]), grupoActual);
    }
  }

  /* 2 · Anclas en los encabezados. Sin ellas no hay índice navegable ni raíl:
        el documento entregado tiene un solo `id` en cuatrocientos kilobytes.

        Se anclan `h2` y `h3`. El raíl sólo muestra los `h2`, pero el índice
        impreso del documento cita como sección algo que está maquetado como
        `h3` —«2 · Objetivos»—, y sin ancla esa entrada no llevaría a ninguna
        parte. Anclar los dos niveles cuesta nada y hace enlazable el
        documento entero. */
  const usadas = new Set();
  const secciones = [];
  const anclas = [];

  cuerpo = cuerpo.replace(
    /<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/g,
    (todo, etiqueta, attrs, interior) => {
      const texto = sinEtiquetas(interior);
      const id = babosa(texto, usadas);
      const anexo = grupoDe.get(normalizar(texto)) === 'anexo';
      anclas.push({ id, texto });
      if (etiqueta === 'h2') secciones.push({ id, texto, anexo });
      const a = attrs || '';
      if (/\sid=/.test(a)) return todo;
      return `<${etiqueta}${a} id="${id}"${
        etiqueta === 'h2' && anexo ? ' data-anexo="sí"' : ''
      }>${interior}</${etiqueta}>`;
    },
  );

  /* 3 · El índice impreso se vuelve navegable. En papel el número es la
        página; en pantalla no hay páginas, y una lista de títulos que no
        lleva a ninguna parte es peor que no tenerla. */
  const porTexto = new Map(anclas.map((s) => [normalizar(s.texto), s.id]));

  /*
    El emparejamiento tolera que el índice y el título no coincidan palabra por
    palabra. Ocurre: el índice de la v2.0.0 dice «Ampliación del corpus:
    fuentes de la segunda ronda» y el encabezado dice «…las fuentes…». Exigir
    igualdad exacta deja esa entrada muerta y nadie se entera, porque un enlace
    que no se genera no falla: simplemente no está.
  */
  const sinEnlazar = [];

  function buscarAncla(títuloÍndice) {
    const clave = normalizar(títuloÍndice);
    const exacto = porTexto.get(clave);
    if (exacto) return exacto;
    const porInclusión = anclas.filter((a) => {
      const t = normalizar(a.texto);
      return t.includes(clave) || clave.includes(t);
    });
    // Sólo si no hay ambigüedad: dos candidatos significan que no se sabe.
    if (porInclusión.length === 1) return porInclusión[0].id;

    /*
      Último intento, por palabras: el índice de la v2.0.0 dice «Ampliación
      del corpus: fuentes de la segunda ronda» y el encabezado «…las
      fuentes…». Un artículo de más rompe la inclusión pero no la identidad,
      y exigir que todas las palabras del índice estén en el título —y que la
      coincidencia sea única— no admite falsos positivos entre secciones que
      hablan de cosas distintas.
    */
    const palabras = clave.split(' ').filter((p) => p.length > 2);
    if (palabras.length < 3) return null;
    const porPalabras = anclas.filter((a) => {
      const t = normalizar(a.texto);
      return palabras.every((p) => t.includes(p));
    });
    return porPalabras.length === 1 ? porPalabras[0].id : null;
  }

  cuerpo = cuerpo.replace(
    /<div class="toc-i">\s*<span class="toc-n">([\s\S]*?)<\/span>\s*<span class="toc-t">([\s\S]*?)<\/span>\s*<\/div>/g,
    (todo, num, títuloÍndice) => {
      const id = buscarAncla(títuloÍndice);
      if (!id) {
        sinEnlazar.push(sinEtiquetas(títuloÍndice));
        return todo;
      }
      return (
        `<a class="toc-i" href="#${id}">` +
        `<span class="toc-n">${num}</span>` +
        `<span class="toc-t">${títuloÍndice}</span>` +
        `</a>`
      );
    },
  );

  /* 4 · Las tablas anchas se desplazan dentro de sí mismas. Sin esto, un
        registro de noventa y seis fuentes empuja el ancho de la página y el
        documento entero se desplaza de lado en un teléfono. */
  cuerpo = cuerpo.replace(
    /<table\b[\s\S]*?<\/table>/g,
    (t) => `<div class="tabla-ancha">${t}</div>`,
  );

  /* 5 · Raíl con el índice, agrupado igual que el impreso. */
  const enCuerpo = secciones.filter((s) => !s.anexo);
  const enAnexos = secciones.filter((s) => s.anexo);
  const enlaces = (lista, clase) =>
    lista
      .map(
        (s) =>
          `<a href="#${s.id}"${clase ? ` class="${clase}"` : ''}>${escapar(s.texto)}</a>`,
      )
      .join('');

  const raíl =
    `<aside class="lector-raíl">` +
    `<p class="raíl-marca">${escapar(doc.marca)}</p>` +
    `<p class="raíl-título">${escapar(doc.título)}</p>` +
    `<p class="raíl-sub">${escapar(doc.sub)}</p>` +
    `<nav aria-label="Índice del documento">` +
    enlaces(enCuerpo, '') +
    (enAnexos.length
      ? `<p class="raíl-grupo">Anexos</p>` + enlaces(enAnexos, 'anexo')
      : '') +
    `</nav>` +
    `<p class="raíl-pie">${doc.pie}</p>` +
    `</aside>`;

  const barra = `<div id="lector-prog" aria-hidden="true"></div>`;
  const botón =
    `<button class="lector-tema" id="lector-tema" type="button" aria-label="Cambiar entre modo claro y oscuro">` +
    `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">` +
    `<circle cx="12" cy="12" r="4.2"/>` +
    `<path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5"/>` +
    `</svg></button>`;

  cuerpo =
    `\n${barra}\n${botón}\n<div class="lector">\n${raíl}\n<main class="lector-cuerpo">\n` +
    cuerpo +
    `\n</main>\n</div>\n`;

  /* 6 · El modo y el tema se fijan antes del primer pintado. Puesto después,
        el documento parpadea en claro antes de pasar a oscuro, y embebido
        parpadea con raíl antes de quitarlo. */
  const antesDePintar =
    `<script>(function(){var r=document.documentElement;` +
    `try{var p=new URLSearchParams(location.search);` +
    `if(p.get('modo')==='embebido'){r.setAttribute('data-modo','embebido');}` +
    `var t=p.get('tema');` +
    `if(t==='oscuro'||t==='dark'){r.setAttribute('data-theme','dark');}` +
    `else if(t==='claro'||t==='light'){r.setAttribute('data-theme','light');}` +
    `else if(!r.getAttribute('data-modo')){var g=localStorage.getItem('informe-lector-tema');if(g){r.setAttribute('data-theme',g);}}` +
    `}catch(e){}})();</script>`;

  const estilo = `\n<style data-capa="lector">\n${ESTILOS}\n</style>\n`;
  const guion = `\n<script data-capa="lector">\n${COMPORTAMIENTO}\n</script>\n`;

  const salida =
    cabeza.replace('</head>', `${estilo}${antesDePintar}\n</head>`) +
    cuerpo +
    guion +
    cola;

  const rutaDestino = path.join(raíz, doc.destino);
  fs.mkdirSync(path.dirname(rutaDestino), { recursive: true });
  fs.writeFileSync(rutaDestino, salida);

  return {
    destino: doc.destino,
    secciones: secciones.length,
    anexos: enAnexos.length,
    índiceEnlazado: (salida.match(/<a class="toc-i"/g) || []).length,
    sinEnlazar,
    tablas: (salida.match(/class="tabla-ancha"/g) || []).length,
    kb: Math.round(salida.length / 1024),
  };
}

/* ── Ejecución ──────────────────────────────────────────────────────────── */

let fallos = 0;
for (const doc of DOCUMENTOS) {
  try {
    const r = construir(doc);
    console.log(
      `✓ ${r.destino}\n  ${r.secciones} secciones (${r.anexos} anexos) · ` +
        `${r.índiceEnlazado} entradas de índice enlazadas · ${r.tablas} tablas · ${r.kb} KB`,
    );
    /* Una entrada de índice sin destino no rompe nada y por eso hay que
       decirlo en voz alta: es un enlace que simplemente no existe. */
    if (r.sinEnlazar.length) {
      console.warn(
        `  ⚠ ${r.sinEnlazar.length} entrada(s) del índice sin sección que las reciba:\n` +
          r.sinEnlazar.map((t) => `    · ${t}`).join('\n'),
      );
    }
  } catch (e) {
    fallos += 1;
    console.error(`✗ ${doc.destino}\n  ${e.message}`);
  }
}
process.exit(fallos > 0 ? 1 : 0);
