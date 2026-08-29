'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fondo del sitio. Fijo, no interactivo, detrás de todo.
 *
 * Los colores salen de variables de tema, así que la misma pieza rinde dos
 * atmósferas distintas: retícula de tinta sobre papel en modo institucional,
 * malla cian con halos y barrido en modo nocturno. El movimiento existe solo
 * en el segundo caso, y solo si el sistema no pide lo contrario.
 */
export function Ambience() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="grid-bg absolute inset-0" />

      {/* Halos: dan profundidad sin recurrir a una imagen de fondo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -15%, var(--halo-1) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 100% 85%, var(--halo-2) 0%, transparent 65%)',
        }}
      />

      {/* Línea superior: el pulso vive solo en el tema oscuro (--rule es tenue en claro). */}
      {reduced ? (
        <div className="rule-gradient absolute inset-x-0 top-0 h-px" />
      ) : (
        <motion.div
          className="rule-gradient absolute inset-x-0 top-0 h-px"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Grano: --noise-opacity es 0 en modo claro, de modo que no se pinta. */}
      <div className="noise absolute inset-0" />
    </div>
  );
}
