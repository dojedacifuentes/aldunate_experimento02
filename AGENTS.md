# Reglas para agentes de código

Este repositorio es el **laboratorio digital de Eduardo Aldunate Lizana**:
prototipo académico, no oficial. Aloja además un RPG jurídico jugable.

**Lee `CLAUDE.md` completo antes de tocar nada.** Aplica a cualquier agente, no
sólo a Claude: contiene dos reglas duras —no inventar contenido académico, no
presentar el sitio como oficial— cuyo incumplimiento no es un problema de estilo.

Después:

- `docs/DECISIONS.md` — por qué las cosas son como son. Antes de revertir algo,
  comprueba si fue deliberado.
- `docs/HANDOFF.md` — estado del sitio y siguiente paso.
- `docs/juegos/ley-de-los-audaces/CHECKPOINT.md` — estado del juego, si vas a
  trabajar en él. Ahí están también sus encargos, en `misiones/`.

## Comandos

```bash
npm install
npm run dev            # http://localhost:3000
npm run verify         # typecheck + lint + tests + build ← antes de cualquier push
npm run juego:arte     # hornea el arte del juego que falte
npm run juego:suelto   # el juego en un solo archivo, sin red
```

Node 22.x. Sin backend, sin base de datos, sin servicios de pago.

## Lo que más se rompe

- No trabajes en `main`. Rama, `verify` verde, PR.
- El contenido vive en `src/data/`, nunca dentro de un componente visual.
- Nada de colores hardcodeados: tokens de `globals.css`, o los de la cabina del
  juego si estás dentro de ella.
- Clases de Tailwind completas, nunca construidas en tiempo de ejecución.
- No reescribas el código donado del juego para silenciar avisos de lint.
- `import Phaser from 'phaser'` no funciona: el build ESM no tiene export por
  defecto. Es `import * as Phaser`.

## Al cerrar

`npm run verify`, actualiza `CHANGELOG.md` y, si el estado cambió,
`docs/HANDOFF.md` y —para el juego— `docs/juegos/ley-de-los-audaces/DEVLOG.md`.
