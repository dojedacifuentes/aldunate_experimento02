'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

/**
 * Conmutador de tema. Los dos modos no son claro/oscuro genéricos: son
 * «archivo nocturno» e «institucional PUCV». La etiqueta lo dice.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, ready } = useTheme();
  const goingLight = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={goingLight ? 'Cambiar a modo institucional claro' : 'Cambiar a modo nocturno'}
      title={goingLight ? 'Modo institucional' : 'Modo nocturno'}
      className={cn(
        'group relative inline-flex h-9 items-center gap-2 rounded-full border border-border',
        'bg-card px-3 text-muted-foreground transition-colors',
        'hover:border-primary/50 hover:text-foreground',
        className,
      )}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Se renderizan ambos íconos y se cruzan en opacidad: sin salto de layout. */}
        <Sun
          className={cn(
            'absolute h-4 w-4 transition-all duration-300',
            ready && goingLight ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
          aria-hidden
        />
        <Moon
          className={cn(
            'absolute h-4 w-4 transition-all duration-300',
            ready && !goingLight ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
          aria-hidden
        />
      </span>
      <span className="meta hidden text-foreground/70 sm:inline">
        {ready ? (goingLight ? 'Institucional' : 'Nocturno') : '···'}
      </span>
    </button>
  );
}
