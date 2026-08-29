'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { evaMessageForRoute, evaWelcome } from '@/data/eva';
import type { EvaMessage } from '@/types';

const SEEN_KEY = 'aldunate-eva-seen';
const MUTED_KEY = 'aldunate-eva-muted';

interface EvaContextValue {
  /** Mensaje correspondiente a la ruta actual. `undefined` si no hay ninguno. */
  message: EvaMessage | undefined;
  open: boolean;
  muted: boolean;
  /** `true` solo durante la aparición automática de primera visita. */
  greeting: boolean;
  openPanel: () => void;
  closePanel: () => void;
  toggleMuted: () => void;
}

const EvaContext = createContext<EvaContextValue | null>(null);

/**
 * Estado de EVA.
 *
 * Dos reglas gobiernan este componente:
 *  1. EVA habla porque cambió la ruta, nunca porque pasó el tiempo.
 *  2. Aparece sola una vez —en la primera visita— y después solo si la llaman.
 *
 * Silenciarla es persistente: si alguien la apaga, sigue apagada mañana.
 */
export function EvaProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [greeting, setGreeting] = useState(false);

  useEffect(() => {
    let isMuted = false;
    let hasSeen = true;
    try {
      isMuted = localStorage.getItem(MUTED_KEY) === '1';
      hasSeen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Sin almacenamiento: se asume ya vista para no molestar en cada carga.
    }
    setMuted(isMuted);

    if (!hasSeen && !isMuted) {
      // Un respiro antes de aparecer: irrumpir durante el primer pintado se
      // lee como pop-up, no como bienvenida.
      const t = window.setTimeout(() => {
        setGreeting(true);
        setOpen(true);
        try {
          localStorage.setItem(SEEN_KEY, '1');
        } catch {
          /* sin persistencia disponible */
        }
      }, 1400);
      return () => window.clearTimeout(t);
    }
  }, []);

  // Cambiar de sección cierra el panel: el mensaje anterior ya no aplica y
  // dejarlo abierto obligaría a leer algo que dejó de ser pertinente.
  useEffect(() => {
    setOpen(false);
    setGreeting(false);
  }, [pathname]);

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => {
    setOpen(false);
    setGreeting(false);
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTED_KEY, next ? '1' : '0');
      } catch {
        /* sin persistencia disponible */
      }
      if (next) setOpen(false);
      return next;
    });
  }, []);

  // Escape cierra. Un panel que no se cierra con Escape es un cuadro de diálogo
  // disfrazado de ayuda.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closePanel]);

  const message = useMemo(() => evaMessageForRoute(pathname), [pathname]);

  const value = useMemo(
    () => ({ message, open, muted, greeting, openPanel, closePanel, toggleMuted }),
    [message, open, muted, greeting, openPanel, closePanel, toggleMuted],
  );

  return <EvaContext.Provider value={value}>{children}</EvaContext.Provider>;
}

export function useEvaContext() {
  const ctx = useContext(EvaContext);
  if (!ctx) throw new Error('useEvaContext debe usarse dentro de <EvaProvider>');
  return ctx;
}

export { evaWelcome };
