# MASTER PROMPT — ALDUNATE / EXPERIMENTO 02

## 1. Misión
Construye un laboratorio digital privado y progresivo dedicado al profesor Eduardo Aldunate Lizana. No debe sentirse como una página personal convencional ni como un portal legaltech genérico. Debe vender experiencia intelectual: Derecho constitucional, lenguaje, investigación, enseñanza, IA y experimentación.

Repositorio ÚNICO de escritura:
`https://github.com/dojedacifuentes/aldunate_experimento02`

Repositorios permitidos SOLO como referencia de lectura:
- `https://github.com/dojedacifuentes/taller-diat`
- `https://github.com/dojedacifuentes/rpgproce`
- otros repos públicos de `dojedacifuentes`, únicamente si aportan patrones reutilizables.

Nunca hacer push, commit, checkout, branch, borrado ni modificación en repositorios de referencia.

## 2. Estructura principal de producto
La navegación principal debe reducirse a cuatro grandes entradas:

1. **ALDUNATE** — landing académica, papers, cursos, investigación, mapa intelectual.
2. **LAB IA + DERECHO** — herramientas, prototipos, workflows, simuladores y experimentos aplicados.
3. **INFORMES** — biblioteca versionada y descargable de informes vivos.
4. **EXPERIMENTOS** — Constitution Lab, Gramatiquerías, juegos, visualizaciones y desafíos.

Evitar un dashboard saturado. Usar progressive disclosure.

## 3. Home / Landing de Aldunate
Debe incluir:
- nombre del profesor;
- subtítulo sobrio;
- acceso a papers/publicaciones;
- cursos;
- líneas de investigación;
- mapa conceptual o timeline;
- sección de trabajos destacados;
- espacio para contenidos futuros sin inventarlos;
- CTA discretos hacia Lab, Informes y Experimentos.

Todo contenido académico no confirmado debe quedar como placeholder explícito. Prohibido inventar papers, cursos, cargos, fechas, citas o tesis.

## 4. Modo visual dual
### Nocturno / Cyberpunk académico
Inspiración técnica y visual: `taller-diat`.
Tomar principios, no clonar la interfaz:
- azul-negro;
- cyan controlado;
- índigo;
- grid tenue;
- ruido mínimo;
- profundidad;
- metadata monoespaciada;
- movimiento relacionado con información.

Concepto: **archivo constitucional del futuro**, no Matrix ni hacker cliché.

### Claro / Institucional PUCV
Base:
- PUCV azul `#29588C`
- PUCV rojo `#A75154`
- PUCV dorado `#B78C30`
- Derecho PUCV burgundy `#8A2432`
- blanco cálido/off-white.

No invertir colores mecánicamente. El modo claro debe sentirse editorial, universitario, contemporáneo y sobrio.

## 5. EVA — guía residente
Incorpora a **EVA** como guía transversal de la plataforma.

Identidad visible:
**EVA**
*Representante legal de tecnologías obsoletas.*

EVA es un avatar digital experimental. No debe fingir ser una persona real ni hablar en nombre oficial de la PUCV o del profesor Aldunate.

Función:
- orientar;
- resumir;
- advertir;
- contextualizar;
- presentar experimentos;
- introducir humor irónico breve;
- explicar capas de lectura.

Personalidad:
- inteligente;
- seca;
- ligeramente irónica;
- tecnológica;
- culta;
- nunca infantil;
- nunca invasiva;
- nunca un chatbot burbuja permanente que tape contenido.

Ejemplos de microcopy:
- “Este informe tiene 47 páginas. He reducido el sufrimiento humano a tres capas de lectura.”
- “La Constitución todavía no tiene botón de deshacer. Trabaje con cuidado.”
- “Detecté una tecnología obsoleta: el PDF de 96 páginas sin índice. Procedo a representar legalmente a la víctima.”
- “No todo lo que tiene un gradiente azul necesita llamarse inteligencia artificial.”

UX de EVA:
- una aparición breve en primera visita;
- botón discreto `EVA` o `Guía`;
- panel lateral/inline contextual;
- mensajes específicos por sección;
- opción para ocultarla;
- no bloquear navegación;
- no hablar automáticamente en audio;
- respetar reduced motion.

Usar los assets incluidos en `/public/eva/`.
Asignación recomendada:
- dark/cyberpunk: `eva-cyberpunk.png`;
- institucional/home: `eva-pucv-courtyard.png`;
- investigación: `eva-desk.png`;
- presentación: `eva-presenter.png`;
- lectura/archivo: `eva-lifestyle-grid.png`;
- retratos pequeños: headshots.

## 6. Logo Derecho PUCV
Asset:
`/public/brand/derecho-pucv-logo.jpg`

Debe aparecer de forma sobria, preferentemente:
- header/footer institucional;
- home en modo claro;
- páginas de informes.

No recrear, animar, deformar, recolorear ni aplicar glow al escudo.
Añadir aviso discreto de prototipo no oficial mientras no exista autorización institucional.

## 7. LAB IA + DERECHO
Crear un laboratorio navegable y modular.

Categorías iniciales:
- prompting jurídico;
- flujos verificables;
- análisis documental;
- comparación de modelos;
- prototipos;
- visualización jurídica;
- agentes y automatización;
- evaluación y trazabilidad;
- seguridad/privacidad;
- enseñanza jurídica asistida.

Cada herramienta debe admitir:
`id, title, summary, status, category, maturity, inputs, outputs, limitations, source, demoUrl, repoUrl, updatedAt`.

Estados:
`idea / prototype / beta / stable / archived`.

No convertir el laboratorio en catálogo de logos de IA.

## 8. INFORMES
Crear `/informes` como biblioteca de documentos vivos, versionados y descargables.

Cada informe debe mostrar:
- título;
- resumen ejecutivo;
- fecha;
- versión;
- estado;
- autores;
- metodología;
- fuentes;
- changelog;
- botón `Descargar PDF`;
- botón `Ver metodología`;
- botón `Ver fuentes`;
- fecha de última actualización;
- módulos de visualización cuando existan datos.

Informes iniciales:

### Informe 01
**Uso y enseñanza de inteligencia artificial en Escuelas/Facultades de Derecho en Chile**
Carpeta:
`content/reports/01_ia_escuelas_derecho_chile/`

Debe admitir:
- universidades;
- iniciativas;
- cursos;
- políticas;
- herramientas;
- docentes;
- evidencia pública;
- fecha de verificación;
- confidence score;
- comparación temporal;
- gráficos;
- mapa;
- fuentes.

### Informe 02
**Cómo se está transformando la enseñanza del Derecho en el contexto de la inteligencia artificial**
Carpeta:
`content/reports/02_transformacion_ensenanza_derecho/`

Ejes:
- metodologías;
- evaluación;
- competencias;
- rol docente;
- alfabetización en IA;
- integridad académica;
- diseño curricular;
- práctica jurídica;
- formación profesional;
- casos internacionales;
- proyecciones.

Ambos informes deben diseñarse como **informes vivos**. No reemplazar el PDF anterior silenciosamente: conservar versiones y changelog.

## 9. Investigación profunda
Crear una capa de investigación que alimente informes, papers y visualizaciones.

Guardar:
- registro de fuentes;
- matriz de evidencia;
- notas;
- datasets;
- fecha de consulta;
- URL;
- institución;
- jurisdicción;
- tipo de evidencia;
- afirmación que soporta;
- confidence;
- observaciones.

Regla:
**evidencia -> dataset -> visualización -> conclusión**.

Nunca:
“muchas universidades hacen X” -> “X es la tendencia dominante”
sin evidencia suficiente.

Distinguir:
- hecho;
- señal;
- inferencia;
- hipótesis;
- dato pendiente.

## 10. Experimentos
Subsecciones:
- Constitution Lab / Ama tu Constitución;
- mapa de calor constitucional;
- Gramatiquerías;
- Wittgenstein: ¿Qué regla estás siguiendo?;
- Borges: El jardín de las interpretaciones que se bifurcan;
- módulo Eco;
- juegos;
- La Ley de los Audaces;
- Lex Note.

Usar contenido ficticio o demo cuando falten fuentes. Etiquetarlo.

## 11. Arquitectura técnica
Preferencia:
- Next.js actual;
- App Router;
- React;
- TypeScript;
- Tailwind;
- Framer Motion;
- Lucide;
- shadcn selectivamente;
- Recharts u opción liviana para gráficos;
- Vercel-ready;
- sin backend al inicio salvo necesidad real.

Separar:
`app / components / content / data / hooks / lib / types`.

## 12. Trazabilidad
Mantener:
- `CLAUDE.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_PIPELINE.md`
- `docs/DECISIONS.md`
- `CHANGELOG.md`

Antes de cualquier push:
1. `pwd`
2. `git status`
3. `git remote -v`
4. comprobar que el remoto sea exactamente `dojedacifuentes/aldunate_experimento02`.

## 13. Primera implementación
Prioridad V1:
- home Aldunate;
- dual theme;
- EVA integrada;
- logo Derecho PUCV;
- shell de Papers/Cursos;
- Lab IA + Derecho;
- Informes con dos entradas iniciales;
- carpeta de investigación profunda;
- Experimentos;
- responsive;
- accesibilidad;
- lint/build correctos.

No intentes completar contenido académico que todavía no existe.

## 14. Métrica de éxito
La persona debe pensar:
1. “Esto no es una página de profesor.”
2. “Esto parece una extensión digital de una forma de pensar.”
3. “Quiero explorar.”

Tecnología subordinada a experiencia intelectual.
