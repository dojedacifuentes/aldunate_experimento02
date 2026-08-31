# La Ley de los Audaces — documentación

RPG jurídico chileno. Vive dentro de este repositorio, en
`/experimentos/juegos/ley-de-los-audaces`, con su código, su arte y su
trazabilidad, para poder auditarlo y continuarlo sin salir de aquí.

**Estado:** Capítulo 0 jugable, de tres a cinco minutos. Nada más existe, y eso
es deliberado.

---

## Por dónde empezar

| Si vas a… | Lee |
|---|---|
| retomar el proyecto en frío | `CHECKPOINT.md` — **empieza aquí** |
| entender por qué algo es como es | `DECISIONS.md` |
| saber qué falta y qué lo desbloquea | `HANDOFF.md` · `BACKLOG.md` |
| escribir contenido nuevo | `GAME_DESIGN.md` · `VISION.md` |
| tocar el arte | `ART_DIRECTION.md` |
| revisar antes de publicar | `QA.md` |
| encargarle algo a un agente | `misiones/` |

`DEVLOG.md` es el historial: una entrada por sesión, con lo que se hizo, lo que
falló y cuál es el siguiente paso.

---

## Dónde vive cada cosa

```
src/app/experimentos/juegos/ley-de-los-audaces/
    page.tsx          la ficha: arriba se juega, abajo se audita
    juego.css         estilos acotados a .cabina-audaces

src/data/rpg/         EL CONTENIDO — guion, reparto, evidencia, fuentes
    chapters/prologo.ts   el Capítulo 0 entero
    characters.ts         quién es quién y cómo habla
    evidence.ts           las piezas del expediente
    legalSources.ts       referencias normativas con su estado
    skills.ts             habilidades, especialidades, estadísticas base

src/components/rpg/   presentación
    game/             lo propio: intérprete, HUD, creación de personaje
    *.tsx             el paquete de arte: retratos, sprites, diálogo

src/engine/rpg/       Phaser: la sala, la cámara, la retroalimentación
src/lib/rpg/          bus, puntuación, guardado, motor de arte procedural
src/state/rpg/        el estado y su persistencia
src/types/{rpg,game}.ts   los contratos

scripts/rpg-art/      horneado del arte a PNG
scripts/standalone/   versión de un solo archivo, sin red
public/rpg/characters/    el arte horneado y su manifiesto
```

---

## Comandos

```bash
npm run dev            # http://localhost:3000/experimentos/juegos/ley-de-los-audaces
npm run verify         # typecheck + lint + tests + build
npm run juego:arte     # hornea el arte que falte (--all para rehacerlo todo)
npm run juego:suelto   # dist/audaces.html — el juego en un archivo, sin red
```

---

## Cómo se amplía

**Un capítulo nuevo** es un archivo en `src/data/rpg/chapters/`. Nada más: el
intérprete recorre seis tipos de nodo —diálogo, decisión, scan, prueba, alegato,
fin— y no conoce el guion.

**Un personaje nuevo** son tres ediciones y un comando:
`src/lib/rpg/art/asset-paths.mjs`, `src/lib/rpg/art/character-specs.mjs`,
`src/data/rpg/characters.ts`, y `npm run juego:arte`. Ninguna escena se toca.
El detalle está en `ART_DIRECTION.md`.

**Una mecánica nueva** es un caso más en `NodoRunner.tsx`. Antes de añadirla,
comprueba si el capítulo la necesita de verdad: seis tipos de nodo han bastado
para todo hasta ahora.

---

## Reglas que no se negocian

- **No se inventa Derecho.** Las referencias viven en `legalSources.ts` con su
  estado; lo `UNVERIFIED` se muestra rotulado y nunca como Derecho vigente.
- **La ficción se mantiene abstracta.** Personajes, empresas, documentos y causas
  son inventados. La fuga carcelaria y cualquier acto ilícito se resuelven con
  mecánicas arcade: nada replicable.
- **El juego no habla por nadie.** Ni por la Escuela, ni por la Universidad, ni
  por el profesor. Es ficción alojada en un laboratorio, y la ficha lo dice.
- **EVA ayuda a pensar, no resuelve.** Es falible por diseño.
- **El contenido vive en `src/data/rpg`**, nunca dentro de un componente.
