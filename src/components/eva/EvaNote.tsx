import { eva } from '@/data/eva';
import { EvaPortrait } from './EvaPortrait';
import type { EvaPortraitKey } from '@/types';
import { cn } from '@/lib/utils';

/**
 * EVA en línea, dentro del contenido.
 *
 * Complemento del panel flotante: sirve para dejar una observación pegada al
 * material que la motiva —una advertencia sobre un informe, una nota sobre
 * contenido de demostración— en lugar de esconderla en un panel que hay que
 * abrir. No es interactiva: es una anotación al margen.
 */
export function EvaNote({
  portrait = 'neutral',
  children,
  className,
}: {
  portrait?: EvaPortraitKey;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'flex items-start gap-4 rounded-lg border border-border/70 bg-muted/40 p-4 sm:p-5',
        className,
      )}
    >
      <EvaPortrait portrait={portrait} size="sm" className="mt-0.5" />
      <div className="min-w-0 space-y-1.5">
        <p className="mono text-[0.625rem] uppercase tracking-widest text-primary">
          {eva.name} <span className="text-muted-foreground">· {eva.role}</span>
        </p>
        <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
      </div>
    </aside>
  );
}
