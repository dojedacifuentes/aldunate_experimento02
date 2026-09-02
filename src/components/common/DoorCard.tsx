import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { NavEntry } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Una de las cuatro entradas del sitio.
 *
 * La tarjeta muestra código, nombre y una sola línea de qué hay detrás. Ese
 * límite es intencional: el objetivo es que se pueda elegir sin haber leído
 * todo primero. Divulgación progresiva empieza aquí.
 */
export function DoorCard({ entry, className }: { entry: NavEntry; className?: string }) {
  return (
    <Link
      href={entry.href}
      // `data-spatial` trae su propia respuesta a la pulsación, así que aquí no
      // va `data-press`: las dos reglas se pisarían en el mismo gesto.
      data-spatial
      className={cn(
        'surface group relative flex flex-col justify-between p-6 sm:p-7',
        className,
      )}
    >
      {/* Barra de acento: aparece al pasar, no está siempre encendida. */}
      <span
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <span className="mono text-[0.6875rem] tracking-widest text-primary">{entry.code}</span>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-xl text-foreground sm:text-2xl">{entry.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.hint}</p>
      </div>
    </Link>
  );
}
