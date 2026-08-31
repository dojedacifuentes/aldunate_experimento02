# Prompt para la siguiente IA

Copia el bloque completo y pégalo como primer mensaje en la sesión nueva, con la
carpeta del proyecto abierta o el zip descomprimido a mano.

---

```
Vas a continuar el desarrollo de LA LEY DE LOS AUDACES, un RPG jurídico chileno
para navegador. El proyecto ya existe y está a medio camino: NO empieces de cero
y NO propongas rehacer nada hasta haber auditado lo que hay.

FASE 1 — AUDITA ANTES DE ESCRIBIR UNA LÍNEA

Lee, en este orden, y no toques ningún archivo hasta terminar:

  1. docs/juegos/ley-de-los-audaces/CHECKPOINT.md   estado completo. Está escrito para ti.
  2. CLAUDE.md                reglas permanentes. No son estilo: son condiciones.
  3. docs/juegos/ley-de-los-audaces/DECISIONS.md    por qué las cosas son como son. Ocho decisiones
                              registradas. Antes de revertir algo, busca aquí si
                              fue deliberado.
  4. docs/juegos/ley-de-los-audaces/DEVELOPMENT_WORKFLOW.md   milestones y gates.
  5. docs/juegos/ley-de-los-audaces/HANDOFF.md      qué falta y qué lo desbloquea.
  6. docs/juegos/ley-de-los-audaces/BACKLOG.md      pendientes por categoría.

Después inspecciona el código en este orden, que va de lo general a lo concreto:

  src/types/game.ts                       el contrato: nodos, stats, efectos
  src/data/rpg/chapters/prologo.ts        EL GUION del Capítulo 0
  src/components/rpg/game/NodoRunner.tsx  el intérprete del guion
  src/engine/rpg/CourtroomScene.ts        la sala en Phaser
  src/state/rpg/useAudaces.ts             el estado y el guardado
  src/data/rpg/characters.ts              el reparto

Luego levanta el proyecto y compruébalo tú misma:

  npm install
  npm run verify      # typecheck + lint + tests + build. Debe quedar verde.
  npm run dev         # http://localhost:3000

Juega el Capítulo 0 entero antes de opinar. Dura entre 3 y 5 minutos.
Controles: 1-5 elegir, E o Espacio avanzar, Esc pausa.

FASE 2 — REPORTA

Antes de proponer cambios, dime en pocas líneas:

  - qué encontraste construido y qué no;
  - si npm run verify quedó verde;
  - si detectaste algo que el CHECKPOINT no menciona;
  - qué crees que es lo siguiente y por qué.

Si algo del código contradice lo que dice la documentación, dímelo en vez de
elegir por tu cuenta cuál manda.

FASE 3 — CONTINÚA

Las próximas acciones, en orden, están en CHECKPOINT.md §11. La primera no es
código: es conseguir que una persona juegue el Capítulo 0 sin instrucciones y
diga dónde se aburre. Ese es el criterio para seguir.

NO ESCRIBAS EL CAPÍTULO 1 TODAVÍA. El método del proyecto es
pequeño -> jugable -> validado -> expandido, y el slice aún no pasó el paso de
validación.

REGLAS QUE NO SE NEGOCIAN

  - No inventes Derecho. Ni artículos, ni sentencias, ni roles, ni
    jurisprudencia. Toda referencia vive en src/data/rpg/legalSources.ts con su
    estado de verificación, y lo UNVERIFIED se muestra rotulado y nunca como
    Derecho vigente.
  - La ficción es abstracta. Personajes, empresas, documentos y causas son
    inventados. La fuga carcelaria y cualquier acto ilícito se resuelven con
    mecánicas arcade: nada de procedimientos reales de seguridad, métodos
    replicables de evasión ni planos de recintos reales.
  - Esto no es un sitio institucional ni habla por ninguna persona u
    organización. La franja de prototipo y el noindex se quedan.
  - EVA ayuda a pensar, no resuelve. Ninguna intervención suya entrega la
    respuesta correcta de un nodo. Es falible por diseño; nunca la vuelvas
    infalible.
  - El contenido vive en src/data/rpg. Si te ves editando una línea de diálogo
    dentro de un .tsx, el dato está en el lugar equivocado.
  - Ninguna lógica nombra un archivo de asset. Las rutas existen sólo en
    src/lib/rpg/art/asset-paths.mjs.
  - Todo en español de Chile: comentarios, variables, documentación, interfaz.
  - No trabajes en main. Rama, y npm run verify verde antes de cualquier push.
  - Los archivos marcados [DONADO] en el CHECKPOINT llegaron como paquete
    cerrado y funcionan. No los reescribas para silenciar un aviso de lint.

TRAMPAS YA ENCONTRADAS — están en CHECKPOINT.md §13, léelas. Resumen: Phaser se
importa con `import * as Phaser`; no toques el store desde dentro de un
actualizador de estado de React; no guardes una referencia a la escena Phaser;
vigila el peso de los assets antes de commitear.

AL TERMINAR LA SESIÓN

  npm run verify
  y actualiza docs/juegos/ley-de-los-audaces/DEVLOG.md y, si el estado cambió, docs/juegos/ley-de-los-audaces/HANDOFF.md y
  docs/juegos/ley-de-los-audaces/CHECKPOINT.md.

Empieza por la Fase 1. No te saltes la auditoría.
```

---

## Variante corta

Si la sesión nueva ya tiene el repositorio abierto y sólo quieres arrancar:

```
Lee docs/juegos/ley-de-los-audaces/CHECKPOINT.md y CLAUDE.md completos antes de tocar nada. Después
corre npm run verify, juega el Capítulo 0 en npm run dev, y dime qué
encontraste y qué crees que sigue. No escribas el Capítulo 1: el vertical slice
todavía no pasó su gate de validación.
```
