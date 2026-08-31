# QA manual

Lo que los tests no pueden comprobar. Se pasa entero antes de cerrar un
milestone. Cada línea se marca **PASS** o **FAIL**; un FAIL bloquea el avance.

## Arranque

- [ ] `npm run verify` termina sin errores.
- [ ] La portada carga sin errores de consola.
- [ ] «Nueva partida» lleva a creación de personaje.
- [ ] «Continuar» sólo aparece si hay partida guardada.

## Creación de personaje

- [ ] El nombre escrito aparece después en el HUD.
- [ ] Los dos avatares se ven distintos y el elegido es el que sale en el HUD.
- [ ] Cada especialidad muestra su ventaja y la ventaja se refleja en las
      estadísticas iniciales.
- [ ] Entrar sin escribir nombre no rompe nada.

## Escena

- [ ] La sala monta y se ven los seis actores en su puesto.
- [ ] La cámara se mueve al cambiar de nodo y el foco sigue a quien habla.
- [ ] Quien habla gesticula; los demás vuelven a reposo.
- [ ] Acertar produce destello dorado; fallar, burdeos.
- [ ] ANALIZAR produce el barrido.
- [ ] Con el canvas deshabilitado, el juego sigue siendo jugable.

## Diálogo y decisiones

- [ ] El efecto de tecleo se completa al primer clic y avanza al segundo.
- [ ] Las teclas 1–5 eligen la opción correspondiente.
- [ ] E y Espacio avanzan narración y confirman el botón principal.
- [ ] Esc abre y cierra la pausa.
- [ ] Con la pausa abierta, ninguna otra tecla avanza el juego por detrás.
- [ ] Escribir en el campo de nombre no dispara atajos.

## Reglas del juego

- [ ] Acertar sube XP e impulso; encadenar aciertos muestra el combo.
- [ ] Fallar baja el impulso a la mitad, **no** a cero, y **no** reinicia.
- [ ] La evidencia obtenida aparece en el expediente del HUD.
- [ ] Presentar la evidencia equivocada continúa la escena con otro texto.
- [ ] El alegato no se puede enviar incompleto.
- [ ] Un alegato con dos de tres piezas sigue adelante con otro desenlace.

## Guardado

- [ ] Recargar a mitad de partida retoma en el mismo nodo.
- [ ] El expediente y las estadísticas sobreviven a la recarga.
- [ ] «Abandonar partida» limpia y vuelve a la portada.
- [ ] Recargar después del veredicto muestra el cierre de capítulo, **no** el
      veredicto otra vez, y no vuelve a sumar XP.
- [ ] Con `localStorage` bloqueado (navegación privada), el juego arranca igual
      y se puede jugar entero, sin guardar. **No debe quedarse en «Cargando…».**

## Contenido

- [ ] Ninguna referencia normativa se muestra como vigente sin estar verificada.
- [ ] Las fuentes «por verificar» llevan su rótulo visible.
- [ ] Ningún nombre de personaje, empresa o causa coincide con algo real.
- [ ] La franja de prototipo está visible.

## Accesibilidad

- [ ] Con `prefers-reduced-motion` no hay paneo, sacudida ni barrido.
- [ ] Todo se puede completar sólo con teclado.
- [ ] El foco es visible en cada botón.
- [ ] Ninguna decisión depende de reaccionar a tiempo.

## Rendimiento

- [ ] La escena se mantiene fluida durante toda la partida.
- [ ] Al salir de la ruta, la instancia de Phaser se destruye.
- [ ] Entrar y salir del juego cinco veces no degrada el rendimiento.

## Móvil

Desktop es prioritario; esto es una revisión de daños, no un objetivo.

- [ ] La portada y la creación de personaje se leen en pantalla estrecha.
- [ ] El diálogo no se corta.
- [ ] Nada obliga a un teclado físico para completar el capítulo.
