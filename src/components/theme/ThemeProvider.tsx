'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'aldunate-theme';
const THEME_EVENT = 'aldunate-theme-change';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/**
 * Script que corre antes del primer pintado para evitar el destello de tema
 * equivocado. Se inyecta en <head> desde el layout raíz.
 *
 * El sitio nace oscuro: el modo cyberpunk es el estado por defecto y el claro
 * institucional se elige. Si el sistema pide `light` explícitamente, se respeta.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  /** `false` hasta que el cliente confirma el tema real; evita render inconsistente. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // El script de <head> decide antes del primer pintado. El store externo lee
  // ese resultado sin introducir un segundo render de sincronización.
  const clientTheme = useSyncExternalStore(subscribeToTheme, readTheme, () => null);
  const theme = clientTheme ?? 'dark';
  const ready = clientTheme !== null;

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // La transición se activa solo durante el cambio: sin esto, el primer
    // pintado anima colores desde el estado por defecto del navegador.
    root.classList.add('theme-transition');
    root.classList.toggle('dark', next === 'dark');
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Modo privado o almacenamiento bloqueado: el tema vale para esta sesión.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
    window.setTimeout(() => root.classList.remove('theme-transition'), 320);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, ready }),
    [theme, setTheme, toggleTheme, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
