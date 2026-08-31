import { ArrowUpRight } from 'lucide-react';

import { Badge, ButtonLink, Surface } from '@/components/common/ui';
import type { Experiment, ExperimentStatus, Tone } from '@/types';

const statusMeta: Record<ExperimentStatus, { label: string; tone: Tone }> = {
  idea: { label: 'Idea', tone: 'muted' },
  prototipo: { label: 'Prototipo', tone: 'signal' },
  jugable: { label: 'Jugable', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'muted' },
};

/**
 * Ficha de experimento.
 *
 * `demoContent` produce una etiqueta visible, no una nota al pie. Un ejemplo
 * sin rótulo se convierte en dato al segundo día, y en cita al tercero.
 */
export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const meta = statusMeta[experiment.status];

  return (
    <Surface interactive className="flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge tone={meta.tone} dot={experiment.status !== 'idea'}>
          {meta.label}
        </Badge>
        {experiment.demoContent && <Badge tone="warning">Contenido de demostración</Badge>}
      </div>

      <h3 className="mt-4 font-serif text-xl leading-snug text-foreground">
        {experiment.title}
      </h3>
      <p className="mt-1 font-serif text-sm italic text-primary">{experiment.tagline}</p>

      <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
        {experiment.description}
      </p>

      {experiment.jugableEn && (
        <ButtonLink href={experiment.jugableEn} size="sm" variant="outline" className="mt-5 self-start">
          Jugar
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </ButtonLink>
      )}
    </Surface>
  );
}

export { statusMeta as experimentStatusMeta };
