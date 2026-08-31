# CLAUDE.md — reglas permanentes del repositorio

Lee primero, en este orden:

1. `docs/MASTER_PROMPT.md` — el encargo original, íntegro.
2. `docs/ARCHITECTURE.md` — arquitectura de información.
3. `docs/CONTENT_PIPELINE.md` — cómo entra el contenido.
4. `docs/DECISIONS.md` — qué se decidió y por qué.
5. `docs/HANDOFF.md` — estado actual y siguiente paso.

---

## 1. Repositorios

Repositorio de escritura **ÚNICO**:

```
dojedacifuentes/aldunate_experimento02
```

Solo lectura, jamás escritura:

- `dojedacifuentes/taller-diat`
- `dojedacifuentes/rpgproce`
- cualquier otro repositorio público de `dojedacifuentes`

Nunca hacer `push`, `commit`, `checkout`, `branch`, borrado ni modificación en
repositorios de referencia. Se clonan aparte, fuera de este árbol, y se leen.

**Antes de cualquier push, verificar en este orden:**

```bash
pwd
git status
git remote -v   # debe ser exactamente dojedacifuentes/aldunate_experimento02
```

---

## 2. Regla dura de contenido

**No se inventa información académica sobre Eduardo Aldunate Lizana.**

Prohibido generar, inferir, completar o "poner de muestra":

- papers, libros, capítulos o artículos;
- cursos, programas o asignaturas;
- cargos, afiliaciones o trayectoria;
- fechas, citas, coautorías o tesis.

Un título plausible puesto como ejemplo sobrevive al ejemplo: termina citado en
la nota al pie de alguien. Si falta contenido, se declara con `PendingBlock` y
se registra en `pendingContent` (`src/data/aldunate.ts`).

Los ejes temáticos de `researchLines` describen **el alcance del laboratorio**,
no una atribución de obra ni de posición doctrinaria. No convertirlos en
biografía.

---

## 3. Regla dura institucional

Este sitio **no es** un sitio oficial de la PUCV ni de su Escuela de Derecho, y
**no habla** en nombre del profesor Aldunate.

- La franja de prototipo del layout raíz no se quita.
- `robots: { index: false }` se mantiene mientras no exista autorización.
- El escudo (`/public/brand/derecho-pucv-logo.jpg`) no se recolorea, anima,
  deforma ni recibe glow. Se usa a través de `<InstitutionalMark>` y nada más.
- El aviso de uso pendiente de autorización vive en el footer y se conserva.

---

## 4. EVA

**EVA — Representante legal de tecnologías obsoletas.**

Es un personaje digital experimental. No finge ser una persona real, no
representa a la PUCV, no habla por el profesor y no emite opinión jurídica.

Comportamiento obligatorio (implementado en `EvaProvider`):

- habla cuando **cambia la ruta**, nunca por temporizador;
- una sola aparición automática, en la primera visita;
- se puede silenciar y el silencio persiste;
- no bloquea la navegación: sin overlay, sin foco atrapado;
- se cierra con `Escape`;
- sin audio automático;
- respeta `prefers-reduced-motion`.

Tono: inteligente, seco, ligeramente irónico, culto. Nunca infantil, nunca
invasivo, nunca un chatbot burbuja permanente.

Los mensajes viven en `src/data/eva.ts`, anclados a ruta. Añadir un mensaje es
añadir un objeto, no tocar un componente.

---

## 5. Modo visual dual

| | Nocturno (por defecto) | Institucional |
|---|---|---|
| Concepto | Archivo constitucional del futuro | Editorial universitario |
| Base | Azul-negro `oklch(0.07 0.015 250)` | Off-white cálido `#FAF8F3` |
| Acción | Cian contenido | PUCV azul `#29588C` |
| Acento | Índigo | Derecho burgundy `#8A2432` |
| Glow | Sí, contenido | **No** |
| Grano | Sí, mínimo | No |

No invertir colores mecánicamente. El modo claro no es el oscuro con los
valores dados vuelta: es una atmósfera distinta que comparte estructura.

Los tokens viven en `src/app/globals.css`. Las utilidades de ambiente
(`grid-bg`, `surface`, `glow`, `noise`) leen variables de tema, de modo que una
sola clase rinde dos lecturas. **No hardcodear colores en componentes.**

Ni Matrix ni estética hacker. El cian es contenido, no neón.

---

## 6. Arquitectura

```
src/app/         rutas (App Router)
src/components/  presentación — common · layout · theme · eva · lab · experiments
src/data/        contenido tipado — la fuente de verdad editorial
src/lib/         utilidades puras
src/types/       tipos del dominio
content/         material de investigación e informes (fuera del bundle)
docs/            trazabilidad del proyecto
tools/           cadena de producción de informes (fuera del bundle)
```

**El contenido nunca se incrusta en un componente visual.** Vive en `src/data`
como datos tipados. Un componente que contiene un párrafo de contenido es un
componente que habrá que editar para corregir una fecha.

Stack: Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind v4 ·
Framer Motion · Lucide. Sin backend mientras no haya necesidad real.

---

## 7. Trazabilidad de la investigación

Cadena obligatoria, sin saltarse eslabones:

```
fuente → evidencia → dato → visualización → conclusión
```

Cinco niveles, nunca dos: `FACT` · `SIGNAL` · `INFERENCE` · `HYPOTHESIS` ·
`PENDING`.

Prohibido el salto: «varias universidades hacen X» no autoriza «X es la
tendencia dominante».

La ausencia de evidencia pública se registra como ausencia, y se distingue de
la evidencia de ausencia.

Todo dato lleva `last_verified`.

**No poblar `sources` ni `claims` con datos de ejemplo.** Una matriz de
evidencia con relleno es peor que una vacía: la vacía es honesta.

---

## 8. Informes vivos

Una versión publicada **nunca se sobrescribe**. Se agrega una entrada a
`versions` con su `changelog`. El botón de descarga solo aparece si el archivo
existe: un botón que promete un PDF inexistente es peor que no tener botón. Lo
mismo vale para `html`, la versión web del documento.

### La cadena de producción

Los informes **no se redactan en Word**. El texto vive en archivos `.json` y el
Word, el PDF y la web se generan desde ahí, de modo que las tres versiones no
pueden divergir. La maquinaria está en `tools/informes/` y el método en
`docs/informes/`, siete documentos que explican investigación, diseño, motor de
gráficos, generador de Word, modelo de contenido, reproducción y el puente con
`src/data`.

Reglas propias de esa cadena:

- **Figuras y tablas no llevan número escrito.** Se numeran solas por orden de
  aparición. Escribir el número a mano reintroduce el error que esto resuelve.
- **Una figura sin `fuente` no se publica.** El campo es obligatorio por diseño.
- Los `.ps1` se guardan en **UTF-8 con BOM**: PowerShell 5.1 los lee como ANSI
  si falta, y los acentos se corrompen en silencio. `tools/informes/motor/utf8bom.ps1`.
- Para arrancar un informe nuevo se copia `tools/informes/plantilla-informe-nuevo/`.
  No se empieza de cero ni se clona el informe 02.

La skill `informe-vivo` (`.claude/skills/`) encapsula el flujo entero y se activa
sola cuando se pide crear, ampliar o publicar un informe. Cubre además el caso de
fundir varios documentos de investigación en uno solo, que es donde más se pierde
trazabilidad si se aborda como una suma de capítulos.

Publicar una versión son cinco pasos y están en
`docs/informes/07-puente-con-el-sitio.md`. El paso que más se olvida es el
último: comprobar que no queda ningún `source_id` ni `claim_id` huérfano, porque
la interfaz filtra los `undefined` y una fuente mal enlazada desaparece sin
avisar.

---

## 9. Prioridades

1. contenido
2. claridad
3. interacción
4. estética
5. efectos

En ese orden. Un efecto que compite con la lectura se quita.

---

## 10. El juego: La Ley de los Audaces

El laboratorio aloja un RPG jurídico jugable en
`/experimentos/juegos/ley-de-los-audaces`. Su documentación completa —estado,
decisiones, dirección de arte, QA, encargos a agentes— vive en
`docs/juegos/ley-de-los-audaces/`. **Empieza por `CHECKPOINT.md`.**

Reglas propias que se suman a las de este archivo:

- **Todo el contenido del juego vive en `src/data/rpg/`.** Un capítulo es un
  archivo de datos; el intérprete no conoce el guion. Si estás editando una línea
  de diálogo dentro de un `.tsx`, el dato está en el lugar equivocado.
- **No se inventa Derecho.** Las referencias viven en
  `src/data/rpg/legalSources.ts` con su estado de verificación. Lo `UNVERIFIED`
  se muestra rotulado y **nunca** como Derecho vigente. Es la misma regla de
  trazabilidad del resto del sitio, aplicada a la ficción.
- **La ficción se mantiene abstracta.** Personajes, empresas, documentos, causas
  y recintos son inventados. La fuga carcelaria y cualquier acto ilícito se
  resuelven con mecánicas arcade: nada de procedimientos reales de seguridad ni
  métodos replicables.
- **El juego no habla por nadie.** Ni por la Escuela, ni por la Universidad, ni
  por el profesor. La ficha lo declara antes de dejar jugar. Ver D-020.
- **Phaser se importa dinámicamente** y sólo desde `GameCanvas`. No entra en el
  bundle de ninguna otra ruta ni se ejecuta en el servidor, y se destruye al
  desmontar. Está comprobado: ninguna otra página del sitio lo carga.
- **El juego vive en `.cabina-audaces`**, que declara sus propios tokens. Ni uno
  se escapa al resto del sitio, y el juego se ve igual en ambos temas.
- **El código donado** —`src/components/rpg/*.tsx`, `src/hooks/rpg/*.ts`,
  `src/lib/rpg/art/*.mjs`— llegó como paquete cerrado y funciona. No se reescribe
  para silenciar avisos de lint; los ocho actuales están justificados.

---

## 11. Antes de cerrar cualquier sesión de trabajo

```bash
npm run verify   # typecheck + lint + tests + build
```

Actualizar `CHANGELOG.md` y, si el estado cambió, `docs/HANDOFF.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
