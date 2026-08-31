# TODO: FINAL CHARACTER ART

Estas carpetas están vacías a propósito.

Todo el reparto se dibuja hoy **proceduralmente en tiempo de ejecución** con el
motor de `lib/rpg/art/`. No hay muñecos genéricos ni assets de relleno: el
respaldo procedural es exactamente el mismo arte que se hornearía a PNG, sólo
que generado en el cliente en lugar de leído de disco.

## Estructura

```
/public/rpg/characters/
  player/        sprites/  portraits/  animations/
  eva/           sprites/  portraits/  animations/
  director/      sprites/  portraits/  animations/
  rival/         sprites/  portraits/  animations/
  client/        sprites/  portraits/  animations/
  counterparty/  sprites/  portraits/  animations/
  ambient/       sprites/  portraits/  animations/
  manifest.json  ← lo genera el horneado; lista lo que existe de verdad
```

- `sprites/<slug>.png` — hoja de 288×288 (6 columnas × 6 filas de celdas de 48 px)
- `portraits/<slug>-<mood>.png` — 512×512, fondo transparente
- `animations/<slug>.json` — clips (fila, frames, fps, loop) de esa hoja

## Cómo pasar de procedural a definitivo

1. Hornear (requiere Node): `node scripts/rpg-art/bake.mjs`
   Escribe los PNG y `manifest.json`. A partir de ahí el runtime prefiere el
   archivo y deja de dibujar.
2. O sustituir a mano: dejar los PNG con esos nombres y regenerar el manifiesto.
3. Para arte hecho por una persona ilustradora, con geometría distinta: editar
   `sprite` y `animations` del personaje en `data/rpg/characters.ts` y poner
   `provisionalArt: false`. **No hay que tocar ninguna escena ni ningún diálogo.**

## Restricciones de derechos

Los diseños son originales. No se usan actores, personajes de ficción ajenos,
imágenes protegidas ni el parecido de personas reales. Cualquier arte definitivo
que sustituya a este debe cumplir lo mismo.
