# CHECKPOINT — La Ley de los Audaces

**Fecha:** 30 de agosto de 2026
**Versión:** `0.1.0-alpha.1`
**Estado global:** vertical slice terminado y verificado. Ningún capítulo más.

Este documento existe para que **otra IA, en otra sesión, sin ningún contexto
previo**, pueda continuar sin preguntar nada. Si eres esa IA: lee esto entero
antes de tocar un archivo. Está escrito para ti.

---

## 0. Orden de lectura

1. Este documento, completo.
1 bis. `docs/juegos/ley-de-los-audaces/PROMPT-CONTINUAR.md` si alguien te pasó este proyecto en frío.
2. `../../../CLAUDE.md` — reglas permanentes del repositorio. No son estilo: son condiciones.
3. `docs/juegos/ley-de-los-audaces/DECISIONS.md` — por qué las cosas son como son. Antes de revertir
   algo, busca aquí si fue deliberado.
4. `docs/juegos/ley-de-los-audaces/DEVELOPMENT_WORKFLOW.md` — milestones y gates.
5. `docs/juegos/ley-de-los-audaces/VISION.md` — el juego completo. **Es visión, no compromiso.**

No empieces a escribir código hasta haber leído 1, 2 y 3.

---

## 1. Qué es esto

Un RPG jurídico chileno para navegador. El jugador es abogado o abogada, gana un
juicio en el prólogo y es incriminado inmediatamente después por un delito que no
cometió. El juego completo va de ahí a un juicio final donde se defiende a sí
mismo. **Sólo está construido el prólogo.**

Autor del encargo: Diego Ojeda Cifuentes, abogado y docente en la PUCV.
Idioma de todo el proyecto: español de Chile. Los comentarios de código, los
nombres de variables y la documentación están en español. Mantenlo así.

---

## 2. Estado en una tabla

| | |
|---|---|
| Capítulo 0 · El juicio | ✅ completo y jugable, 3–5 min |
| Capítulos 1 a 10 | ❌ no existen, y no deben construirse todavía |
| Motor de escena | ✅ Phaser 3, sala de audiencias |
| Intérprete de guion | ✅ seis tipos de nodo, data-driven |
| Reparto y arte | ✅ 16 personajes, pixel art procedural propio |
| Guardado | ✅ versionado, con migración y tests |
| Tests | ✅ 23, verdes |
| CI | ✅ escrito, sin ejecutar nunca (falta el push) |
| Publicado y jugable | ✅ como página suelta en claude.ai |
| En GitHub | ❌ bloqueado por permisos, ver §8 |
| Jugado por una persona | ❌ **este es el gate real, ver §7.1** |

---

## 3. Dónde está todo

**Todo vive en este repositorio**, `dojedacifuentes/aldunate_experimento02`.

| Artefacto | Dónde |
|---|---|
| El juego, jugable | `/experimentos/juegos/ley-de-los-audaces` |
| Guion, reparto, evidencia, fuentes | `src/data/rpg/` |
| Motor y presentación | `src/engine/rpg/` · `src/components/rpg/` · `src/lib/rpg/` · `src/state/rpg/` |
| Arte horneado y su manifiesto | `public/rpg/characters/` |
| Documentación y encargos | `docs/juegos/ley-de-los-audaces/` |
| Versión de un archivo, sin red | `npm run juego:suelto` → `dist/audaces.html` |

`dojedacifuentes/rpgproce` es otro RPG jurídico del mismo autor, sin relación de
código: se lee como referencia y jamás se escribe.

---

## 4. Mapa del repositorio

```
src/
  app/                       rutas Next (App Router). Sólo una: /
  types/
    rpg.ts                   contrato de personajes y arte  [DONADO]
    game.ts                  contrato del juego: nodos, stats, efectos
  data/rpg/
    characters.ts            el reparto  [DONADO + 3 añadidos]
    chapters/prologo.ts      EL GUION DEL CAPÍTULO 0
    evidence.ts              piezas del expediente
    legalSources.ts          referencias normativas con estado de verificación
    skills.ts                habilidades, especialidades, stats base
    prologo.test.ts          integridad del grafo
  components/rpg/
    CharacterPortrait.tsx    retrato con fundido        [DONADO]
    CharacterSprite.tsx      sprite animado             [DONADO]
    DialogueBox.tsx          cuadro de diálogo          [DONADO]
    PlayerSelect.tsx         selector de avatar         [DONADO]
    EvaAvatar.tsx            EVA con glitch             [DONADO]
    AmbientNpcLayer.tsx      NPC de fondo               [DONADO, sin usar]
    GameCanvas.tsx           monta y destruye Phaser
    game/
      GameShell.tsx          decide qué pantalla toca
      CreacionPersonaje.tsx  nombre, avatar, especialidad
      NodoRunner.tsx         EL INTÉRPRETE. Corazón del juego.
      Hud.tsx                nivel, XP, impulso, expediente, stats
      puestos.ts             qué personaje se sienta dónde
  engine/rpg/
    bootstrap.ts             crea la instancia de Phaser
    CourtroomScene.ts        la sala: mobiliario, actores, cámara
  lib/rpg/
    bus.ts                   React → Phaser, cinco eventos, un solo sentido
    scoring.ts               XP, nivel, impulso, combo (puro, testeado)
    save.ts                  versión y migración del guardado (puro, testeado)
    characterArt.ts          resuelve retrato: horneado o procedural  [DONADO]
    art/*.mjs                motor de dibujo procedural                [DONADO]
  state/rpg/useAudaces.ts    store Zustand con persist
  hooks/rpg/*.ts             animación de sprites, manifiesto           [DONADO]

scripts/
  rpg-art/bake.mjs           hornea el arte a PNG
  rpg-art/png.mjs            codificador PNG sin dependencias
  standalone/                versión de un solo archivo

public/rpg/characters/       arte horneado + manifest.json
docs/juegos/ley-de-los-audaces/                    esta documentación
```

**[DONADO]** = llegó como paquete cerrado del autor, hecho en una sesión
anterior. Funciona. No lo reescribas para silenciar un aviso de lint.

### Quién puede tocar qué

El proyecto se desarrolla desde más de una sesión en paralelo. El límite no es
un acuerdo, es la arquitectura:

| Carpeta | Rama |
|---|---|
| `src/data/rpg/**`, `docs/**`, `public/rpg/characters/**` | `content/…` |
| `src/engine/**`, `src/lib/rpg/**`, `src/state/**`, `src/components/rpg/game/**` | `feature/rpg-…` |

`src/data/rpg/chapters/*.ts` es lo único que conflictúa de verdad:
**un capítulo, un archivo, un dueño a la vez**, declarado en `HANDOFF.md` §5.

---

## 5. La arquitectura en seis reglas

1. **El guion es un dato, no código.** Un capítulo es un objeto con nodos.
   Añadir un capítulo es añadir un archivo en `src/data/rpg/chapters/`.
2. **Ningún componente contiene una línea de diálogo.** Si estás editando prosa
   dentro de un `.tsx`, el dato está en el lugar equivocado.
3. **Ninguna lógica nombra un archivo.** Las rutas de assets existen sólo en
   `src/lib/rpg/art/asset-paths.mjs`.
4. **La escena Phaser no lee el estado.** Recibe cinco órdenes por `bus.ts`:
   `enfocar`, `hablar`, `acierto`, `fallo`, `escanear`. No devuelve nada.
5. **El juego sobrevive sin canvas.** Texto, decisiones y HUD son React. Si
   Phaser no monta, se sigue jugando.
6. **Phaser se importa dinámicamente.** Nunca en el servidor, nunca en una ruta
   que no sea el juego, y se destruye al desmontar.

---

## 6. Lo que está HECHO

### 6.1 Base técnica

Next.js 16.3.3 (App Router, Turbopack) · React 19.1.1 · TypeScript estricto ·
Tailwind v4 · Zustand 5 · Phaser 3.90 · Vitest. Node fijado en `22.x`.
Sin backend, sin base de datos, sin servicios externos.

`npm run verify` = typecheck + lint + tests + build. **Verde.**

### 6.2 El Capítulo 0

Trece nodos, en este orden: apertura del tribunal → la socia desde el público →
alegato de la fiscalía → **decisión** de apertura → declaración de la testigo →
**ANALIZAR** → **contrainterrogatorio** → **presentar prueba** → intervención del
querellante → **decisión** sobre el documento → síntesis de EVA → **alegato
final** → veredicto y epílogo.

Cinco decisiones con consecuencia real. Termina en absolución y en el mensaje
`NO DEBISTE GANAR ESE JUICIO`, que es el gancho del Capítulo 1.

El caso es penal y ficticio: se acusa a Marta Quiroga de alterar un anexo
contractual. Se gana demostrando que la hora declarada por la testigo choca con
la bitácora de accesos, y que los metadatos del documento apuntan al equipo del
querellante.

### 6.3 Sistemas

- **Seis estadísticas** que suben y bajan en pantalla: argumentación,
  investigación, negociación, estrategia, integridad, prestigio.
- **XP y nivel**, con ocho umbrales.
- **Impulso y combo**: +34 por acierto, mitad al fallar (nunca cero); el combo
  arranca al segundo acierto encadenado y topa en ×4.
- **Expediente**: las piezas se obtienen jugando y se presentan contra
  afirmaciones concretas.
- **Especialidad** con ventaja real: +2 en una estadística que el prólogo usa.
- **Guardado** en `localStorage`, clave `audaces-save`, `saveVersion: 1`, con
  función de migración y tests.

### 6.4 Reparto y arte

Dieciséis personajes. Todo el arte es pixel art original, generado
proceduralmente y horneado a PNG: hojas de 288×288 con celdas de 48 px (filas:
abajo, arriba, izquierda, derecha, hablar, pensar) y retratos de 512×512 en seis
expresiones. Paleta cerrada: tinta, carbón, marfil, burdeos, oro, piedra.

| Rol | Personaje |
|---|---|
| Jugador | Tomás Iriarte · Renata Vergara |
| Socia directora | Sofía Aldana |
| Abogado de la contraria | Ignacio Bravo |
| Clienta | Marta Quiroga |
| Contraparte | Héctor Solís |
| Guía | EVA, con expresión `eva_glitch` ya dibujada |
| Tribunal · fiscalía · testigo | Isabel Achurra · Rodrigo Naveas · Rocío Zapata |
| Ambientales | seis, sin usar todavía |

Los tres últimos del tribunal se añadieron en esta sesión y se hornearon con
`node scripts/rpg-art/bake.mjs`. Todo el reparto lleva `provisionalArt: true`.

### 6.5 Verificación hecha

Recorrido automatizado completo en Chromium sobre la app y sobre el archivo
suelto: portada → creación → nueve líneas de diálogo → cinco decisiones →
alegato → veredicto. Sin errores de consola. Sin peticiones de red externas
salvo la hoja de tipografías.

---

## 7. Lo que FALTA

### 7.1 Que una persona lo juegue — **es el gate, y es lo más importante**

Lo verificado es que **funciona**. Nadie ha comprobado que sea **divertido**, que
es el criterio de salida real del vertical slice.

**Cómo desbloquear.** Que alguien que no lo construyó lo juegue completo sin
instrucciones. Anotar tres cosas: dónde se aburre, dónde se pierde, y si al
terminar quiere saber qué pasa después. Si la respuesta a lo tercero es no, el
problema no lo arregla ningún capítulo nuevo.

**No escribas el Capítulo 1 antes de esto.** Es la regla central del método:
pequeño → jugable → validado → expandido.

### 7.2 Subirlo a GitHub

Ver §8. Es un bloqueo de permisos, no de trabajo.

### 7.3 `docs/juegos/ley-de-los-audaces/VISION.md` está incompleto a propósito

Le falta el encargo original íntegro —63 secciones— pegado tal cual. Hay una
síntesis operativa y el hueco declarado. **No lo rellenes inventando**: pídeselo
al autor, que lo tiene.

### 7.4 Capítulo 1 · La caída

Amenaza, allanamiento, detención. Debe reutilizar el motor **sin añadir
mecánicas nuevas**. Si el Capítulo 1 necesita una mecánica nueva, es señal de que
el slice no validó lo que decía validar.

### 7.5 Audio

No hay nada. Pasos, evidencia, XP, interfaz, alerta, transición, ambiente de
sala. Sólo material original o libre; nada protegido.

### 7.6 Detalles conocidos

- **Marta Quiroga no aparece en la escena.** El guion habla de ella pero su
  sprite no está en la mesa de la defensa. Es una línea en el reparto de
  `GameShell.tsx`.
- **La toga no existe** como prenda en el motor de arte. La presidenta usa traje
  tinta con acento oro: lee como autoridad, no como tribunal.
- **Los flags no se leen.** `apertura_afilada`, `hora_fijada`,
  `contradiccion_probada`, `metadatos_incorporados`, `alegato_perfecto` se
  guardan y nadie los consulta todavía. Son el material para variantes de
  diálogo.
- **Las tres referencias normativas están sin verificar.** Ver §10.
- **El mobiliario de la sala son rectángulos bien puestos.** Funciona, no compite
  con los actores, le falta carácter.
- **Los NPC ambientales están dibujados y sin usar.**

### 7.7 Todo lo demás

Cárcel, tablero de investigación, fuga arcade, mundo exterior, medidor de
búsqueda, disfraces, EVA corrupta, juicio final, finales múltiples. Están
descritos en `VISION.md` y **no son compromiso**.

---

## 8. Bloqueos reales

### El push de la rama

El trabajo está en la rama `feature/juego-audaces` de este repositorio. El
entorno donde se construyó no tiene credenciales para empujarla: el proxy de git
sólo las entrega a repositorios registrados como fuente de la sesión.

**Cómo desbloquear.** Desde una máquina con acceso al repositorio:

```bash
git checkout feature/juego-audaces
npm install
npm run verify        # debe quedar verde
git push -u origin feature/juego-audaces
```

Y PR contra `main`, para que corra el CI del propio repositorio.

---

## 9. Decisiones tomadas

Resumen. El razonamiento completo está en `docs/juegos/ley-de-los-audaces/DECISIONS.md`; léelo antes
de revertir cualquiera de éstas.

| | Decisión |
|---|---|
| D-001 | Repositorio propio, enlazado desde el laboratorio del profesor Aldunate, no alojado dentro de él |
| D-002 | Este RPG reemplaza a la ficha anterior de «La Ley de los Audaces» |
| D-003 | Phaser desde el primer día; React para diálogo, HUD y decisiones |
| D-004 | La paleta vive en tres copias, y está anotado por qué |
| D-005 | El reparto se amplía con tribunal, fiscalía y testigo; no se reinterpreta |
| D-006 | `set-state-in-effect` queda como aviso en el código donado |
| D-007 | En el Capítulo 0 no se puede perder |
| D-008 | El horneado de arte no depende de librerías nativas |

---

## 10. Reglas duras — no son estilo

**No se inventa Derecho.** Ni artículos, ni sentencias, ni roles, ni
jurisprudencia. Toda referencia vive en `src/data/rpg/legalSources.ts` con su
`estado`. Sólo pasa a `VERIFIED` cuando alguien la contrastó contra el texto
oficial y dejó el enlace. Mientras sea `UNVERIFIED`, la interfaz la rotula y el
juego **no la presenta como Derecho vigente**. Hoy las tres están sin verificar,
y así se muestran.

**La ficción es abstracta.** Personajes, empresas, documentos, tribunales y
causas son inventados. La fuga carcelaria y cualquier otro acto ilícito del
guion se resuelven con mecánicas arcade: nada de procedimientos reales de
seguridad, métodos replicables de evasión, vulnerabilidades reales ni planos de
recintos reales.

**No es institucional.** El juego no habla en nombre de ninguna persona ni
organización. La franja de prototipo y `noindex` se mantienen mientras sea alpha.

**EVA ayuda a pensar, no resuelve.** Ninguna intervención suya entrega la
respuesta correcta de un nodo. Es falible por diseño y lo será cada vez más.
Nunca se la vuelve infalible.

---

## 11. Las cinco próximas acciones, en orden

1. **Subir el repositorio.** Sin eso no hay flujo de trabajo.
2. **Conseguir que una persona juegue el Capítulo 0** sin instrucciones, y
   anotar dónde se aburre.
3. **Ajustar el slice** con lo que aparezca. Ritmo y claridad primero.
4. **Aplicar el parche de integración.** Ya está escrito y verificado en
   `docs/juegos/ley-de-los-audaces/integracion-aldunate/`: enlaza el juego desde `/experimentos/juegos`
   del laboratorio, con un interruptor (`AUDACES_URL`) que se enciende cuando
   haya despliegue. Se puede fusionar antes de que el juego esté en línea.
5. **Recién entonces**, el Capítulo 1.

Todo lo demás está en `docs/juegos/ley-de-los-audaces/BACKLOG.md`.

---

## 10 bis. Revisión externa

`docs/juegos/ley-de-los-audaces/misiones/RESPUESTA-A-LA-REVISION.md` recoge los ocho hallazgos de la
revisión previa a publicar y qué se hizo con cada uno. Todos atendidos y
comprobados. Léelo antes de repetir cualquiera de esos errores.

---

## 11 ter. Misiones abiertas

`docs/juegos/ley-de-los-audaces/misiones/` contiene encargos acotados para agentes con credenciales
reales. Hoy hay uno abierto:

- **M-PUBLICACION** — publicar el repositorio, desplegarlo y enlazarlo desde el
  laboratorio. Cero desarrollo de juego. Su prompt listo para pegar está en
  `misiones/PROMPT-CODEX.md` y el informe se escribe con
  `misiones/INFORME-PLANTILLA.md`.

---

## 11 bis. Cómo arrancar la sesión siguiente

`docs/juegos/ley-de-los-audaces/PROMPT-CONTINUAR.md` tiene el texto exacto que hay que pegarle a la IA
que retome: auditar primero, reportar, y recién entonces continuar. Está pensado
para copiarse tal cual.

---

## 12. Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run verify       # typecheck + lint + tests + build  ← antes de cada push
npm run test:watch
npm run standalone   # dist/audaces.html, un archivo, sin red

node scripts/rpg-art/bake.mjs           # hornea lo que falte
node scripts/rpg-art/bake.mjs --all     # rehornea todo
```

Controles del juego: `1`–`5` elegir · `E` o `Espacio` avanzar · `Esc` pausa.

---

## 13. Trampas ya encontradas

No las repitas. Costaron tiempo.

- **`import Phaser from 'phaser'` no funciona.** El build ESM no tiene export por
  defecto. Es `import * as Phaser from 'phaser'`.
- **No toques el store desde dentro de un actualizador de estado de React.**
  React ejecuta ese actualizador durante el render, y actualizar otro componente
  ahí rompe el render ajeno. `NodoRunner` salta al nodo siguiente **fuera** del
  actualizador, y reinicia su estado con `key`, que es la forma idiomática.
- **No guardes una referencia a la escena Phaser.** Pídesela al juego
  (`juego.scene.getScene(...)`), o quedará una escena muerta apuntada tras
  destruir la instancia.
- **Los retratos fotorrealistas de EVA del repo anfitrión pesaban 27 MB.**
  Convertidos a WebP dimensionado, 472 KB. Si vuelves a tocar assets, mira el
  peso antes de commitear.
- **El motor de arte corre en Node y en el navegador sin compilador.** Está en
  `.mjs` a propósito. No lo conviertas a TypeScript.
- **`localStorage` puede lanzar al leerlo**, no sólo al escribir. Por eso el
  guardado pasa por `almacenamientoSeguro()`: si el navegador falla, hay un
  almacén en memoria. Si algo vuelve a leer `localStorage` directo, vuelve el
  «Cargando…» eterno en navegación privada.
- **Un modal no basta para pausar.** Los oyentes de teclado viven en `window` y
  siguen activos por detrás. Hace falta cortar el evento en fase de captura.
- **`npm run verify` no prueba el CI.** Usa `npm install`; el CI usa `npm ci`,
  que rechaza un lock desincronizado. Tras tocar `package.json`, reinstala y
  commitea el lock.
- **Nada de credenciales en `.git/config`.** El repositorio se entrega sin remoto
  configurado, a propósito.

---

## 14. Cómo saber que no rompiste nada

```bash
npm run verify
```

Y después, a mano, `docs/juegos/ley-de-los-audaces/QA.md` entero. Los tests cubren el grafo del
capítulo —destinos rotos, nodos huérfanos, evidencia que se pide antes de poder
obtenerse, huecos del alegato sin respuesta correcta— pero no cubren el ritmo, la
legibilidad de la sala ni si el chiste funciona. Eso se mira jugando.

Ningún milestone avanza si el build falla, si hay errores de consola en una
partida completa, si el guardado no sobrevive a una recarga, o si una referencia
normativa se muestra como vigente sin estar verificada.
