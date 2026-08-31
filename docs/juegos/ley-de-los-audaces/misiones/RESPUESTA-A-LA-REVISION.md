# Respuesta a la revisión previa a publicar

**Revisión recibida:** 31-08-2026, ocho hallazgos.
**Estado:** los ocho atendidos. `npm ci` y `npm run verify` verdes, y las
correcciones comprobadas en navegador.

La revisión fue buena y la mayoría de los hallazgos eran defectos reales. Se
responde uno por uno, con lo que se hizo y cómo se comprobó.

---

## 1 · `npm ci` fallaba: el lock estaba desincronizado — **CORREGIDO**

Cierto. `tsx` se había añadido a `package.json` sin reinstalar, de modo que no
figuraba en `package-lock.json`. En local `npm install` lo resolvía y por eso
`verify` pasaba; `npm ci` no perdona esa diferencia.

**Hecho.** Lock regenerado y comprobado de verdad: instalación limpia desde cero
con `npm ci`, 0 vulnerabilidades.

## 2 · `git remote add origin` iba a fallar, y el remoto traía un token — **CORREGIDO, y era peor de lo señalado**

La revisión habló de «credenciales ficticias `proxy-injected`». No eran
ficticias: era un token de acceso real incrustado en la URL del remoto, y viajaba
dentro del `.git/config` del paquete.

**Hecho.** Remoto eliminado por completo. El repositorio se entrega sin ningún
remoto configurado, así que `git remote add origin …` —tal como dice la misión—
es ahora la instrucción correcta.

## 3 · El historial exponía enlaces de sesión — **CORREGIDO**

**Hecho.** Los seis commits reescritos sin el trailer, y el parche de integración
regenerado también sin él. Cero apariciones en ambos historiales.

## 4 · «Cargando…» eterno con `localStorage` bloqueado — **CORREGIDO**

Cierto, y el diagnóstico apuntaba en la dirección correcta. La causa raíz estaba
un paso más atrás de lo señalado: cuando el acceso a `localStorage` lanza,
`createJSONStorage` se queda sin almacén y la rehidratación **no llega a
ejecutarse**, de modo que el callback nunca corre y la bandera nunca se levanta.
Levantar la bandera en el callback no bastaba.

**Hecho.** Un envoltorio de almacenamiento que nunca lanza: prueba el del
navegador y, si falla, usa uno en memoria. Siempre hay almacén, la rehidratación
siempre termina, y en navegación privada se juega igual —sin guardar entre
sesiones, que es lo correcto—.

Peor que el error era la casilla de QA que afirmaba lo contrario. Corregida y
ahora es verdadera.

**Comprobado en navegador** con el acceso a `localStorage` lanzando: arranca la
portada y el capítulo se juega entero.

## 5 · La pausa no pausaba — **CORREGIDO**

Cierto. Los oyentes de teclado viven en `window` y seguían activos tras el modal.

**Hecho.** Con la pausa abierta, un interceptor en fase de captura corta el
evento antes de que llegue a ninguno de los dos oyentes. Escape queda fuera, que
es como se sale. No se tocó el código donado.

**Comprobado:** con la pausa abierta sobre un nodo de decisión, `1`, `2`,
Espacio y `E` no mueven el nodo ni añaden decisiones; al cerrarla, los controles
vuelven.

## 6 · Recargar tras el final volvía a cobrar XP — **CORREGIDO**

Cierto, por dos vías: la fase no se guardaba y la recompensa no era idempotente.

**Hecho.** La fase se persiste —normalizada: sólo se retoman partidas en curso o
terminadas, una creación a medias vuelve a la portada— y el desenlace deja un
flag `veredicto_cobrado` que impide cobrarlo dos veces. Dos tests nuevos cubren
la normalización.

**Comprobado:** al recargar tras cerrar el capítulo aparece el cierre, no el
veredicto, y la XP no cambia.

## 7 · El HTML suelto no era autónomo ni estaba listo para móvil — **CORREGIDO**

Cierto en lo esencial, con un matiz: la versión publicada como página no lleva
doctype porque la plataforma envuelve el contenido y lo añade. El archivo para
abrir con doble clic sí lo necesitaba, y no lo tenía.

**Hecho.** Ahora es un documento completo: `<!doctype html>`, `lang="es-CL"`,
`charset`, `viewport` y `noindex`. Y se quitó la petición de tipografías a Google
Fonts: usa las del sistema. La frase «funciona sin internet» pasa a ser cierta —
el archivo no hace ni una sola petición externa.

**Comprobado:** capítulo jugado de principio a fin sobre el archivo compilado,
sin peticiones de red.

## 8 · T4 no explicaba cómo publicar la rama del PR — **CORREGIDO**

Cierto: la misión declaraba el anfitrión «sólo lectura» y acto seguido pedía un
PR sin decir cómo.

**Hecho.** T4 distingue ahora los dos casos —empujar la rama al propio
repositorio si hay permiso de escritura, o fork si no lo hay—, con los comandos
de cada uno, y pide declarar en el informe cuál se aplicó.

---

## Sobre el alcance

Los ocho hallazgos eran de borde y de empaquetado: ninguno tocaba el guion, el
reparto, el arte ni la arquitectura. El juego es el mismo; lo que estaba mal era
cómo se entregaba.

La conclusión de la revisión —«no conviene publicar así»— era correcta, y su
orden de prioridades también.

## Qué sigue sin resolverse

Nada de esto cambia el gate del proyecto, que no es técnico: falta que una
persona juegue el Capítulo 0 sin instrucciones y diga dónde se aburre.
