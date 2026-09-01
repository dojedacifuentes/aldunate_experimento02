import type { Metadata } from 'next';
import { Badge, Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { courses } from '@/data/aldunate';

export const metadata: Metadata = {
  title: 'Cursos',
  description:
    'Cursos y docencia. Solo se incorporan asignaturas confirmadas, con institución y período.',
};

/**
 * Catálogo docente. Misma lógica que publicaciones: la vista lista está lista,
 * el contenido espera confirmación.
 */
export default function CursosPage() {
  const hasCourses = courses.length > 0;

  return (
    <>
      <PageHeader
        code="05 · Cursos"
        title="Cursos y docencia"
        lede="Asignaturas, programas y materiales. Se incorporan cursos confirmados, con institución y período declarados."
      />

      <Section>
        {hasCourses ? (
          <ul className="space-y-3">
            {courses.map((course) => (
              <li key={course.id}>
                <Surface className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {course.year && (
                      <span className="mono text-[0.75rem] text-muted-foreground">
                        {course.year}
                      </span>
                    )}
                    <Badge tone={course.status === 'confirmado' ? 'success' : 'warning'} dot>
                      {course.status === 'confirmado' ? 'Confirmado' : 'Pendiente'}
                    </Badge>
                  </div>
                  <h2 className="mt-3 font-serif text-lg text-foreground">{course.title}</h2>
                  {course.institution && (
                    <p className="mt-1 text-sm text-muted-foreground">{course.institution}</p>
                  )}
                  {course.summary && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {course.summary}
                    </p>
                  )}
                </Surface>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-8">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-14 text-center sm:py-20">
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
                Catálogo vacío
              </p>
              <h2 className="mt-4 font-serif text-2xl text-foreground">
                Todavía no hay cursos cargados
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Un programa mal atribuido sobrevive años en internet y se cita
                como si fuera oficial. Preferimos la lista vacía.
              </p>
            </div>

            <Notice tone="signal" className="max-w-3xl">
              <p className="font-medium text-foreground">Esquema de una entrada</p>
              <p className="mono mt-2 text-[0.8125rem] text-muted-foreground">
                title · institution · year · audience · summary · materials · status · sources
              </p>
              <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                El material se deposita en <code className="mono">content/aldunate/courses/</code>.
              </p>
            </Notice>

            <EvaNote portrait="presenter">
              <p>
                Los cursos entran confirmados o no entran. Es una regla aburrida
                y ha evitado más problemas que cualquier decisión de diseño de
                este sitio.
              </p>
            </EvaNote>
          </div>
        )}
      </Section>
    </>
  );
}
