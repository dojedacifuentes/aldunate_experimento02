import Link from 'next/link';
import { Container } from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { primaryNav } from '@/data/site';

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="mono text-[0.6875rem] tracking-[0.2em] text-primary">ERROR 404</p>
      <h1 className="mt-5 max-w-2xl text-3xl leading-tight sm:text-4xl">
        Esta ruta no existe
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Puede que la sección todavía no esté construida, o que el enlace haya
        cambiado. Las cuatro entradas del laboratorio siguen donde estaban.
      </p>

      <ul className="mt-10 grid max-w-2xl gap-2 sm:grid-cols-2">
        {primaryNav.map((entry) => (
          <li key={entry.href}>
            <Link
              href={entry.href}
              className="flex items-baseline gap-3 rounded-md border border-border bg-card/40 px-4 py-3 transition-colors hover:border-primary/50"
            >
              <span className="mono text-[0.6875rem] text-primary">{entry.code}</span>
              <span className="text-sm text-foreground/85">{entry.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <EvaNote portrait="neutral" className="mt-12 max-w-2xl">
        <p>
          Un enlace roto es una tecnología obsoleta en estado puro. Procedo a
          representar legalmente a la víctima, que en este caso es usted.
        </p>
      </EvaNote>
    </Container>
  );
}
