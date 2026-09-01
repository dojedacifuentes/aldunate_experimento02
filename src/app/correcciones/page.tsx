import type { Metadata } from 'next';
import Link from 'next/link';

import { Disclosure, Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { reports, reportStatusNotice } from '@/data/reports';
import { autor, site } from '@/data/site';
import { claims, sources } from '@/data/research';

export const metadata: Metadata = {
  title: 'Política de correcciones',
  description:
    'Cómo se reporta un error, qué distingue una corrección menor de una sustantiva, cuándo cambia el número de versión y cómo se marcan las fuentes retractadas.',
};

/**
 * Política de correcciones y retractaciones.
 *
 * Un proyecto que publica su método tiene que publicar también qué hace cuando
 * se equivoca. Sin esto, «informe vivo» significa sólo que el archivo cambia:
 * con esto significa que cambia bajo reglas que alguien de fuera puede exigir.
 *
 * La página se escribe en segunda persona hacia quien encuentra el error,
 * porque es a quien está dirigida.
 */
export default function CorreccionesPage() {
  const informe02 = reports.find((r) => r.slug === 'transformacion-ensenanza-derecho');
  const retractadas = sources.filter((s) => s.robustness === 'retracted');
  const corregidas = sources.filter((s) => s.correction);

  return (
    <>
      <PageHeader
        code="06 · Correcciones"
        title="Qué pasa cuando esto se equivoca"
        lede="Un proyecto que publica su método tiene que publicar también qué hace cuando falla. Aquí está el procedimiento completo: cómo se reporta un error, qué lo convierte en versión nueva y qué ocurre con lo que ya estaba publicado."
      />

      <Section>
        <Notice tone="signal" className="max-w-3xl">
          <p className="font-medium text-foreground">El compromiso, en una línea</p>
          <p className="mt-2 text-muted-foreground">
            Ninguna versión publicada se sobrescribe ni se retira. Las
            correcciones se publican como versión nueva, con el cambio anotado
            afirmación por afirmación, y la versión anterior sigue descargable
            para que cualquiera pueda comprobar qué decía cuando la citó.
          </p>
        </Notice>
      </Section>

      {/* ── Reportar ── */}
      <Section
        eyebrow="Primer paso"
        title="Cómo se reporta un error"
        description="No hace falta que esté demostrado. Basta con que sea comprobable."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Surface className="p-6">
            <p className="meta mb-3">Qué incluir</p>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>· Dónde está: informe y versión, o la URL de la página.</li>
              <li>
                · Qué dice y qué debería decir. Si es una cifra, la fuente donde
                consta la correcta.
              </li>
              <li>
                · Si afecta a una afirmación de la matriz, su identificador
                —<code className="mono text-[0.75rem]">clm-…</code>— o el de la
                fuente —<code className="mono text-[0.75rem]">src-…</code>—.
              </li>
            </ul>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Se responde con lo que se encuentre, aunque sea que el error no lo
              era. Un reporte desestimado también se explica.
            </p>
          </Surface>

          <Surface className="p-6">
            <p className="meta mb-3">A quién</p>
            <p className="text-sm leading-relaxed text-foreground/85">{autor.name}</p>
            <p className="mt-1 text-[0.8125rem] text-muted-foreground">
              {autor.credential} · {autor.role}
            </p>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Mientras el proyecto sea un prototipo sin canal formal de contacto,
              el camino es el repositorio: una incidencia en{' '}
              <a
                href={`${site.repo}/issues`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                GitHub
              </a>{' '}
              queda registrada con fecha y es pública, que es exactamente lo que
              conviene a una corrección.
            </p>
          </Surface>
        </div>
      </Section>

      {/* ── Gravedad ── */}
      <Section
        eyebrow="Clasificación"
        title="Menor, sustantiva, o retractación"
        description="Qué distingue una de otra, y qué consecuencia tiene cada una sobre el número de versión."
      >
        <div className="space-y-3">
          <Grado
            titulo="Corrección menor"
            version="tercer dígito · 0.3.0 → 0.3.1"
            que="Erratas, enlaces rotos, formato, una fecha mal transcrita que no altera ninguna conclusión, una cifra mal copiada que se corrige a la que ya sostenía la fuente."
            hace="Se corrige y se anota en el changelog de la versión. Las afirmaciones no cambian."
          />
          <Grado
            titulo="Corrección sustantiva"
            version="segundo dígito · 0.3.0 → 0.4.0"
            que="Cambia lo que una afirmación sostiene, su alcance o su nivel de evidencia. También cuando se retira una fuente del corpus o se reclasifica su nivel demostrativo."
            hace="Versión nueva, con el cambio registrado afirmación por afirmación —qué decía, qué dice y por qué— y la versión anterior conservada y descargable."
          />
          <Grado
            titulo="Fuente retractada"
            version="depende de qué sostenía"
            que="El editor de una fuente publica una retractación o una corrección que afecta a sus resultados."
            hace="La fuente se marca como retractada o corregida y no se borra: se conserva con el aviso, porque el episodio también es información. Toda afirmación que se apoyaba en ella se revisa, y si deja de sostenerse se reformula o se retira en una versión nueva."
          />
        </div>

        {(retractadas.length > 0 || corregidas.length > 0) && (
          <div className="mt-6">
            <Disclosure
              summary="Qué fuentes del registro están hoy retractadas o corregidas"
              hint={`${retractadas.length + corregidas.length} de ${sources.length}`}
            >
              <ul className="space-y-3">
                {[...retractadas, ...corregidas].map((s) => (
                  <li key={s.id} className="text-[0.8125rem] leading-relaxed">
                    <a
                      href={`/investigacion#${s.id}`}
                      className="mono inline-flex min-h-6 items-center text-[0.6875rem] text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {s.id}
                    </a>
                    <p className="mt-1 text-muted-foreground">
                      {s.robustness === 'retracted'
                        ? 'Retractada por su editor. Se conserva en el registro como advertencia de lectura sobre la literatura que la citó.'
                        : s.correction?.note}
                    </p>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
        )}
      </Section>

      {/* ── Versionado ── */}
      <Section
        eyebrow="Versionado"
        title="Qué significa cada número"
        description="SemVer editorial: el número dice cuánto cambió lo que el documento afirma, no cuántos archivos se tocaron."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['0.x.0', 'Versión de trabajo. Los hallazgos pueden cambiar antes de una versión estable.'],
            ['0.x.y', 'Correcciones menores sin cambio sustantivo de afirmaciones.'],
            ['0.3.0', 'Revisión metodológica sustantiva: taxonomía, trazabilidad o alcance de las afirmaciones.'],
            ['1.0.0', 'Versión estable. A partir de aquí, toda corrección sustantiva exige versión nueva.'],
          ].map(([n, d]) => (
            <Surface key={n} className="p-5">
              <p className="mono text-sm text-primary">{n}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{d}</p>
            </Surface>
          ))}
        </div>

        {informe02 && (
          <Notice tone="warning" className="mt-6 max-w-3xl">
            <p className="font-medium text-foreground">
              Estado actual del Informe 02 · v
              {informe02.versions[informe02.versions.length - 1]?.version}
            </p>
            <p className="mt-2 text-muted-foreground">
              {reportStatusNotice[informe02.status]}
            </p>
          </Notice>
        )}
      </Section>

      {/* ── Qué se conserva ── */}
      <Section
        eyebrow="Permanencia"
        title="Qué sigue estando después de una corrección"
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            [
              'Las versiones anteriores',
              'Siguen descargables con su número y su fecha. Quien citó la v0.2.0 puede abrirla y comprobar qué decía.',
            ],
            [
              'El registro del cambio',
              'Qué decía, qué dice y por qué cambió, en la ficha del informe. No «se actualizaron fuentes».',
            ],
            [
              'Las fuentes retiradas',
              'Una fuente retractada no se borra del registro: se marca. Borrarla haría desaparecer la razón por la que algo cambió.',
            ],
            [
              'Los identificadores',
              `Las ${claims.length} afirmaciones y las ${sources.length} fuentes conservan su identificador y su enlace estable aunque su contenido cambie.`,
            ],
          ].map(([t, d]) => (
            <li key={t}>
              <Surface className="h-full p-5">
                <h3 className="font-sans text-sm font-semibold text-foreground">{t}</h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{d}</p>
              </Surface>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          El procedimiento con el que se aplicó esta política por primera vez está
          documentado en la auditoría de cierre de la v0.3.0, dentro del
          repositorio. Puede leerse como ejemplo de lo que aquí se promete.{' '}
          <Link
            href="/investigacion"
            className="font-medium text-primary underline underline-offset-2 hover:no-underline"
          >
            Ver el registro de evidencia
          </Link>
        </p>
      </Section>
    </>
  );
}

function Grado({
  titulo,
  version,
  que,
  hace,
}: {
  titulo: string;
  version: string;
  que: string;
  hace: string;
}) {
  return (
    <Surface className="p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg text-foreground">{titulo}</h3>
        <span className="mono text-[0.6875rem] text-muted-foreground">{version}</span>
      </div>
      <dl className="mt-4 space-y-3 text-[0.8125rem] leading-relaxed">
        <div>
          <dt className="meta mb-1">Qué es</dt>
          <dd className="text-muted-foreground">{que}</dd>
        </div>
        <div>
          <dt className="meta mb-1">Qué se hace</dt>
          <dd className="text-foreground/85">{hace}</dd>
        </div>
      </dl>
    </Surface>
  );
}
