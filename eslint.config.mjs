import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'dist/**', 'next-env.d.ts']),
  {
    // Motor de arte y componentes del juego: llegaron como paquete cerrado y
    // sincronizan estado con fuentes externas (temporizadores de animación,
    // manifiesto de assets, efecto de tecleo). `set-state-in-effect` es una
    // heurística de rendimiento, no una regla de corrección, y reescribir código
    // donado para silenciarla arriesga más de lo que gana. Ver D-022.
    files: ['src/components/rpg/*.tsx', 'src/hooks/rpg/*.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    // JavaScript plano que corre igual en Node y en el navegador, sin compilador.
    files: ['src/lib/rpg/art/*.mjs', 'scripts/**/*.mjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]);
