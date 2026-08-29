'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'aldunate-theme';

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
  const [theme, setThemeState] = useState<Theme>('dark');
  const [ready, setReady] = useState(false);

  // El script de <head> ya decidió el tema. Aquí solo se lee lo que dejó puesto.
  useEffect(() => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeState(current);
    setReady(true);
  }, []);

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
    setThemeState(next);
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
