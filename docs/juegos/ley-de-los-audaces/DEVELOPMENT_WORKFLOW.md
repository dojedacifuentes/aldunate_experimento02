# DEVELOPMENT_WORKFLOW — La Ley de los Audaces

Hoja de ruta operativa. `docs/juegos/ley-de-los-audaces/VISION.md` describe el juego completo; este
documento describe lo que efectivamente se construye y en qué orden.

Principio: **PEQUEÑO → JUGABLE → VALIDADO → EXPANDIDO.**

---

## Gates

Ningún milestone avanza si:

- `npm run verify` falla (typecheck · lint · tests · build);
- hay errores de consola en una partida completa;
- el guardado no sobrevive a recargar la página;
- un nodo del grafo apunta a un destino inexistente (lo cubre un test);
- una referencia normativa se muestra como vigente sin estar verificada;
- el juego deja de ser jugable cuando el canvas no monta.

Cada milestone se cierra con **PASS** o **FAIL** anotado en `DEVLOG.md`.

---

## Milestones

### M0 · Auditoría — **PASS**

Auditoría del repositorio anfitrión (`aldunate_experimento02`) y de los repos de
referencia. Salida: la evaluación del flujo y este conjunto de documentos.
Decisiones D-001 a D-003 registradas.

### M1 · Fundación — **PASS**

- Proyecto Next.js 16 / React 19 / TS estricto / Tailwind v4, Node 22.
- Zustand + `persist`, `saveVersion: 1`, `migrar()` con test.
- Bus de eventos React ↔ Phaser.
- Integración del paquete de personajes: registro, motor de arte procedural,
  componentes de sprite, retrato y diálogo.
- Tres personajes nuevos de sala (`judge_achurra`, `prosecutor_naveas`,
  `witness_zapata`) y `scripts/rpg-art/bake.mjs` para hornearlos.
- Vitest + 23 tests. CI en GitHub Actions.

**Criterio de salida:** `verify` verde y una partida que guarda y recarga. ✅

### M2 · Vertical slice — **PASS**

El prólogo completo en una sala, sin movimiento libre.

| # | Pieza | Estado |
|---|---|---|
| 1 | Portada y continuación de partida | ✅ |
| 2 | Creación de personaje (nombre · avatar · especialidad con ventaja real) | ✅ |
| 3 | Escena Phaser: sala, mobiliario, actores, cámara, foco | ✅ |
| 4 | Intérprete de grafo data-driven (6 tipos de nodo) | ✅ |
| 5 | EVA como voz del guion, sin resolver | ✅ |
| 6 | ANALIZAR con objetivo correcto y dos señuelos razonados | ✅ |
| 7 | Contrainterrogatorio con presión | ✅ |
| 8 | Evidencia y contradicción | ✅ |
| 9 | Alegato final: hecho · prueba · norma | ✅ |
| 10 | XP, nivel, impulso, combo, seis estadísticas | ✅ |
| 11 | Veredicto, epílogo y gancho del Capítulo 1 | ✅ |
| 12 | Guardado versionado | ✅ |
| 13 | Teclado (1–5, E/Espacio, Esc) y `prefers-reduced-motion` | ✅ |
| 14 | Fuentes normativas rotuladas por estado | ✅ |

**Criterio de salida — el que importa:** que alguien que no lo construyó lo
juegue completo sin instrucciones y quiera saber qué pasa después.

*Pendiente: que lo juegue una persona. La verificación hecha es automatizada.*

### M3 · Ajuste del slice

Antes de escribir un capítulo más. Depende de qué diga quien lo juegue.

- Ritmo: ¿se hace largo algún tramo? ¿sobra texto en alguna parte?
- Legibilidad de la sala: ¿se entiende quién es quién sin leer el nombre?
- Audio: pasos, evidencia, XP, alerta, transición. Nada protegido.
- Marta Quiroga en la mesa de la defensa (hoy la escena la omite).
- Toga para el tribunal en el motor de arte.

### M4 · Capítulo 1 · La caída

Amenaza, allanamiento, detención. Reutiliza todo el motor del slice.
**Ninguna mecánica nueva.** Si el Capítulo 1 necesita una mecánica nueva, es que
el slice no validó lo que decía validar.

### M5 en adelante

Cárcel, investigación, fuga arcade, mundo exterior, conspiración, juicio final,
polish, release. Están descritos en `VISION.md` y **no son compromiso**: se
definen cuando M4 pase su gate.

---

## Orden de trabajo dentro de un milestone

1. Datos primero: el guion y las piezas nuevas, en `src/data/rpg/`.
2. Test de integridad del grafo (`*.test.ts`) — falla antes de existir la UI.
3. Mecánica, si de verdad hace falta una nueva.
4. Escena y retroalimentación.
5. `npm run verify`.
6. QA manual con `docs/juegos/ley-de-los-audaces/QA.md`.
7. `DEVLOG.md` y `HANDOFF.md`.

---

## Mapa de dependencias

```
registro de personajes ──┬─→ guion ──→ intérprete de nodos ──→ pantalla
                         └─→ motor de arte ──→ escena Phaser
tipos del dominio ───────┴─→ store ──→ HUD
                              └──→ guardado ──→ migración
fuentes jurídicas ───────────→ guion (por id, nunca por texto suelto)
```

Nada apunta hacia atrás. El guion depende del registro; el registro no sabe que
existe el guion.

---

## Riesgos vivos

| # | Riesgo | Mitigación |
|---|---|---|
| R-1 | Volumen de escritura del juego completo | Medir el slice y extrapolar antes de comprometer capítulos |
| R-2 | Arte de mapas y mobiliario para la cárcel y el exterior | El motor procedural cubre personas, no espacios. Decidir en M5 |
| R-3 | La fuga arcade choca con `prefers-reduced-motion` | Toda secuencia con tiempo debe tener alternativa sin tiempo |
| R-4 | Combinatoria de finales | Arquitectura de flags ahora; **un solo final** en 1.0 |
| R-5 | Dos sesiones editando el mismo capítulo | Un capítulo, un archivo, un dueño declarado en HANDOFF |
