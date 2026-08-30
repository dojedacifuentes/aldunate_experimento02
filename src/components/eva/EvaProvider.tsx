'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { evaMessageForRoute, evaWelcome } from '@/data/eva';
import type { EvaMessage } from '@/types';

const SEEN_KEY = 'aldunate-eva-seen';
const MUTED_KEY = 'aldunate-eva-muted';
const MUTED_EVENT = 'aldunate-eva-muted-change';
let memoryMuted = false;

function readMuted() {
  try {
    memoryMuted = localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    // El respaldo en memoria conserva la preferencia durante esta sesión.
  }
  return memoryMuted;
}

function subscribeToMuted(onChange: () => void) {
  window.addEventListener(MUTED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(MUTED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

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
  const [panel, setPanel] = useState<{ route: string; greeting: boolean } | null>(null);
  const muted = useSyncExternalStore(subscribeToMuted, readMuted, () => false);
  const open = panel?.route === pathname;
  const greeting = open && panel.greeting;

  useEffect(() => {
    let hasSeen = true;
    try {
      hasSeen = localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Sin almacenamiento: se asume ya vista para no molestar en cada carga.
    }

    if (!hasSeen && !readMuted()) {
      // Un respiro antes de aparecer: irrumpir durante el primer pintado se
      // lee como pop-up, no como bienvenida.
      const t = window.setTimeout(() => {
        setPanel({ route: pathname, greeting: true });
        try {
          localStorage.setItem(SEEN_KEY, '1');
        } catch {
          /* sin persistencia disponible */
        }
      }, 1400);
      return () => window.clearTimeout(t);
    }
  }, [pathname]);

  const openPanel = useCallback(
    () => setPanel({ route: pathname, greeting: false }),
    [pathname],
  );
  const closePanel = useCallback(() => setPanel(null), []);

  const toggleMuted = useCallback(() => {
    const next = !readMuted();
    memoryMuted = next;
    try {
      localStorage.setItem(MUTED_KEY, next ? '1' : '0');
    } catch {
      /* sin persistencia disponible */
    }
    if (next) setPanel(null);
    window.dispatchEvent(new Event(MUTED_EVENT));
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
