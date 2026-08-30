# HANDOFF — estado del proyecto

**Última actualización:** 2026-08-30 · versión `0.3.0`

Documento para que cualquier persona o agente retome el trabajo sin haber estado
en la sesión anterior. Se actualiza al cerrar cada sesión.

**Producción:** `https://aldunateexperimento02.vercel.app`

---

## 1. Antes de tocar nada

```bash
pwd
git status
git remote -v   # DEBE decir dojedacifuentes/aldunate_experimento02
```

Leer `CLAUDE.md` completo. Contiene dos reglas duras —no inventar contenido
académico, no presentar el sitio como oficial PUCV— cuyo incumplimiento no es
un bug de estilo.

Node.js 22.x.

```bash
npm install
npm run dev      # http://localhost:3000
npm run verify   # typecheck + lint + build
```

---

## 2. Qué está hecho

**Todo lo estructural de la V1.** Rutas prerenderizadas, build limpio, sin
errores de consola, ambos temas funcionando, EVA operativa y cinco
experimentos interactivos que funcionan de verdad.

| Área | Estado |
|---|---|
| Base Next.js 16 / React 19 / TS / Tailwind v4 | ✅ |
| Node 22.x fijado para Vercel | ✅ |
| Auditoría npm: 0 vulnerabilidades | ✅ |
| Verificación automática en GitHub Actions | ✅ |
| Tema dual nocturno + institucional PUCV | ✅ |
| EVA (12 mensajes, anclada a ruta, silenciable) | ✅ |
| Escudo Derecho PUCV vía `<InstitutionalMark>` | ✅ |
| Franja de prototipo + `noindex` | ✅ |
| `/` portal | ✅ |
| `/aldunate` + papers + cursos (shells) | ✅ |
| `/laboratorio` (8 fichas, filtros) | ✅ |
| `/informes` + `/informes/[slug]` (3 capas) | ✅ |
| `/experimentos` + 3 familias | ✅ |
| Constitution Lab · onda expansiva (interactivo) | ✅ |
| Ama tu Constitución (interactivo) | ✅ |
| Gramatiquerías · ambigüedad (interactivo) | ✅ |
| Wittgenstein · seguir una regla (interactivo) | ✅ |
| Borges · jardín de interpretaciones (interactivo) | ✅ |
| `/investigacion` (método + esquemas) | ✅ |
| Responsive, accesibilidad, reduced-motion | ✅ |
| Documentación de trazabilidad | ✅ |

---

## 3. Qué NO está hecho, y por qué

Nada de esto es un olvido. Cada punto está vacío por decisión registrada.

### 3.1 Contenido académico — bloqueado por verificación

`src/data/aldunate.ts`

- `publications: []` — **no inventar**. Requiere título exacto, año, sede y
  enlace o referencia de respaldo por entrada.
- `courses: []` — **no inventar**. Requiere institución y período confirmados.
- `profile` no tiene biografía, cargos ni afiliación.
- `pendingContent` lista los cinco huecos y qué necesita cada uno.

**Cómo desbloquear.** El usuario aportará el material. Cargar en
`content/aldunate/papers/` y `content/aldunate/courses/`, luego poblar los
arreglos tipados. Las vistas de listado ya existen y se activan solas.

### 3.2 Investigación — registros vacíos

`src/data/research.ts` · `content/research/*.csv`

- `sources: []` y `claims: []`.
- **No poblar con ejemplos.** Ver `docs/DECISIONS.md` D-012.

**Cómo desbloquear.** Cargar fuentes reales siguiendo `sourceSchema`, con
`accessed_date` y `confidence`. Los contadores de `/investigacion` y el bloque
de fuentes de cada informe se activan solos.

### 3.3 Informes — sin hallazgos ni PDF

`src/data/reports.ts`

Ambos informes tienen alcance, ejes, metodología, límites y preguntas abiertas.
No tienen conclusiones ni archivo descargable.

**Cómo desbloquear.**
1. Investigar y poblar `sources` / `claims`.
2. Redactar en `content/reports/<carpeta>/drafts/`.
3. Publicar el PDF en `public/informes/<slug>/v0.2/` y apuntar `pdf` en la
   nueva entrada de `versions`.
4. **Agregar** una versión, nunca editar una publicada. Escribir su
   `changelog`.

El botón de descarga aparece solo cuando `pdf` existe.

### 3.4 Experimentos declarados como idea

Cuatro piezas con estado `idea`: mapa de calor constitucional, Eco,
La Ley de los Audaces y Lex Note.

Los requisitos de las dos últimas están publicados en
`/experimentos/juegos`. El mapa de calor necesita primero un corpus normativo
segmentado y un criterio publicado de qué se mide.

### 3.5 Autorización institucional

`robots: noindex` y la franja de prototipo se mantienen hasta que exista
autorización formal para el uso del escudo y la referencia a la PUCV. Revisar
`docs/DECISIONS.md` D-006 y D-007 antes de cambiarlo.

### 3.6 PR #1 · cerrado sin fusionar (resuelto)

El bot de Vercel abrió `vercel/react-server-components-cve-vu-ajyqgj`
proponiendo Next.js `15.5.9`. Hora y media después, `1199fbf` llevó `main` a
`16.3.3` —versión mayor posterior, también parcheada—, de modo que fusionarlo
habría sido un **retroceso** sin ganancia de seguridad.

Cerrado el 30-08-2026 sin fusionar, con el motivo comentado en el propio PR.
La rama remota sigue existiendo; puede borrarse cuando se quiera.
No reabrir: la vulnerabilidad se resolvió por otra vía en `1199fbf`.

---

## 4. Siguiente paso recomendado

En este orden:

1. **Cargar contenido académico verificado** en cuanto llegue. Es lo que
   convierte el andamiaje en laboratorio. Empezar por publicaciones: es el
   catálogo del que dependen «trabajos destacados» y la línea de tiempo.
2. **Primeras fuentes de investigación** para el Informe 01. Bastan diez
   universidades con evidencia pública para que la matriz deje de estar vacía y
   los gráficos tengan de qué alimentarse.
3. **Visualizaciones de informe** una vez haya dataset. Instalar una librería de
   gráficos solo cuando exista información real que visualizar; `recharts` se
   retiró mientras no se usa para reducir superficie de dependencias.
4. **Timeline / mapa conceptual** en `/aldunate`, construido desde el catálogo
   verificado y no al revés.
5. **Command menu** (`⌘K`) cuando haya suficiente contenido que buscar. Hoy
   sería un buscador sobre un catálogo todavía pequeño.

---

## 5. Convenciones que conviene no romper

- **El contenido vive en `src/data`.** Si estás editando un párrafo dentro de un
  `.tsx` de una página, probablemente el dato debería estar en `data`.
- **Nada de colores hardcodeados.** Usar tokens de `globals.css`. Un
  `text-cyan-400` suelto rompe el modo claro sin avisar.
- **Clases de Tailwind completas, nunca construidas en runtime.** Tailwind
  extrae del código fuente; `` `text-${tone}` `` no llega a la hoja de estilos.
  Ver los mapas `toneClasses` en `src/components/common/ui.tsx`.
- **Todo contenido de demostración se rotula.** `demoContent: true` produce una
  etiqueta visible.
- **EVA no habla por temporizador.** Añadir mensajes a `src/data/eva.ts`,
  anclados a ruta.

---

## 6. Entorno de esta máquina

Node.js no está instalado en el sistema. Se usó una copia portable en el
scratchpad de la sesión:

```
node-v22.20.0-win-x64/
```

Para retomar en este equipo: instalar Node 22.x de forma permanente, o volver
a descargar el zip portable desde `nodejs.org/dist`. No hay `winget` ni `gh`
CLI disponibles.
