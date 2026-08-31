# HANDOFF — estado del proyecto

**Última actualización:** 30-08-2026 · versión `0.1.0-alpha.1`

Documento para que cualquier persona o sesión retome el trabajo sin haber estado
en la anterior.

---

## 1. Antes de tocar nada

```bash
pwd
git status
git remote -v
npm install
npm run dev      # http://localhost:3000
npm run verify   # typecheck + lint + test + build
```

Leer `CLAUDE.md` completo. Contiene tres reglas duras —no inventar normas,
mantener la ficción abstracta, no salirse de la carpeta propia— cuyo
incumplimiento no es un problema de estilo.

Node 22.x.

---

## 2. Qué está hecho

El **vertical slice completo**: Capítulo 0 jugable de principio a fin, de la
portada al veredicto.

| Área | Estado |
|---|---|
| Next.js 16 · React 19 · TS estricto · Tailwind v4 · Node 22 | ✅ |
| Zustand + persist · `saveVersion: 1` · migración con tests | ✅ |
| Bus React ↔ Phaser (5 eventos, un solo sentido) | ✅ |
| Escena Phaser: sala, mobiliario, 6 actores, cámara, foco, destello, barrido | ✅ |
| Registro de personajes + motor de arte procedural + horneado a PNG | ✅ |
| 3 personajes de sala nuevos, horneados y en el manifiesto | ✅ |
| Intérprete de grafo: diálogo · decisión · scan · prueba · alegato · fin | ✅ |
| Capítulo 0 completo: 13 nodos, 5 decisiones con consecuencia | ✅ |
| Creación de personaje con ventaja real por especialidad | ✅ |
| HUD: nivel, XP, impulso, combo, expediente, 6 estadísticas | ✅ |
| Fuentes normativas rotuladas por estado de verificación | ✅ |
| Teclado 1–5 · E/Espacio · Esc · `prefers-reduced-motion` | ✅ |
| 23 tests · CI en GitHub Actions | ✅ |

---

## 3. Qué NO está hecho, y por qué

### 3.1 El repositorio existe pero esta sesión no puede hacer push

`github.com/dojedacifuentes/ley-de-los-audaces` está creado y vacío. El proxy de
git del entorno de trabajo sólo inyecta credenciales para repositorios
registrados como fuente de la sesión, y éste no lo está, así que el push falla
con 403 antes de salir a la red.

**Cómo desbloquear.** Autorizar el repositorio en la sesión, o hacer el push
desde una máquina propia:

```bash
git remote add origin https://github.com/dojedacifuentes/ley-de-los-audaces.git
git push -u origin main
```

Mientras tanto el capítulo se publica como página suelta con
`npm run standalone`, que produce un archivo autocontenido sin red.

### 3.2 Nadie lo ha jugado todavía

La verificación hecha es automatizada: recorrido completo en navegador, sin
errores de consola, del alegato al veredicto. Eso prueba que **funciona**. No
prueba que sea **divertido**, que es el criterio de salida real de M2.

**Cómo desbloquear.** Que alguien que no lo construyó lo juegue completo sin
instrucciones, y anotar dónde se aburre y dónde se pierde.

### 3.3 Ningún capítulo más

Deliberado. `VISION.md` describe once capítulos; construir el segundo antes de
validar el primero es exactamente lo que el método existe para evitar.

### 3.4 Sin audio

Pasos, evidencia, XP, alerta y transición están pendientes. Sólo material
original o libre; nada protegido.

### 3.5 Marta Quiroga no aparece en la escena

Habla el guion de ella pero su sprite no está en la mesa de la defensa. Es una
línea en el reparto de `GameShell`. Anotado en el backlog.

### 3.6 Todo el arte es provisional

`provisionalArt: true` en todo el registro. Es arte original y coherente, no
relleno, pero está pensado para sustituirse. Sustituirlo no toca ninguna escena
ni ningún diálogo: se dejan los PNG y se ajustan tres campos.

---

### 3.7 Revisión externa atendida

Ocho hallazgos previos a publicar, todos corregidos y comprobados. El detalle
está en `docs/juegos/ley-de-los-audaces/misiones/RESPUESTA-A-LA-REVISION.md`.

---

## 4. Siguiente paso recomendado

En este orden:

1. **Crear el repositorio y subir.** Sin eso no hay flujo de trabajo.
2. **Que alguien juegue el slice.** Es el gate real de M2.
3. **Ajustar según lo que aparezca** (M3). No escribir el Capítulo 1 antes.
4. **Actualizar la ficha** de `aldunate_experimento02` según D-002.

---

## 5. Quién está tocando qué

| Archivo / carpeta | Dueño actual | Rama |
|---|---|---|
| `src/data/rpg/chapters/prologo.ts` | libre | — |
| resto de `src/data/rpg/**` | libre | — |
| `src/engine/**`, `src/lib/rpg/**`, `src/state/**` | libre | — |

Al empezar a trabajar en un capítulo, anótalo aquí. Al terminar, bórralo.
