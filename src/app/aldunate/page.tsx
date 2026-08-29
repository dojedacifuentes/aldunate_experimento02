import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

import {
  Badge,
  Container,
  Notice,
  PageHeader,
  PendingBlock,
  Section,
  Surface,
} from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { InstitutionalMark } from '@/components/layout/InstitutionalMark';
import { pendingContent, profile, researchLines } from '@/data/aldunate';

export const metadata: Metadata = {
  title: 'Aldunate',
  description:
    'Perfil intelectual, líneas de investigación, publicaciones y cursos. Contenido académico en incorporación progresiva desde fuentes verificadas.',
};

/**
 * Landing académica.
 *
 * La página se organiza alrededor de lo que existe (los ejes temáticos) y
 * declara con nombre y apellido lo que no (ficha biográfica, catálogo, cursos).
 * Un perfil académico a medio llenar es honesto; uno completado por inferencia
 * es una fuente falsa que alguien terminará citando.
 */
export default function AldunatePage() {
  return (
    <>
      <PageHeader
        code="01 · Perfil"
        title={profile.name}
        lede={profile.intro}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="signal">{profile.field}</Badge>
          <Badge tone="muted">Contenido en incorporación</Badge>
        </div>
      </PageHeader>

      {/* ── Advertencia de alcance ── */}
      <Section>
        <Notice tone="warning" className="max-w-3xl">
          {profile.note} Hasta entonces, esta sección muestra el mapa de temas
          del laboratorio, no una biografía.
        </Notice>
      </Section>

      {/* ── Mapa intelectual ── */}
      <Section
        eyebrow="Mapa intelectual"
        title="Líneas de trabajo"
        description="Seis territorios y sus conexiones. Cada uno describe un ámbito que el laboratorio recorre; ninguno constituye una atribución de obra ni de posición doctrinaria."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {researchLines.map((line, index) => (
            <li key={line.id}>
              <Surface interactive className="h-full p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="mono text-[0.6875rem] tracking-widest text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {line.status === 'en-formacion' ? (
                    <Badge tone="muted">En formación</Badge>
                  ) : (
                    <Badge tone="signal" dot>
                      Activa
                    </Badge>
                  )}
                </div>

                <h3 className="mt-5 font-serif text-xl text-foreground">{line.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {line.summary}
                </p>

                {line.related.length > 0 && (
                  <div className="mt-5 border-t border-border/60 pt-3">
                    <p className="meta mb-1.5">Conecta con</p>
                    <p className="mono text-[0.75rem] text-foreground/70">
                      {line.related
                        .map((id) => researchLines.find((l) => l.id === id)?.title ?? id)
                        .join(' · ')}
                    </p>
                  </div>
                )}
              </Surface>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Accesos a catálogos ── */}
      <Section
        eyebrow="Catálogos"
        title="Publicaciones y docencia"
        description="Dos catálogos abiertos, ambos vacíos por ahora. Se llenan con respaldo documental o no se llenan."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CatalogLink
            href="/aldunate/papers"
            icon={<BookOpen className="h-5 w-5" aria-hidden />}
            title="Publicaciones"
            detail="Libros, capítulos, artículos y ponencias. Cada entrada exige título exacto, año, sede y referencia de respaldo."
            count={0}
          />
          <CatalogLink
            href="/aldunate/cursos"
            icon={<GraduationCap className="h-5 w-5" aria-hidden />}
            title="Cursos"
            detail="Asignaturas, programas y materiales docentes confirmados, con institución y período."
            count={0}
          />
        </div>
      </Section>

      {/* ── Huecos declarados ── */}
      <Section
        eyebrow="Estado del contenido"
        title="Lo que falta, dicho en voz alta"
        description="Inventario de material identificado como necesario y todavía no incorporado. Es la lista de trabajo del proyecto, publicada en vez de escondida."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {pendingContent.map((item) => (
            <PendingBlock key={item.id} label={item.label} detail={item.detail} />
          ))}
        </div>
      </Section>

      {/* ── Cierre ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <EvaNote portrait="courtyard">
              <p>
                Podría haber llenado esta página con tres libros plausibles, dos
                cursos de nombre convincente y una cita bien construida. Nadie lo
                habría notado hasta que alguien intentara verificarla. Ese día
                llega siempre, y llega en una nota al pie ajena.
              </p>
            </EvaNote>

            <Surface className="p-6">
              <p className="meta mb-4">Contexto institucional</p>
              <InstitutionalMark size={52} withCaption />
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Prototipo académico experimental. No representa a la PUCV ni a su
                Escuela de Derecho.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}

function CatalogLink({
  href,
  icon,
  title,
  detail,
  count,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  count: number;
}) {
  return (
    <Link href={href} className="group">
      <Surface interactive className="h-full p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-primary">{icon}</span>
          <span className="mono text-[0.6875rem] text-muted-foreground">
            {count} {count === 1 ? 'entrada' : 'entradas'}
          </span>
        </div>
        <h3 className="mt-5 flex items-center gap-2 font-serif text-xl text-foreground group-hover:text-primary">
          {title}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      </Surface>
    </Link>
  );
}
