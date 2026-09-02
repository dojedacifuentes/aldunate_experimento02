'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { BookOpenText, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  alternarModo,
  leerModo,
  modoEnServidor,
  restaurarModo,
  suscribir,
} from './reading-mode';

/**
 * El control del modo lectura, ahora en la cabecera de todo el sitio.
 *
 * Es el escape de la capa espacial y por eso importa que esté siempre a mano:
 * un sitio que añade movimiento y reflejos en las dieciséis rutas tiene que
 * ofrecer la forma de apagarlos en las dieciséis, y no sólo a quien haya
 * configurado `prefers-reduced-motion` en su sistema operativo. Mucha gente
 * quiere leer sin efectos un rato, no para siempre.
 *
 * `aria-pressed` y no `role="switch"`: es un botón que conmuta un modo de
 * presentación, y los lectores de pantalla anuncian «pulsado / no pulsado»
 * sin necesidad de más.
 */
export function ReadingModeToggle({ className }: { className?: string }) {
  const lectura = useSyncExternalStore(suscribir, leerModo, modoEnServidor);

  // La preferencia se restaura una vez, al montar la cabecera. No hay
  // `setState` aquí: el estado se lee del DOM, que es donde se escribió.
  useEffect(() => {
    restaurarModo();
  }, []);

  return (
    <button
      type="button"
      onClick={() => alternarModo()}
      aria-pressed={lectura}
      data-press
      title={
        lectura
          ? 'Volver al modo explorar: movimiento, profundidad y diagramas'
          : 'Modo lectura: retira movimiento, reflejos, lienzos y diagramas; deja el texto y las referencias'
      }
      className={cn(
        'ui inline-flex h-9 items-center gap-1.5 rounded-full border px-3',
        'text-[0.6875rem] font-medium uppercase tracking-wide transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        lectura
          ? 'border-primary/60 bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
        className,
      )}
    >
      {lectura ? (
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <BookOpenText className="h-3.5 w-3.5" aria-hidden />
      )}
      {/* En móvil el icono basta: la etiqueta se lleva un tercio del ancho de
          la cabecera y el `title` sigue diciendo qué hace. */}
      <span className="hidden sm:inline">{lectura ? 'Explorar' : 'Leer'}</span>
    </button>
  );
}
