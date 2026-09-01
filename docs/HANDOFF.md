# Handoff · estado del sitio

**Última actualización:** 01-09-2026
**Quien lea esto primero:** `CLAUDE.md` y `AGENTS.md` mandan sobre este documento.

---

## 0. Dónde está todo

| | |
|---|---|
| Repositorio | `dojedacifuentes/aldunate_experimento02` |
| Producción | https://aldunateexperimento02.vercel.app |
| Clon de trabajo | `C:\Users\Asus\Desktop\aldunate-juego-audaces` (tiene `node_modules`) |
| Clon viejo | `C:\Users\Asus\Desktop\aldunate_experimento02` — **se queda atrás, no lo uses** |
| Fuente del PDF | `C:\Users\Asus\Desktop\ALDUNEITOR\INFORME IA UNIVERSIDAD\_fuentes\` — **fuera del repositorio** |

**Node no está en el PATH.** Está portátil en
`%LOCALAPPDATA%\Temp\node-v22.20.0-audit\node-v22.20.0-win-x64`. Añádelo antes
de `npm`, o los scripts hijos no encuentran `node`. Es una carpeta temporal:
puede desaparecer.

**No hay `gh` CLI.** Los PR se abren contra la API REST con `curl`. El token se
recupera con `git credential fill`, y **sólo funciona desde Bash**, no desde
PowerShell.

---

## 1. Qué se hizo en la sesión del 31-08 / 01-09-2026

Dos encargos, diez commits, dos ramas. Ambos partían de `main` en `76e4a9f`.

### Rama `rediseno/ux-ui-fase-0` → PR #10 · seis commits

Auditoría completa en `UX-UI-AUDIT.md`, detalle por fases en
`UX-UI-CHANGELOG.md`.

Lo que más importa:

1. **Tres datos falsos estaban publicados.** `/investigacion` decía «registros
   vacíos» a un scroll de su cabecera, que imprimía 24 fuentes. La nota de EVA
   en `/informes` decía «ninguno concluido» y «el PDF de noventa y seis
   páginas»: son 76 y uno está descargable. «Cuatro entradas» pintaba cinco.
2. **El escudo salió del sitio** —decisión del usuario, `DECISIONS.md` D-033— y
   con él el retrato `eva-pucv-courtyard.png`, que llevaba el escudo, el
   logotipo «DERECHO PUCV» y el rótulo «EVA · ESCUELA DE DERECHO PUCV`
   incrustados en el píxel y estaba en la portada. `CLAUDE.md` regla dura 3
   ordenaba lo contrario y se actualizó.
3. **Se publicaron las 24 fuentes y las 18 afirmaciones.** El sitio afirmaba
   trazabilidad y sólo enseñaba el *esquema* de sus registros.
4. Tres familias de estado con silueta propia; portada encabezada por el
   laboratorio y no por el nombre del profesor; navegación reordenada.
5. QA medido: un overflow de 69 px, 48 objetivos táctiles bajo 24 px y 118
   fallos de contraste, todos corregidos.

### Rama `auditoria/v0.3.0` → PR #11 · cuatro commits más

Estado hallazgo por hallazgo en **`docs/audit-v0.3.0.md`**. 23 resueltos, 5
parciales, 4 abiertos, 1 que requiere decisión humana, 1 no aplicable.

1. **Once afirmaciones recalibradas** al diseño de sus fuentes. «Perdió su
   validez» → «no puede presumirse, por sí sola»; «enteramente atribuible» →
   convergencia; «es la formación jurídica» → exposición intensa sin agotar la
   disciplina; «D5 · causalidad establecida» → «identificación causal en
   contexto experimental».
2. **Taxonomía partida en cuatro dimensiones** —estado documental, robustez,
   nivel demostrativo, generalización— que antes viajaban juntas bajo
   «VERIFICADO».
3. **Fuentes verificadas contra su publicación original.** Hallazgo no previsto:
   **PNAS publicó una corrección sobre Bastani et al. el 20-08-2025** que el
   informe no mencionaba. Registrada y visible en la ficha.
4. **Título canónico único**, estado de versión derivado de una sola fuente,
   cadena de conteos publicada (24 → 38 → 18 → 8).
5. **Informe regenerado como v0.3.0**: 77 páginas, portada con cifras
   contextualizadas, «Investigación aplicada» en vez de «Informe experto»,
   autoría con nombre, sin residuos de Word. v0.2.0 **no se sobrescribió**.
6. **Changelog a nivel de afirmación** y **política pública de correcciones** en
   `/correcciones`.

---

## 2. Estado verificable

```
npm run verify   →  0 errores · 8 avisos (D-022, no tocar) · 64 tests · 17 rutas
```

Los 8 avisos son de siempre: siete del código donado del juego, uno de
`figure-sprite.mjs`. Están justificados en `DECISIONS.md` D-022 y **no se
arreglan**.

Las 64 pruebas incluyen 18 nuevas sobre `src/data/`, que antes no tenía
ninguna: las 46 anteriores eran todas del juego, y ahí es donde vivían los dos
datos falsos que compilaban sin protestar.

---

## 3. Lo que NO está hecho, y por qué

### Requiere decisión del autor

| Qué | Por qué no lo resolví |
|---|---|
| **Protocolo de búsqueda** (A-05) | Depende de cómo se buscó realmente. Reconstruirlo desde las 24 fuentes resultantes sería inventar un método hacia atrás y publicarlo como reproducible: el fallo que el propio informe denuncia. Quince minutos de conversación bastan. |
| **Clasificar las 8 recomendaciones** (A-12) | En A/B/C/D según si la respalda la evidencia o son decisión normativa. Es un juicio sobre trabajo propio. |
| **Ficha del profesor Aldunate** | El usuario indicó «actualizaremos info de Aldunate» más adelante. Su cargo —director de la Escuela de Derecho PUCV— **no se publicó**: añadir el cargo institucional de alguien que no sabe que el sitio existe reintroduce el riesgo que D-033 acaba de cerrar. |
| **Estado de 4 fichas del Lab** | Dicen «prototipo» sin `demoUrl` ni `repoUrl`. No las bajé a `idea` porque una plantilla o una rúbrica pueden existir fuera del sitio; degradarlas sería el error contrario. Van marcadas «sin artefacto consultable». |

### Pendientes técnicos

- **A-16, A-17, A-18 · maquetación del PDF.** Numeración de recomendaciones,
  paginación final y densidad de tablas **no se revisaron visualmente**: este
  equipo no tiene `pdftoppm` ni renderizador de PDF a imagen. La comprobación
  fue textual. **Abre el PDF y mira la portada y las páginas finales antes de
  distribuirlo**: los cambios de portada alteran el alto de la tabla de cifras.
- **A-24 · fecha de Magesh.** El encargo afirmaba 23-04-2025. Wiley devuelve 403
  y no pude contrastarlo. Queda en `2025-04` con precisión de mes declarada.
- **A-19 · 18 fuentes sin clasificar** en la taxonomía nueva. Las 6 críticas sí.
  La ficha no muestra el bloque cuando no hay datos, que es lo correcto.
- **A-29 · dos fuentes de verdad.** La web lee de `src/data/`; el PDF se genera
  desde `contenido-*.json`, fuera del repositorio. Hoy coinciden porque se
  corrigieron a mano los dos. **Es el riesgo residual más probable.**
- **A-32** exportación CSV/JSON · **A-33** Lighthouse y axe · búsqueda global.

---

## 4. Cómo regenerar el informe

Sólo si tocas `contenido-*.json`. Desde PowerShell, en `_fuentes\`:

```powershell
.\Build-Informe.ps1     # JSON -> DOCX
.\Build-Artifact.ps1    # JSON -> HTML
.\Build-Resumen.ps1     # resumen ejecutivo
```

Después, el paso de Word por COM —**imprescindible**, es lo que actualiza el
índice y elimina el aviso de campo sin actualizar—:

```powershell
$w = New-Object -ComObject Word.Application; $w.Visible=$false; $w.DisplayAlerts=0
$d = $w.Documents.Open($docx,$false,$false)
$d.Fields.Update(); $d.TablesOfContents.Item(1).Update(); $d.Repaginate()
$d.ExportAsFixedFormat($pdf,17); $d.Save(); $d.Close(0); $w.Quit()
```

Y copiar a `public/descargas/` con nombre de versión nueva. **Nunca sobrescribas
una versión publicada.**

### Trampas de esa cadena

- **Los `contenido-*.json` tienen BOM mezclado**: cuatro lo llevan y uno no.
  PowerShell 5.1 lee sin BOM como ANSI y corrompe todos los acentos.
  **Conserva el estado de origen de cada archivo.**
- Al hacer sustituciones masivas, **comprueba que el texto de partida aparezca
  exactamente una vez antes de escribir nada**. Hay un script de ejemplo con ese
  guardián en el historial de la sesión.
- Los archivos son CRLF. `perl -0pi` con patrones multilínea falla por eso;
  usa la herramienta de edición o `sed` línea a línea.

---

## 5. Trampas del entorno que ahorran una hora

- **El panel de vista previa se rompe en sesiones largas**: deja de pintar y las
  capturas fallan por tiempo agotado. Cuando pase, verifica por DOM
  —`getBoundingClientRect`, contraste calculado sobre el píxel con canvas— y
  **di explícitamente que no hubo revisión visual**, en vez de fingir que la hubo.
- **No cambies el tema por JavaScript a media medición.** El proveedor lo repone
  y acabas leyendo colores de un tema con fondos del otro: da 121 fallos de
  contraste falsos. Recarga.
- **`npm run verify` no detecta errores de hidratación ni datos falsos que
  compilan.** Recorrer las rutas con la consola abierta no es opcional.
- **La vista previa de Vercel por rama exige iniciar sesión**, así que un agente
  no puede verificarla. El dominio de producción sí es público.

---

## 6. Siguiente paso sugerido

PR #10 y #11 están fusionados; producción va en `b172680` y sirve el Informe 02
en v0.3.0. El trabajo activo pasó al **Informe 01**.

1. **Verificar las 43 fuentes del Informe 01 una por una.** Es lo único que
   desbloquea todo lo demás, y es lo que no se delega: abrir cada página y
   contrastar lo que dice contra lo que el documento fuente le atribuye. La
   pasada hecha sólo comprueba que responden. Procedimiento en
   `tools/informes/informe-01/verificacion-fuentes.md`.
2. **Igualar cobertura en las ocho universidades fuera del piloto.** Con nueve
   fuentes contra dos, ninguna comparación nacional es publicable. Hasta que se
   iguale, el informe publica once fichas y ninguna tabla de posiciones.
3. Comprobar cuáles de las cuatro iniciativas anunciadas llegaron a ejecutarse
   —UDD malla 2027, UDP currículo, UAI convenio Legu, UANDES FONDEF—.
4. Abrir el PDF v0.3.0 del Informe 02 y revisar portada y páginas finales (§3).
5. Resolver el protocolo de búsqueda (A-05) con el autor.
6. Cerrar A-29 trayendo los `contenido-*.json` al repositorio.

**No redactar el Informe 01 antes del punto 1.** El corpus cierra los cinco pasos
de fusión, pero ninguna afirmación es publicable todavía y `sourceIds` /
`claimIds` siguen vacíos a propósito.

El plan de fondo del proyecto —fases A a D, y por qué nada se publica antes de
hablar con el profesor— sigue en `docs/PUENTE-Y-HOJA-DE-RUTA.md`. No ha
cambiado.
