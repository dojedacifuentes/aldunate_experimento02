'use client';

import './juego.css';
import { CabinaAudaces } from './CabinaAudaces';

/**
 * La cabina con sus estilos, en un solo módulo cargable en diferido.
 *
 * Existe por una razón de empaquetado, no de diseño: `next/dynamic` necesita
 * un módulo con exportación por defecto, y hace falta que **el CSS del juego
 * viaje en el mismo trozo diferido que el juego**. Si la hoja se importara
 * desde la portada, sus setecientas líneas entrarían en el paquete inicial de
 * una página que casi siempre se abre para leer un informe.
 *
 * No toca el código donado. `CabinaAudaces` sigue igual; esto sólo lo envuelve.
 */
export default CabinaAudaces;
