import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge, ButtonLink, Container, Surface } from '@/components/common/ui';
import { EditorialStatus } from '@/components/common/status';
import { DoorCard } from '@/components/common/DoorCard';
import { WorkBoard } from '@/components/work/WorkBoard';
import { JuegoEnPortada } from '@/components/rpg/game/JuegoEnPortada';
import { EvaNote } from '@/components/eva/EvaNote';
import { primaryNav, secondaryNav, site } from '@/data/site';
import { profile, researchLines } from '@/data/aldunate';
import { informeDestacado, reports } from '@/data/reports';
import { labTools } from '@/data/lab';
import { formatDateCompact, latestVersion } from '@/lib/utils';

/**
 * Portal.
 *
 * Ni dashboard ni página personal: un vestíbulo. El laboratorio, tres puertas
 * primarias, dos capas de apoyo, el mapa de temas y el estado real del trabajo.
 * Nada de métricas inventadas y ningún número que no se pueda contar aquí
 * mismo.
 *
 * El nombre del profesor no encabeza. Es objeto de estudio del laboratorio, no
 * su firma, y el sitio no está autorizado por él.
 */
export default function HomePage() {
  const activeLines = researchLines.filter((l) => l.status === 'activa');
  /**
   * El más **terminado**, no el más reciente, y la diferencia no es teórica:
   * con el criterio anterior la acción principal del sitio apuntaba al Informe
   * 01 —que declara no emitir conclusiones— porque otra sesión le había tocado
   * la fecha al publicar un kit metodológico. El criterio vive en
   * `reports.ts`, que es donde se decide qué significan los estados.
   */
  const featured = informeDestacado;

  return (
    <>
      {/* ── Vestíbulo ── */}
      <section data-hero className="relative overflow-hidden">
        <Container data-hero-layer className="py-20 sm:py-28 lg:py-32">
          {/*
            PRODUCTO → CAMPO → PROPUESTA → ACCIÓN. En ese orden y sin cuarta
            capa: la portada orienta y abre rutas, no es el índice del sitio.
          */}
          <p className="mono mb-6 text-[0.6875rem] uppercase tracking-[0.2em] text-primary">
            {site.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            Experimento 02
          </h1>

          <p className="mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
            {site.field}
          </p>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/80">
            {site.proposition}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {/*
              «El último» era literalmente falso desde que el destino dejó de
              elegirse por fecha. Y era además la promesa equivocada: quien
              pulsa el botón principal de un sitio que se ofrece para ser
              citado quiere algo que pueda leer hoy, no lo más recién tocado.
            */}
            <ButtonLink href={`/informes/${featured.slug}`} variant="primary">
              Leer el informe
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/investigacion" variant="outline">
              Recorrer la evidencia
            </ButtonLink>
          </div>

          {/* Estado del laboratorio: solo lo que se puede contar en este repositorio. */}
          <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border/70 pt-8 sm:grid-cols-4">
            <Stat label="Líneas activas" value={String(activeLines.length)} count={activeLines.length} />
            <Stat label="Informes abiertos" value={String(reports.length)} count={reports.length} />
            <Stat label="Fichas en el Lab" value={String(labTools.length)} count={labTools.length} />
            <Stat label="Versión" value={`v${site.version}`} />
          </dl>
        </Container>
      </section>

      {/*
        ── Estado del arte ──
        Va antes de las puertas a propósito. La jerarquía de la portada era
        PRODUCTO → CAMPO → PROPUESTA → ACCIÓN; esto inserta un ESTADO entre la
        propuesta y la acción, porque quien llega a un laboratorio quiere saber
        qué hay en marcha antes de elegir puerta. Es la única sección que
        envejece sola si nadie la mantiene: ver CLAUDE.md §12.
      */}
      <WorkBoard />

      {/*
        ── El juego, jugable aquí mismo ──

        Sin un clic de por medio: la cabina se monta sola al entrar su sección
        en pantalla. Phaser son 1,17 MB y baja en ese momento, no al abrir el
        sitio, de modo que quien viene a leer un informe y no llega hasta aquí
        no descarga un byte. Es la excepción declarada a §10, que prohibía que
        el motor entrara en cualquier otra ruta.
      */}
      <section
        aria-labelledby="juego-portada"
        className="border-t border-border/70 pt-14 sm:pt-16"
      >
        <Container className="mb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="meta mb-3 text-primary">Experimento jugable</p>
              <h2 id="juego-portada" className="text-2xl sm:text-3xl">
                La Ley de los Audaces · Capítulo 0
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                RPG jurídico. El Capítulo 0 está completo y se juega en tres a
                cinco minutos, aquí mismo. La ficha con el guion, el reparto y
                las fuentes normativas —con su estado de verificación— está
                detrás del juego.
              </p>
            </div>
            <ButtonLink
              href="/experimentos/juegos/ley-de-los-audaces"
              variant="outline"
              size="sm"
            >
              Ver la ficha auditable
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </ButtonLink>
          </div>
        </Container>

        {/*
          Fuera del `Container`: la cabina se mide contra el viewport y con
          márgenes laterales dejaría de caber, que es el fallo de D-027.
        */}
        <JuegoEnPortada />
      </section>

      {/* ── Las puertas: tres primarias, dos de apoyo ── */}
      <section data-reveal className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="mb-10 max-w-xl">
            <p className="meta mb-3 text-primary">Entradas</p>
            <h2 className="text-2xl sm:text-3xl">Elija por dónde empezar</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Tres rutas con material que se puede leer, tocar o usar. Debajo,
              las dos capas que las sostienen.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {primaryNav.map((entry) => (
              <DoorCard key={entry.href} entry={entry} />
            ))}
          </div>

          {/*
            Las secundarias con menos peso, no en el mismo grid: cinco tarjetas
            idénticas hacían que sostener la evidencia pareciera tan primario
            como leer un informe, y que una sección deliberadamente vacía
            pareciera una puerta más.
          */}
          <div className="mt-8 border-t border-border/60 pt-8">
            <p className="meta mb-4">Capas de apoyo</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {secondaryNav.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href} className="group flex items-start gap-3 py-1">
                    <span className="mono mt-0.5 shrink-0 text-[0.6875rem] text-primary">
                      {entry.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                        {entry.label}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted-foreground">
                        {entry.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Mapa intelectual ── */}
      <section data-reveal className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="meta mb-3 text-primary">Mapa intelectual</p>
              <h2 className="text-2xl sm:text-3xl">Territorios que recorre</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {profile.intro}
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Los ejes describen el alcance del laboratorio, no una atribución
                de obra ni una posición doctrinaria.
              </p>
              <Link
                href="/aldunate"
                className="mt-5 inline-flex min-h-6 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Ver la capa académica
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <ul className="space-y-3">
              {/*
                Sin `interactive`: estos territorios no llevan a ninguna parte
                todavía. Un borde que se ilumina al pasar el cursor promete una
                acción, y aquí no la hay. La taxonomía navegable llega en la
                fase 4; hasta entonces, esto se lee como lo que es.
              */}
              {researchLines.map((line) => (
                <li key={line.id}>
                  <Surface className="p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-serif text-lg text-foreground">{line.title}</h3>
                      {line.status === 'en-formacion' && (
                        <Badge tone="muted">En formación</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {line.summary}
                    </p>
                    {line.related.length > 0 && (
                      <p className="mono mt-3 text-[0.6875rem] text-muted-foreground">
                        ↳ {line.related.join(' · ')}
                      </p>
                    )}
                  </Surface>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Informes en curso ── */}
      <section data-reveal className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="meta mb-3 text-primary">Documentos vivos</p>
            <h2 className="text-2xl sm:text-3xl">Informes en curso</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Se versionan hacia adelante. Ninguna versión publicada se
              sobrescribe en silencio.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((report) => {
              const latest = latestVersion(report.versions);
              return (
                <Link key={report.slug} href={`/informes/${report.slug}`} className="group">
                  <Surface interactive className="h-full p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="mono text-[0.6875rem] tracking-widest text-primary">
                        {report.code}
                      </span>
                      <EditorialStatus status={report.status} />
                    </div>
                    <h3 className="mt-4 font-serif text-xl leading-snug text-foreground group-hover:text-primary">
                      {report.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {report.executiveSummary}
                    </p>
                    <p className="mono mt-5 text-[0.6875rem] text-muted-foreground">
                      {latest ? `v${latest.version} · ` : ''}actualizado{' '}
                      {formatDateCompact(report.updatedAt)}
                    </p>
                  </Surface>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Nota de EVA + marca institucional ── */}
      <section data-reveal className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <EvaNote portrait="smile">
              <p>
                Este laboratorio se construye a la vista. Lo que todavía no
                existe aparece rotulado como pendiente, no rellenado con material
                verosímil. Es más lento y considerablemente menos impresionante,
                pero sobrevive a la primera persona que decida verificar una cita.
              </p>
            </EvaNote>

            <Surface className="p-6">
              <p className="meta mb-4">Qué es este sitio</p>
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-warning">
                Prototipo académico experimental
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                No es un sitio oficial de la PUCV ni de su Escuela de Derecho, y
                no habla en nombre del profesor Eduardo Aldunate Lizana.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Cifra del estado del laboratorio.
 *
 * `count` hace que el número suba al entrar en pantalla, con el mismo motor y
 * la misma curva que las cifras de `/aldunate`: es un gesto de bienvenida, no
 * un indicador en vivo. Sólo lo llevan las cifras que **son** números; la
 * versión (`v0.3.0`) se sirve tal cual, porque un contador que recorre una
 * versión inventa versiones que no existen.
 *
 * El valor va escrito en el HTML de todos modos. Si el observador no llegara a
 * disparar —pestaña en segundo plano, JavaScript caído—, lo que se lee es la
 * cifra correcta y no un cero.
 */
function Stat({ label, value, count }: { label: string; value: string; count?: number }) {
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="mono mt-1.5 text-2xl text-foreground">
        {count !== undefined ? <span data-count={count}>{value}</span> : value}
      </dd>
    </div>
  );
}
