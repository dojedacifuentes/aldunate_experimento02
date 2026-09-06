import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { reports } from '@/data/reports';
import {
  compareVersions,
  currentVersion,
  hasOnlineReading,
  historicVersions,
  readingMode,
  sortedVersions,
  versionArtifacts,
  versionHref,
} from '@/lib/informes';
/* La lista sale del propio constructor: si alguien añade un documento allí y
   olvida generar su capa, es esta prueba la que lo dice. */
import { DOCUMENTOS } from '../../scripts/informes/lector/documentos.mjs';

/**
 * Las reglas del informe vivo, comprobadas.
 *
 * Cada una existe porque el error correspondiente ya ocurrió o estuvo a punto:
 * versiones ordenadas por fecha con dos del mismo día, botones que prometían
 * archivos inexistentes, y una ficha que anunciaba una versión y mostraba las
 * cifras de otra.
 */

const publico = path.join(process.cwd(), 'public');

describe('compareVersions', () => {
  it('ordena por número y no alfabéticamente', () => {
    // '2.0.0' < '0.8.0' como texto; como versión, es mayor.
    expect(compareVersions('2.0.0', '0.8.0')).toBeLessThan(0);
    expect(compareVersions('0.10.0', '0.9.0')).toBeLessThan(0);
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
  });
});

describe('orden de versiones', () => {
  it('la vigente es la de número mayor, no la última por fecha', () => {
    const informe01 = reports.find((r) => r.slug === 'ia-escuelas-derecho-chile');
    expect(informe01).toBeDefined();
    // La v0.7.0 y la v0.8.0 comparten fecha: sin comparación numérica el
    // resultado dependía del orden de escritura del arreglo.
    expect(currentVersion(informe01!)?.version).toBe('2.0.0');
  });

  it('cada informe tiene exactamente una versión vigente y el resto históricas', () => {
    for (const report of reports) {
      const actual = currentVersion(report);
      expect(actual).toBeDefined();
      expect(historicVersions(report)).toHaveLength(report.versions.length - 1);
      expect(historicVersions(report)).not.toContain(actual);
    }
  });

  it('no hay números de versión repetidos dentro de un informe', () => {
    for (const report of reports) {
      const numeros = report.versions.map((v) => v.version);
      expect(new Set(numeros).size).toBe(numeros.length);
    }
  });

  it('sortedVersions devuelve de mayor a menor sin mutar el original', () => {
    for (const report of reports) {
      const antes = report.versions.map((v) => v.version);
      const orden = sortedVersions(report.versions).map((v) => v.version);
      expect(report.versions.map((v) => v.version)).toEqual(antes);
      for (let i = 1; i < orden.length; i += 1) {
        expect(compareVersions(orden[i - 1], orden[i])).toBeLessThan(0);
      }
    }
  });
});

describe('archivos publicados', () => {
  /*
    La regla dura del §8 de CLAUDE.md: un botón que promete un archivo
    inexistente es peor que no tener botón. Aquí se comprueba de verdad, contra
    el disco, y no confiando en que quien añadió la versión copió los archivos.
  */
  const rutas: string[] = [];
  for (const report of reports) {
    for (const version of report.versions) {
      if (version.pdf) rutas.push(version.pdf);
      if (version.html) rutas.push(version.html);
      for (const a of version.artifacts ?? []) rutas.push(a.href);
      for (const c of version.companions ?? []) {
        if (c.html) rutas.push(c.html);
        for (const a of c.artifacts) rutas.push(a.href);
      }
    }
    for (const a of report.researchKit?.artifacts ?? []) rutas.push(a.href);
    for (const a of report.downloads ?? []) rutas.push(a.href);
  }

  it.each([...new Set(rutas)])('existe %s', (ruta) => {
    expect(fs.existsSync(path.join(publico, ruta))).toBe(true);
  });
});

describe('lectura en línea', () => {
  it('una versión sólo se declara legible si hay con qué leerla', () => {
    for (const report of reports) {
      for (const version of report.versions) {
        if (readingMode(version) === 'documento') expect(version.html).toBeTruthy();
        // `nativo` no exige `html`: lo pinta el sitio desde `src/data`.
        if (!version.html && version.reading !== 'nativo') {
          expect(hasOnlineReading(version)).toBe(false);
        }
      }
    }
  });

  it('la ruta del lector es única por versión', () => {
    for (const report of reports) {
      const rutas = report.versions.map((v) => versionHref(report.slug, v.version));
      expect(new Set(rutas).size).toBe(rutas.length);
    }
  });
});

describe('artefactos', () => {
  it('las versiones antiguas sin lista derivan sus descargas de pdf y html', () => {
    const informe02 = reports.find((r) => r.slug === 'transformacion-ensenanza-derecho');
    const alguna = informe02?.versions.find((v) => v.pdf && !v.artifacts);
    if (alguna) {
      const formatos = versionArtifacts(alguna).map((a) => a.format);
      expect(formatos).toContain('PDF');
    }
  });

  it('ningún artefacto se repite dentro de una versión', () => {
    for (const report of reports) {
      for (const version of report.versions) {
        const hrefs = (version.artifacts ?? []).map((a) => a.href);
        expect(new Set(hrefs).size).toBe(hrefs.length);
      }
    }
  });
});

describe('complementos', () => {
  it('cada complemento declara por qué existe por separado', () => {
    for (const report of reports) {
      for (const version of report.versions) {
        for (const companion of version.companions ?? []) {
          // Sin el motivo, un complemento es un anexo suelto: la razón por la
          // que la PUCV sale del comparador es justamente el contenido.
          expect(companion.rationale.length).toBeGreaterThan(80);
          expect(companion.artifacts.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('capa de lectura de los documentos publicados', () => {
  /*
    Los informes llegan maquetados para papel y el sitio les añade la capa de
    lectura con `scripts/informes/lector/construir.mjs`. Publicar una versión
    sin ejecutarlo no rompe el build: simplemente se sirve una columna de
    210 mm a 10 pt, sin modo oscuro y sin índice, que es exactamente el defecto
    que la capa vino a corregir. Aquí se convierte en un fallo.

    La lista sale del propio constructor. Las versiones históricas no están en
    ella y no deben estarlo: una versión publicada no se reconstruye.
  */
  const destinos = DOCUMENTOS.map((d: { destino: string }) => d.destino);

  it.each(destinos)('%s lleva la capa de lector', (destino) => {
    const texto = fs.readFileSync(path.join(process.cwd(), destino), 'utf8');
    expect(texto).toContain('data-capa="lector"');
    expect(texto).toContain('id="lector-prog"');
    expect(texto).toContain('class="lector-cuerpo"');
  });

  it.each(destinos)('%s ancla sus secciones', (destino) => {
    const texto = fs.readFileSync(path.join(process.cwd(), destino), 'utf8');
    const anclas = texto.match(/<h2[^>]*\sid="[^"]+"/g) ?? [];
    // Sin anclas no hay índice navegable, que es la mitad del trabajo.
    expect(anclas.length).toBeGreaterThan(4);
  });

  it.each(DOCUMENTOS.map((d: { fuente: string }) => d.fuente))(
    '%s se conserva intocado como fuente',
    (fuente) => {
      /* El constructor lee el documento tal como llegó. Si la fuente se pierde
         o se contamina con la capa, deja de ser reproducible. */
      const ruta = path.join(process.cwd(), fuente);
      expect(fs.existsSync(ruta)).toBe(true);
      expect(fs.readFileSync(ruta, 'utf8')).not.toContain('data-capa="lector"');
    },
  );

  it('lo publicado y su fuente dicen el mismo texto', () => {
    /*
      La condición que hace legítima toda la operación: la capa cambia el
      tamaño, el ritmo y el color, y no el contenido. Se compara el texto
      desnudo de los dos, sin etiquetas ni espacios.
    */
    const desnudo = (s: string) =>
      s
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    /* Se compara cuerpo contra cuerpo: el publicado antepone los rótulos del
       raíl, que son navegación y no documento. */
    const cuerpoDe = (html: string, desde: string) =>
      desnudo(html.slice(html.indexOf(desde)));

    for (const doc of DOCUMENTOS as { fuente: string; destino: string }[]) {
      const antes = cuerpoDe(
        fs.readFileSync(path.join(process.cwd(), doc.fuente), 'utf8'),
        '<body',
      );
      const despues = cuerpoDe(
        fs.readFileSync(path.join(process.cwd(), doc.destino), 'utf8'),
        '<main class="lector-cuerpo">',
      );
      // Palabra por palabra, el mismo documento.
      expect(despues).toBe(antes);
    }
  });
});

describe('nada publicado se queda sin ofrecer', () => {
  /*
    El reverso de la regla del §8. «El botón sólo aparece si el archivo existe»
    evita prometer lo que no hay; esta prueba evita lo contrario, que también
    pasó: siete documentos servidos en `public/descargas/` a los que no se
    podía llegar salvo adivinando la dirección, entre ellos el Word y el
    resumen ejecutivo del Informe 02 vigente.

    Sólo se exigen los documentos: los CSV, manifiestos y checksums que van
    dentro de un paquete se obtienen por su `.zip` y no necesitan botón propio.
  */
  const declarados = new Set<string>();
  for (const report of reports) {
    for (const version of report.versions) {
      if (version.pdf) declarados.add(version.pdf);
      if (version.html) declarados.add(version.html);
      for (const a of version.artifacts ?? []) declarados.add(a.href);
      for (const c of version.companions ?? []) {
        if (c.html) declarados.add(c.html);
        for (const a of c.artifacts) declarados.add(a.href);
      }
    }
    for (const a of report.researchKit?.artifacts ?? []) declarados.add(a.href);
    for (const a of report.downloads ?? []) declarados.add(a.href);
  }

  const descargas = path.join(publico, 'descargas');
  const enDisco: string[] = [];
  const recorrer = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) recorrer(p);
      else enDisco.push('/' + path.relative(publico, p).split(path.sep).join('/'));
    }
  };
  recorrer(descargas);

  /* Un documento es lo que alguien leería: PDF, Word, HTML o Markdown suelto,
     fuera de la carpeta `dataset/` de un paquete. */
  const esDocumento = (f: string) =>
    /\.(pdf|docx|html|md)$/i.test(f) && !/\/dataset\//i.test(f);

  const sinOfrecer = enDisco.filter((f) => esDocumento(f) && !declarados.has(f));

  it('ningún documento servido queda sin botón', () => {
    expect(sinOfrecer).toEqual([]);
  });
});
