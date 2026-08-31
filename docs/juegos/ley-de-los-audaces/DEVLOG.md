# DEVLOG

Una entrada por sesión. Fecha, objetivo, cambios, errores, decisiones,
pendientes, próxima tarea.

---

## 2026-08-30 · M0 + M1 + M2

**Objetivo.** Auditar el repositorio anfitrión, evaluar el flujo propuesto y
construir el vertical slice.

**Cambios.**

- Auditoría de `aldunate_experimento02` (v0.3.0, Next 16, `verify` verde, 15
  rutas) y lectura de `rpgproce` como referencia.
- Proyecto nuevo: Next 16 · React 19 · TS estricto · Tailwind v4 · Zustand ·
  Phaser 3 · Vitest · CI.
- Integración del paquete de personajes: registro, motor de arte procedural,
  componentes de sprite, retrato, diálogo y selección de avatar.
- Tres personajes de sala añadidos y horneados: Isabel Achurra, Rodrigo Naveas,
  Rocío Zapata.
- `scripts/rpg-art/bake.mjs` reconstruido, con codificador PNG propio sin
  dependencias nativas.
- Escena Phaser de la sala: mobiliario, seis actores, cámara con paneo y zoom,
  foco, destello de acierto y error, barrido de ANALIZAR.
- Intérprete de grafo con seis tipos de nodo y Capítulo 0 completo (13 nodos).
- Store con guardado versionado y migración; 23 tests.
- Retratos de EVA del repositorio anfitrión convertidos a WebP: **27 MB → 472
  KB**.

**Errores encontrados y corregidos.**

- `import Phaser from 'phaser'` falla con el build ESM: no hay export por
  defecto. Se usa `import * as Phaser`.
- `NodoRunner` actualizaba el store desde dentro de un actualizador de estado,
  lo que modifica otro componente en mitad de un render ajeno. El salto de nodo
  se movió fuera del actualizador y el reinicio de estado pasó a hacerse con
  `key`.

**Decisiones.** D-001 a D-008 en `DECISIONS.md`.

**Verificación.** `npm run verify` verde. Recorrido completo en navegador
(Chromium): portada → creación → nueve nodos de diálogo → cinco decisiones →
alegato → veredicto. Sin errores de consola. Estadísticas finales coherentes
(ARG 8, INV 4, EST 4, PRE 2).

**Pendientes.** Ver `BACKLOG.md`. Lo bloqueante: el repositorio no existe en
GitHub y nadie ha jugado el slice todavía.

**Próxima tarea.** Crear el repositorio, subir, y conseguir que una persona
juegue el Capítulo 0 sin instrucciones.

---

## 2026-08-30 · versión de un solo archivo

**Objetivo.** Publicar el slice sin depender de que el repositorio exista.

**Contexto.** El proxy de git del entorno sólo inyecta credenciales para
repositorios registrados como fuente de la sesión. Ni `rpg.derecho-` ni
`ley-de-los-audaces` lo estaban, de modo que el push quedó bloqueado por
permisos, no por trabajo.

**Cambios.**

- `npm run standalone` compone `dist/audaces.html`: el mismo guion, la misma
  escena y el mismo arte en un archivo de 1,52 MB sin una sola petición de red.
  Phaser, los datos y los 49 retratos viajan incrustados.
- `scripts/standalone/dump.mts` vuelca el contenido desde `src/data/rpg`. No hay
  copia del guion: si el capítulo cambia, la versión suelta cambia con él.
- La escena dejó de guardar una referencia a sí misma y se la pide al juego, de
  modo que no queda una escena muerta apuntada tras destruir la instancia.
- Tipografías: Newsreader y JetBrains Mono, con respaldo real del sistema.

**Verificación.** Recorrido completo en Chromium sobre el archivo compilado:
portada → creación → cinco decisiones → alegato → veredicto. Sin peticiones
externas salvo la hoja de tipografías. `npm run verify` verde.

**Pendiente.** Autorizar el repositorio en la sesión y hacer el push.

---

## 2026-08-30 · checkpoint

**Objetivo.** Dejar el proyecto en condiciones de que otra sesión lo retome sin
contexto previo.

**Cambios.** `docs/juegos/ley-de-los-audaces/CHECKPOINT.md`: estado, mapa del repositorio archivo por
archivo, reparto de carpetas entre sesiones, qué está hecho, qué falta y por qué,
bloqueos, decisiones, reglas duras, las cinco próximas acciones en orden,
comandos y las trampas ya encontradas. Referenciado desde `CLAUDE.md` y `README`.

**Nota.** La sesión no está enlazada a ningún computador, de modo que la entrega
va por el chat: un paquete único para descomprimir donde se quiera.

**Próxima tarea.** Sin cambios: subir el repositorio y conseguir que alguien
juegue el Capítulo 0.

---

## 2026-08-30 · prompt de continuidad

**Cambios.** `docs/juegos/ley-de-los-audaces/PROMPT-CONTINUAR.md`: instrucción lista para pegar en una
sesión nueva. Tres fases —auditar, reportar, continuar—, con el orden de lectura,
el orden de inspección del código, los comandos de verificación, las reglas
innegociables y las trampas ya encontradas. Incluye una variante corta.

Referenciado desde `CHECKPOINT.md` y `README`.

---

## 2026-08-30 · integración con el laboratorio

**Objetivo.** Dejar prevista la sección del juego en `aldunate_experimento02`
sin alojar el juego ahí.

**Cambios.** `docs/juegos/ley-de-los-audaces/integracion-aldunate/`: parche listo para aplicar sobre el
sitio anfitrión. `Experiment` admite `externalHref`; la tarjeta pinta el enlace
sólo si existe; la ficha describe el RPG y pasa a `prototipo`; la página de
juegos distingue el estado real de cada pieza; D-020 registrada en el anfitrión.

El interruptor es `AUDACES_URL`. Vacío, la ficha se muestra en construcción sin
botón, así que el parche se puede fusionar antes de que haya despliegue.

**Verificación.** Aplicado sobre una copia del anfitrión: `npm run verify` verde,
15 rutas, y comprobado en navegador que con la constante vacía no aparece ningún
enlace y con valor aparece exactamente uno.

**Pendiente.** Sigue bloqueado el push del propio repositorio del juego.

---

## 2026-08-30 · misión de publicación

**Objetivo.** Dejar el trabajo de publicar en manos de un agente con
credenciales reales, sin que tenga que reconstruir el contexto.

**Cambios.**

- `AGENTS.md` deja de ser sólo el bloque de Next: incorpora las reglas del
  proyecto para cualquier agente de código, no sólo para Claude.
- `docs/juegos/ley-de-los-audaces/misiones/M-PUBLICACION.md`: cinco tareas —verificar, publicar,
  desplegar, enlazar, informar—, cada una con su criterio de fallo, más una
  lista explícita de lo que queda fuera de alcance.
- `docs/juegos/ley-de-los-audaces/misiones/INFORME-PLANTILLA.md`: nueve secciones, incluida una para
  lo que el agente vio y decidió no tocar.
- `docs/juegos/ley-de-los-audaces/misiones/PROMPT-CODEX.md`: el texto listo para pegar.

**Criterio de diseño.** La misión prohíbe explícitamente ampliar el alcance. Un
agente con credenciales y sin límites declarados tiende a «arreglar» los avisos
de lint del código donado y a refactorizar lo que funciona; el encargo dice que
anote y siga.

**Pendiente.** Sigue bloqueado el push desde este entorno. Es justamente lo que
la misión resuelve.

---

## 2026-08-31 · correcciones previas a publicar

**Objetivo.** Atender los ocho hallazgos de una revisión externa hecha antes del
primer push.

**Cambios.**

- Remoto con token eliminado del `.git/config`. El repositorio se entrega sin
  remoto configurado.
- Historial reescrito sin el trailer de sesión, y parche de integración
  regenerado igual.
- `package-lock.json` sincronizado. Comprobado con una instalación limpia real:
  `npm ci` pasa, 0 vulnerabilidades.
- `almacenamientoSeguro()`: el guardado deja de romperse cuando `localStorage`
  lanza. La causa del «Cargando…» eterno no era el callback de rehidratación,
  sino que sin almacén la rehidratación no llegaba a ejecutarse.
- La pausa corta el teclado en fase de captura, sin tocar el código donado.
- La fase se persiste normalizada y el desenlace deja `veredicto_cobrado`:
  recargar tras el final ya no vuelve a cobrar XP.
- El HTML suelto es un documento completo —doctype, idioma, charset, viewport— y
  dejó de pedir tipografías por red. Ahora «sin internet» es literal.
- T4 de la misión distingue empujar rama al anfitrión de trabajar con fork.
- `QA.md`: la casilla que afirmaba lo contrario de lo que hacía el código quedó
  corregida, y se sumaron dos comprobaciones nuevas.

**Verificación.** `npm run verify` verde con 25 tests. Siete comprobaciones en
navegador, todas pasando: arranque con `localStorage` lanzando, jugar en ese
estado, pausa que no deja pasar teclas, controles que vuelven al cerrarla, cierre
de capítulo marcado, recarga que muestra el cierre y XP que no se duplica. Y el
capítulo jugado entero sobre el archivo suelto, sin una sola petición de red.

**Lección.** Una casilla de QA que afirma algo que nadie probó es peor que no
tener la casilla: da por cubierto justo lo que falla.
