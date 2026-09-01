import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Escudo de la Escuela de Derecho PUCV.
 *
 * **Sin usos en el árbol público desde el 31-08-2026.** Se conserva a propósito:
 * el día que exista autorización, restituirlo debe ser un `import`, no una
 * reconstrucción con las reglas de uso ya olvidadas. Ver `docs/DECISIONS.md`
 * D-033. No lo reintroduzcas sin esa autorización.
 *
 * Cuando vuelva: no se recolorea, no se anima, no se deforma y no lleva glow.
 * En modo oscuro se atenúa levemente el brillo para que no queme sobre el fondo
 * azul-negro, pero el escudo en sí no se altera. Cualquier tentación de
 * «integrarlo» al tema termina en una marca institucional intervenida sin
 * autorización.
 */
export function InstitutionalMark({
  size = 40,
  className,
  withCaption = false,
}: {
  size?: number;
  className?: string;
  withCaption?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/brand/derecho-pucv-logo.jpg"
        alt="Escudo de la Escuela de Derecho, Pontificia Universidad Católica de Valparaíso"
        width={size}
        height={size}
        className="h-auto w-auto rounded-sm dark:brightness-95"
        style={{ width: size, height: 'auto' }}
      />
      {withCaption && (
        <span className="flex flex-col leading-tight">
          <span className="text-[0.8125rem] font-medium text-foreground">
            Escuela de Derecho
          </span>
          <span className="text-[0.6875rem] text-muted-foreground">
            Pontificia Universidad Católica de Valparaíso
          </span>
        </span>
      )}
    </span>
  );
}
