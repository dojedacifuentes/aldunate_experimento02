# Verificación de fuentes · Informe 01

**Primera pasada: resolubilidad.** Comprobación automática de que cada URL del
corpus existe y responde. Ejecutada el **01-09-2026** sobre las 43 fuentes únicas
resultantes de la fusión.

> **Esto no es verificación de contenido.** Que una URL responda `200` prueba que
> la página existe, no que diga lo que el documento fuente afirma que dice. La
> verificación sustantiva —abrir cada fuente y contrastar la afirmación— sigue
> pendiente y **no se delega**: es responsabilidad de quien firma. Ninguna fuente
> pasa a `last_verified` con esta pasada.

---

## Resultado

| | Fuentes |
|---|---|
| Responden `200` | **42** |
| Fallan la verificación TLS | **1** |
| No encontradas (`404`) | 0 |
| Total | 43 |

---

## El único fallo

**`PROP-UDEC-002` — Seminario «Derecho en la Smart Era», UdeC, 02-10-2025**

```
https://www.juridicasysociales.udec.cl/content/seminario-…-en-la
curl: (60) schannel: SNI or certificate check failed: SEC_E_WRONG_PRINCIPAL
```

El certificado del servidor **no cubre el nombre de host**
`www.juridicasysociales.udec.cl`. El dominio raíz falla igual. Con la
verificación TLS desactivada la página responde `200`, de modo que **el contenido
existe**: lo que está roto es la configuración del certificado en el sitio de la
Universidad de Concepción, no la fuente.

**Consecuencias, y por qué importa más de lo que parece:**

1. Quien siga el enlace desde el informe verá una advertencia de seguridad del
   navegador. Publicarlo sin avisar traslada al lector un problema que ya
   conocemos.
2. Es **una de las dos únicas fuentes** de la UdeC. Descartarla dejaría esa ficha
   sostenida por un solo documento.
3. El otro dominio de la misma universidad, `jur.udec.cl` (`PROP-UDEC-001`),
   responde correctamente. La institución mantiene dos dominios y solo uno está
   bien configurado.

**Decisión:** la fuente se conserva, con la advertencia declarada en `notes`.
Antes de publicar conviene buscar el mismo hecho en un dominio con certificado
válido —`jur.udec.cl` es el candidato— y, si aparece, usar ese como fuente
principal y este como respaldo.

---

## Lo que falta, y es lo que cuenta

Para cada una de las 43 fuentes, y en este orden:

1. **Abrirla y leerla.** Contrastar la evidencia extraída contra lo que la página
   dice de verdad, no contra lo que el documento fuente resume.
2. **Separar `publication_date` de `fact_period`.** El corpus ya identificó al
   menos un caso de reconstrucción retrospectiva legítima —`SRC-uchile-006`,
   publicada el 08-01-2026 y probatoria de actividad de 2025—. Confundirlos
   fecharía mal la serie entera.
3. **Comprobar que la atribución es a la unidad correcta.** Universidad no es
   facultad; ver §2.4 del corpus.
4. **Distinguir anunciado de ejecutado.** Cuatro fuentes prueban anuncio: UDD
   (malla 2027), UDP (cambios curriculares), UAI (convenio Legu), UANDES
   (FONDEF en curso).
5. **Escribir la advertencia de lectura** en `notes`: qué mide exactamente la
   fuente, sobre qué población y con qué sesgo conocido.

Solo entonces una fuente recibe `last_verified` y puede entrar en
`src/data/research.ts`.

---

## Precedente que justifica no saltarse esto

En el Informe 02 fue la verificación manual —abrir la fuente en vez de leer el
resumen— la que descubrió que el metaanálisis más citado del campo estaba
retractado tras 266 citas, y la que encontró la corrección de PNAS sobre Bastani
et al. del 20-08-2025 que la versión 0.2.0 no mencionaba. Ninguna de las dos la
habría detectado un proceso automático, y ninguna de las dos era visible desde el
texto que las citaba.


---

# Segunda pasada · las 29 fuentes de la ronda 2

**Ejecutada el 02-09-2026** sobre las fuentes nuevas que aportaron los intentos
3a y 3b. Mismo alcance que la primera: **resolubilidad, no contenido.**

| | |
|---|---:|
| Comprobadas | 29 |
| Responden | 28 |
| No responden | 1 |
| Redirigen a su forma canónica | 16 |

## La que no responde

- `cned.cl/institucional/bases-de-datos` → **403**. Es la base INDICES de oferta
  académica del Consejo Nacional de Educación, la fuente propuesta para
  construir el universo nacional. El sitio existe y es consultable desde un
  navegador: el rechazo es a la petición automatizada, no a la dirección. Se
  conserva con advertencia, igual que se hizo con la fuente de la UdeC en la
  primera pasada.

## Las que redirigen

Quince fuentes redirigen a su forma canónica, todas por barra final o por el
prefijo `www`. **Se registra la URL final, no la de partida.** Una URL que
redirige hoy puede dejar de hacerlo, y una cita que depende de un redirect es
una cita con fecha de caducidad silenciosa.

## Lo que esta pasada sigue sin probar

Lo mismo que la primera, y conviene repetirlo porque el corpus ha crecido a 72
fuentes y el número invita a confundir tamaño con solidez: **un `200` prueba
que la página existe, no que diga lo que se le atribuye.**

La verificación sustantiva de las 72 sigue pendiente y sigue sin delegarse.
