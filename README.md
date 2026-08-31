# ALDUNATE · Experimento 02

Laboratorio digital experimental dedicado al trabajo del profesor **Eduardo
Aldunate Lizana**: Derecho constitucional, lenguaje jurídico, interpretación,
investigación, enseñanza e inteligencia artificial.

> **Prototipo académico experimental.** No constituye un sitio oficial de la
> Pontificia Universidad Católica de Valparaíso ni de su Escuela de Derecho, y
> no habla en nombre del profesor Aldunate.

---

## Qué es

No es una página personal ni un portal legaltech. Es un espacio de trabajo
abierto, organizado en cuatro entradas y una capa de método:

| | Ruta | Qué hay |
|---|---|---|
| 01 | `/aldunate` | Perfil intelectual, mapa de líneas, publicaciones, cursos |
| 02 | `/laboratorio` | Herramientas y prototipos de IA + Derecho |
| 03 | `/informes` | Biblioteca de informes vivos, versionados |
| 04 | `/experimentos` | Constitution Lab, Gramatiquerías, juegos |
| 05 | `/investigacion` | Registro de fuentes, matriz de evidencia, método |

Contenido académico no confirmado aparece como **hueco declarado**, nunca
completado por inferencia. Ver `CLAUDE.md`, sección 2.

---

## Modo visual dual

- **Nocturno** (por defecto) — *archivo constitucional del futuro*: azul-negro,
  cian contenido, índigo, retícula tenue, metadata monoespaciada.
- **Institucional** — editorial universitario con la paleta PUCV: azul
  `#29588C`, rojo `#A75154`, dorado `#B78C30`, burgundy de Derecho `#8A2432`
  sobre off-white cálido.

El conmutador vive en el header. La preferencia persiste y no parpadea al
cargar.

---

## EVA

**EVA — Representante legal de tecnologías obsoletas.**

Guía residente del laboratorio: orienta, resume, advierte y contextualiza.
Habla cuando cambia la sección, aparece sola una única vez y se puede silenciar
de forma permanente. Es un personaje digital experimental, no una persona.

---

## Desarrollo

Requiere Node.js 22.x.

```bash
npm install
npm run dev
```

Verificación completa antes de publicar:

```bash
npm run verify
```

(`typecheck` + `lint` + `build`)

---

## Estructura

```
src/app/         rutas (App Router)
src/components/  common · layout · theme · eva · lab · experiments
src/data/        contenido tipado — fuente de verdad editorial
src/lib/         utilidades puras
src/types/       tipos del dominio
content/         investigación e informes (fuera del bundle)
docs/            trazabilidad del proyecto
tools/informes/  cadena de producción de informes (fuera del bundle)
public/descargas/ documentos publicados en PDF y HTML
public/eva/      retratos de EVA
public/brand/    escudo Escuela de Derecho PUCV
```

Stack: Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion ·
Lucide. Sin backend.

---

## Documentación

| Archivo | Contenido |
|---|---|
| `CLAUDE.md` | Reglas permanentes. Leer antes de tocar nada. |
| `docs/MASTER_PROMPT.md` | Encargo original íntegro |
| `docs/ARCHITECTURE.md` | Arquitectura de información |
| `docs/CONTENT_PIPELINE.md` | Cómo entra el contenido |
| `docs/DECISIONS.md` | Decisiones tomadas y sus razones |
| `docs/HANDOFF.md` | Estado actual y siguiente paso |
| `docs/informes/` | El método de los informes en siete documentos: investigación, diseño, motor de gráficos, generador de Word, modelo de contenido, reproducción y puente con el sitio |
| `tools/informes/README.md` | La maquinaria: cómo compilar un informe y cómo arrancar uno nuevo |
| `.claude/skills/informe-vivo/` | Skill que encapsula el flujo completo. Se activa sola cuando se pide crear, ampliar o publicar un informe |
| `CHANGELOG.md` | Historial de versiones |

---

## Cómo se producen los informes

El texto no vive en el Word: vive en archivos `.json`, y el Word, el PDF y la web
se **generan** desde ahí. Las tres versiones no pueden divergir porque no hay
copia que quede desactualizada.

```
contenido-*.json  ──┬──►  Build-Informe.ps1   ──►  .docx  ──(Word)──►  .pdf
   fuente única     │
                    └──►  Build-Artifact.ps1  ──►  .html

Graficos.ps1  ──►  ChartEngine.ps1  ──►  figuras/      (impresión, ×2,5)
                                    └──►  figuras-web/ (web, ×1,55)
```

Requiere Windows con PowerShell 5.1 y Word. Sin Python, sin Node, sin
dependencias externas. Para arrancar un informe nuevo se copia
`tools/informes/plantilla-informe-nuevo/`; el informe 02 completo está en
`tools/informes/informe-02/` como ejemplo funcionando.

---

## Aviso sobre el escudo institucional

El escudo de la Escuela de Derecho PUCV se muestra como referencia del contexto
académico del proyecto. No se recolorea, anima ni deforma. Su uso está
**pendiente de autorización formal**.
