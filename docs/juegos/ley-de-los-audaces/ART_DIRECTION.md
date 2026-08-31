# Dirección de arte

Pixel art contemporáneo · novela gráfica · drama jurídico · estética editorial.

La paleta es **cerrada**: tinta, carbón, marfil, burdeos oscuro, dorado apagado
y gris piedra. Todo tono de piel, cabello y vestuario se elige dentro de esa
familia para que el reparto se lea como un mismo libro ilustrado y no como un
set de assets sueltos.

Prohibido: neón, cian saturado, magenta, verde fosforescente.

Los valores exactos viven en `src/lib/rpg/art/palette.mjs`.

---

## Pipeline

```
REFERENCIA → ESPECIFICACIÓN → DIBUJO PROCEDURAL → HORNEADO → INTEGRACIÓN
```

Nadie dibuja píxeles a mano. Un personaje es una **especificación** —piel,
cabello, peinado, tela, camisa, acento, cuello, complexión, gafas, objeto— y el
motor lo dibuja. Eso garantiza que doce personajes hechos en momentos distintos
compartan anatomía, luz y contorno.

### Añadir un personaje

1. `src/lib/rpg/art/asset-paths.mjs` → dónde viven sus archivos.
2. `src/lib/rpg/art/character-specs.mjs` → cómo se dibuja.
3. `src/types/rpg.ts` → su `CharacterId` y, si hace falta, su rol.
4. `src/data/rpg/characters.ts` → quién es, cómo habla, qué expresiones admite.
5. `node scripts/rpg-art/bake.mjs` → PNG y manifiesto.

No hay paso 6. Ninguna escena ni ningún diálogo se toca.

### Sustituir por arte definitivo

Dejar los PNG con esos nombres, regenerar el manifiesto y poner
`provisionalArt: false`. Si la hoja nueva no es de 6×6 celdas de 48 px, se
ajustan `sprite` y `animations` del personaje: el runtime no asume geometría.

---

## Geometría

| Pieza | Tamaño |
|---|---|
| Hoja de sprites | 288×288 — 6 columnas × 6 filas de 48 px |
| Retrato | 512×512, fondo transparente |
| Filas de la hoja | 0 abajo · 1 arriba · 2 izquierda · 3 derecha · 4 hablar · 5 pensar |
| Columnas direccionales | 0–3 caminata · 4–5 reposo |

Expresiones: `neutral`, `friendly`, `skeptical`, `angry`, `thinking`,
`surprised`. Sólo EVA admite `eva_glitch`.

---

## Casting visual

- Los dos juniors comparten el traje de la casa. Es deliberado: para el estudio
  son «los nuevos», intercambiables.
- Sofía Aldana rompe con tinta, plata y oro: jerarquía.
- Ignacio Bravo usa gris piedra claro y oro: viene de fuera, y se nota.
- Marta Quiroga y Héctor Solís no son abogados: arena y burdeos, fuera del
  uniforme profesional.
- El tribunal viste tinta; la fiscalía, pizarra —institución, no estudio—; la
  testigo, arena, porque tampoco es abogada.
- EVA no tiene tela: tiene interfaz. Se dibuja con la misma anatomía que el
  resto, y eso es lo que la mantiene dentro del mundo. Lo que la separa es la
  capa de interferencia, no el diseño.

---

## Pendientes de arte

- **Toga.** No existe como prenda en el motor. La presidenta del tribunal usa
  traje tinta con acento oro: lee como autoridad, no como tribunal.
- **Mobiliario.** La sala está construida con rectángulos bien puestos. Funciona
  y no compite con los actores; le falta carácter.
- **EVA fotorrealista.** Las imágenes de referencia de `aldunate_experimento02`
  son la capa `reference` del pipeline, no arte de juego. No se mezclan con el
  pixel art en pantalla.

---

## Derechos

Todos los diseños son originales. Ninguno deriva de actores, personajes de
ficción ajenos, imágenes protegidas ni del parecido de personas reales. El arte
definitivo que sustituya a este debe cumplir lo mismo.
