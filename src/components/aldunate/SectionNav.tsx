'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { BookOpenText, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Navegación contextual.
 *
 * Se pega bajo la cabecera y marca la sección en curso. El indicador se
 * desplaza; el scroll sigue siendo nativo. Nada de scroll-jacking: el encargo
 * lo pedía explícitamente y, además, secuestrar la rueda en una página que se
 * lee de arriba abajo es la forma más rápida de que alguien la cierre.
 *
 * En pantallas estrechas la barra se desplaza en horizontal en vez de
 * apilarse: cinco anclas apiladas ocuparían media pantalla.
 */

const sections = [
  { id: 'pensamiento', label: 'Ideas' },
  { id: 'publicaciones', label: 'Obras' },
  { id: 'trayectoria', label: 'Tiempo' },
  { id: 'fuentes', label: 'Fuentes' },
] as const;

const LECTURA_KEY = 'aldunate:lectura';
const LECTURA_EVENT = 'aldunate:lectura-change';

/**
 * El modo lectura vive en un atributo del `<html>`, no en el estado de React.
 *
 * Tiene que vivir ahí de todos modos —es CSS quien lo aplica— y duplicarlo en
 * un `useState` crea dos fuentes de verdad que se pueden desincronizar.
 * `useSyncExternalStore` lee el DOM directamente, que es exactamente para lo
 * que existe: estado externo a React, leído sin un render en cascada.
 */
function subscribe(onChange: () => void) {
  window.addEventListener(LECTURA_EVENT, onChange);
  return () => window.removeEventListener(LECTURA_EVENT, onChange);
}

function leerModo() {
  return document.documentElement.hasAttribute('data-lectura');
}

/** En el servidor no hay DOM y el modo por defecto es explorar. */
function modoEnServidor() {
  return false;
}

function aplicarModo(activo: boolean) {
  const root = document.documentElement;
  if (activo) root.setAttribute('data-lectura', '');
  else root.removeAttribute('data-lectura');
  window.dispatchEvent(new Event(LECTURA_EVENT));
}

export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);
  const lectura = useSyncExternalStore(subscribe, leerModo, modoEnServidor);

  // Restaura la preferencia guardada. Solo toca el DOM y avisa: el estado se
  // lee de ahí, así que no hay `setState` dentro del efecto.
  useEffect(() => {
    try {
      if (localStorage.getItem(LECTURA_KEY) === '1') aplicarModo(true);
    } catch {
      /* ventana privada o almacenamiento bloqueado: se queda en explorar */
    }
  }, []);

  function toggleLectura() {
    const next = !leerModo();
    aplicarModo(next);
    try {
      localStorage.setItem(LECTURA_KEY, next ? '1' : '0');
    } catch {
      /* la preferencia no sobrevive a la sesión, y no pasa nada */
    }
  }

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    // El margen inferior grande hace que la sección se marque cuando su inicio
    // entra en el tercio superior, no cuando asoma un píxel por abajo.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Secciones del perfil"
      // La cabecera del sitio ya ocupa 'top-0' con 4rem de alto y z-30. Esta se
      // apoya justo debajo y pasa por detrás: dos barras disputándose el mismo
      // borde superior es el defecto clásico de una navegación de sección.
      className="interactive-only sticky top-16 z-20 border-b border-border/70 bg-background/85 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-5 py-2.5 sm:px-8">
        <span className="mono mr-3 shrink-0 text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          Aldunate
        </span>

        {sections.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? 'true' : undefined}
            className={cn(
              'relative shrink-0 rounded px-3 py-1.5 text-[0.8125rem] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              active === section.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="mono mr-1.5 text-[0.625rem] text-primary/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            {section.label}
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-3 -bottom-[0.7rem] h-px transition-opacity duration-300',
                active === section.id ? 'bg-primary opacity-100' : 'opacity-0',
              )}
            />
          </a>
        ))}

        <button
          type="button"
          onClick={toggleLectura}
          aria-pressed={lectura}
          title={
            lectura
              ? 'Volver al modo explorar: diagramas, movimiento y campo de conceptos'
              : 'Modo lectura: retira lienzos, movimiento y diagramas; deja el texto y las referencias'
          }
          className={cn(
            'mono ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1',
            'text-[0.625rem] uppercase tracking-wider transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            lectura
              ? 'border-primary/60 bg-primary/10 text-primary'
              : 'border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          {lectura ? (
            <Sparkles className="h-3 w-3" aria-hidden />
          ) : (
            <BookOpenText className="h-3 w-3" aria-hidden />
          )}
          {lectura ? 'Explorar' : 'Leer'}
        </button>
      </div>
    </nav>
  );
}
