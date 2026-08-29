import Image from 'next/image';
import { evaPortraits } from '@/data/eva';
import type { EvaPortraitKey } from '@/types';
import { cn } from '@/lib/utils';

const sizes = {
  xs: 32,
  sm: 44,
  md: 64,
  lg: 96,
} as const;

/**
 * Retrato de EVA. Recorte circular y borde tenue: se lee como identificador de
 * un personaje, no como fotografía de una persona real.
 */
export function EvaPortrait({
  portrait,
  size = 'md',
  className,
  priority = false,
}: {
  portrait: EvaPortraitKey;
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}) {
  const asset = evaPortraits[portrait];
  const px = sizes[size];

  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full',
        'border border-border bg-muted',
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        width={px * 2}
        height={px * 2}
        priority={priority}
        className="h-full w-full object-cover"
        // Los retratos encuadran el rostro en el tercio superior.
        style={{ objectPosition: '50% 22%' }}
      />
    </span>
  );
}
