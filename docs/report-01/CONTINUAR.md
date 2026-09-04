# Prompt de continuación — Informe 01

**Copia el bloque de abajo entero en una ventana nueva de Claude Code**, abierta
con el directorio en `C:\Users\Asus\Desktop\aldunate_experimento02`.

La skill `informe-vivo` sólo existe si la sesión se abre **en este repositorio**.
Si trabajas desde la carpeta donde viven los documentos de investigación, la
skill no se cargará por mucho que el encargo encaje: abre la sesión aquí y lee el
material de fuera por ruta absoluta.

---

```
Continúas el Informe 01 de dojedacifuentes/aldunate_experimento02.

Repositorio local: C:\Users\Asus\Desktop\aldunate_experimento02

NO empiezas de cero. NO hagas reset, clean ni descartes cambios locales.

## 1 · Recupera el estado

git fetch origin && git status && git log --oneline --decorate -8
cat docs/report-01/progress.json
sed -n '1,140p' docs/report-01/HANDOFF.md

El HANDOFF es la fuente de verdad del estado. Léelo entero antes de tocar nada,
y lee además CLAUDE.md, que tiene reglas duras que no son negociables:
no se inventa información académica, el sitio no habla por la PUCV ni por nadie,
y una versión publicada nunca se sobrescribe.

## 2 · Dónde está todo

La v0.8.0 está fusionada en main y publicada en producción:
https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile

El documento descargable —índice, doce figuras, anexos— está en
public/descargas/informe-01-borrador-academico-v0.8.0/

Los datos canónicos son los seis CSV de
content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/
y de ahí salen la web, el HTML, el Markdown y el PDF. Nada se escribe a mano
en dos sitios: src/data/informe01.ts se genera con `npm run informe01:datos`
y el paquete con `npx tsx scripts/informe-01/07-exportar.mts`.

## 3 · Tu encargo, en este orden

### A · Verificar el diplomado de la UNAB — PRIMERO, y es corto

`ini-unab-004`, «Diplomado en Derecho, Innovación y Tecnología», está
registrado como IA_PARA_DERECHO por el ámbito declarado del programa y NO por
evidencia de contenido. Su única fuente es el anuncio y no menciona
inteligencia artificial. Abre el programa de estudios. Si la IA es componente
sustantivo, deja el registro y añade la evidencia; si no lo es, vuelve a
ADYACENTE. Está explicado en ISSUE-024.

Es lo primero porque es el único registro del corpus clasificado sin evidencia,
y mientras siga así el instrumento tiene una excepción que no puede defender.

### B · Simplificar el modelo de capacidades — el grueso del trabajo

Hoy son diez capacidades en cinco bandas y el encargo pide cinco o siete.
Hay una consolidación natural en las bandas que ya existen —estructura,
docencia, adopción, conocimiento, resultado— y hay dos trampas:

- fundir `unidad` con `norma` DESTRUYE el hallazgo H-2, que dice que la
  estructura se crea antes que la regla;
- fundir `herramienta` con `adopcion` DESTRUYE el H-4, que distingue disponer
  de adoptar, y es de los mejores del informe.

El modelo más parsimonioso es el menor que conserve los hallazgos que la
evidencia sostiene, no el menor. Si al reducir se pierde un hallazgo, el modelo
no es más simple: es más pobre.

Preserva la metodología anterior como se preservó la 2.0: se enmienda, no se
deroga, y su matriz se publica en anexo. Publica análisis de sensibilidad.

### C · Arquitectura editorial

Que la narrativa llegue antes a las conclusiones. El resumen ejecutivo debe
leerse en cinco minutos. El aparato metodológico, a anexos. El documento ya
abre por índice y resumen: eso está hecho y no hay que rehacerlo.

### D · La página del sitio

Sigue con el tema oscuro espacial mientras el documento descargable ya es claro
y editorial, con el sistema del Informe 02. Hoy no parecen la misma
publicación. El documento es el referente.

## 4 · Reglas de trabajo de este repositorio

- Rama nueva, nunca main directo. La v0.8.0 vive en `informe-01/v0.8.0`.
- `npm run verify` antes de cada commit: typecheck, lint, 147 pruebas, build.
- Los ocho avisos de lint son del código donado del juego y están justificados.
- Al publicar una versión nueva, la anterior se restaura byte a byte desde main.
- Actualiza HANDOFF.md, progress.json, ISSUES.md y CHANGELOG.md al cerrar.
- Trampas caras y documentadas en HANDOFF §J: los CSV van en CRLF, el heredoc
  de Bash y `node -e` se rompen con acentos y comillas —usa un script .mjs
  escrito con Write—, y un acento grave dentro de una plantilla de texto cierra
  la plantilla y rompe el exportador a cien líneas de distancia.

## 5 · Lo que NO debes hacer

- No inventes fuentes, cifras, cursos ni afiliaciones.
- No optimices el método para que la PUCV salga mejor ni peor. La regla que
  toques debe aplicarse a las once o no aplicarse.
- No metas en la prosa pública el proceso privado de elaboración: ni
  destinatario del borrador, ni encargo, ni conversaciones. Hay una prueba que
  lo vigila.
- No publiques ranking ni puntaje agregado por universidad mientras la
  cobertura sea desigual (DEC-102).
- No borres el estado SOLO_ADYACENTE aunque hoy no pinte ninguna celda: la
  regla sigue vigente y describe qué haría el instrumento si el caso volviera.

Empieza recuperando el estado y dime qué encuentras antes de cambiar nada.
```
