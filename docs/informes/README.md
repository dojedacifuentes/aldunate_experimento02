# docs/informes — el método, documentado

Cómo se investiga, se escribe y se publica un informe de este proyecto. Escrito
para que cualquiera —una persona nueva en el equipo o un asistente de IA que
retome el trabajo— pueda reconstruir lo que se hizo sin haber estado presente.

La maquinaria vive en [`tools/informes/`](../../tools/informes/). Esto explica
cómo funciona y por qué está hecha así.

---

## Los siete documentos

| | Documento | Responde a |
|---|---|---|
| **01** | [Metodología de investigación](01-metodologia.md) | Cómo se recopila y clasifica la evidencia. Jerarquía de fuentes, niveles demostrativos, estados epistemológicos y las cinco reglas de rigor |
| **02** | [Sistema de diseño](02-sistema-de-diseno.md) | Paleta, tipografía, retícula, temas y las etiquetas epistémicas como elemento visual |
| **03** | [Motor de gráficos](03-motor-de-graficos.md) | Cómo se dibujan las figuras por código, los diez tipos disponibles y el formato de especificación |
| **04** | [Generador de Word](04-generador-docx.md) | Cómo se escribe un `.docx` a mano como paquete OOXML |
| **05** | [Modelo de contenido](05-modelo-de-contenido.md) | El esquema de bloques, el orden de archivos y cómo insertar un capítulo |
| **06** | [Guía de reproducción](06-reproducir.md) | Paso a paso, requisitos, trampas del entorno y verificaciones |
| **07** | [Puente con el sitio](07-puente-con-el-sitio.md) | Cómo un informe compilado termina publicado aquí, y cómo se traduce su evidencia a `src/data/research.ts` |

---

## Por dónde empezar según lo que vengas a hacer

**Escribir o corregir contenido de un informe** → 05, y 07 si vas a publicarlo.

**Añadir o cambiar una figura** → 03.

**Entender por qué una afirmación está clasificada como está** → 01.

**Cambiar colores o tipografía** → 02. Ojo: la paleta está definida en tres
lugares —motor de gráficos, maquetas web y generador de Word— y hay que
actualizarlos juntos. Es la única duplicación deliberada del sistema.

**Reproducir todo desde cero** → 06.

---

## Las tres ideas que sostienen el método

**1 · Existir no es implementar; implementar no es adoptar; adoptar no es
funcionar.** Cada hallazgo lleva declarado qué prueba realmente. La mayor parte
de lo que se publica sobre IA en educación demuestra únicamente que algo existe.

**2 · El texto no vive en el Word.** Vive en archivos `.json`, y el Word, el PDF
y la web se generan desde ahí. Es lo que impide que las tres versiones se
contradigan.

**3 · La ausencia de evidencia se registra.** No encontrar algo no prueba que no
exista, y decirlo explícitamente es información. Los huecos declarados son parte
del resultado, no una carencia de él.
