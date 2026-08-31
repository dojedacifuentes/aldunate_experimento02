# Prompt para Codex — misión PUBLICACIÓN

Pega esto como primer mensaje, con el repositorio del juego abierto.

---

```
Trabajas sobre LA LEY DE LOS AUDACES, un RPG jurídico chileno para navegador que
YA EXISTE y está construido. Tu misión NO es programar el juego: es publicarlo.

PASO 0 — UBÍCATE. Lee, en este orden y sin modificar nada:
  AGENTS.md
  docs/juegos/ley-de-los-audaces/CHECKPOINT.md          estado completo del proyecto
  docs/juegos/ley-de-los-audaces/misiones/M-PUBLICACION.md   tu misión, con las tareas T1 a T5

Esa misión manda sobre tu criterio. No amplíes el alcance.

PASO 1 — EJECUTA T1 a T4 en orden. Resumido:
  T1  npm install && npm run verify   -> debe quedar verde (0 errores,
      8 avisos conocidos). Si no lo está, detente y repórtalo.
  T2  publica el repositorio en https://github.com/dojedacifuentes/ley-de-los-audaces
      Confirma antes que está vacío con git ls-remote. Nunca --force.
      Comprueba que GitHub Actions quede verde.
  T3  despliega en Vercel (Node 22, sin variables de entorno) y juega el
      Capítulo 0 entero en el sitio desplegado para confirmar que funciona.
  T4  aplica docs/juegos/ley-de-los-audaces/integracion-aldunate/enlace-audaces.patch sobre una rama
      de dojedacifuentes/aldunate_experimento02, corre su npm run verify, y abre
      un PR. Ese repositorio es de SÓLO LECTURA: rama y PR, nunca push a main.
      No fusiones el PR.

PASO 2 — INFORMA. Escribe el informe siguiendo
docs/juegos/ley-de-los-audaces/misiones/INFORME-PLANTILLA.md, guárdalo como
docs/juegos/ley-de-los-audaces/misiones/INFORME-<AAAA-MM-DD>.md, y devuélvemelo también en el chat.
Actualiza docs/juegos/ley-de-los-audaces/DEVLOG.md y, donde el estado cambió, HANDOFF.md y
CHECKPOINT.md.

FUERA DE ALCANCE, aunque te parezca mejora: escribir capítulos o contenido,
cambiar mecánicas, guion, reparto o arte, reescribir el código donado para
silenciar avisos de lint, refactorizar lo que funciona, tocar main de cualquiera
de los dos repositorios, añadir dependencias. Si ves algo que crees que debería
cambiar, anótalo en el informe y sigue.

REGLAS DEL PROYECTO que aplican pase lo que pase: no inventes Derecho —las
referencias normativas viven en src/data/rpg/legalSources.ts con su estado de
verificación—; la ficción se mantiene abstracta; esto no es un sitio
institucional; todo en español de Chile; npm run verify verde antes de cualquier
push.

Si algo te bloquea, no lo rodees: documenta el mensaje literal del error en el
informe y sigue con las tareas que no dependan de eso.

Empieza por el paso 0.
```

---

## Nota sobre el informe

El informe no es un resumen amable: es el documento con el que otra persona
decide qué hacer después. Un bloqueo descrito como pendiente hace perder un día a
quien lo lea. Si algo falló, tiene que decir qué falló, con el mensaje literal, y
en qué punto exacto quedó.
