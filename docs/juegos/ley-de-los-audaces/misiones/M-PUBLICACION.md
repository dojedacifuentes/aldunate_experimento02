# Misión · PUBLICACIÓN

**Encargada a:** el agente que tenga credenciales reales de GitHub y Vercel.
**Alcance:** publicar y enlazar lo que ya existe. **Cero desarrollo de juego.**
**Estado:** abierta.

---

## Por qué existe esta misión

El proyecto está construido y verificado, pero vive sólo en una carpeta. La
sesión que lo construyó corría en un entorno sandbox cuyo proxy de git sólo
entrega credenciales a repositorios previamente autorizados, y este no lo
estaba: el push falla con 403 antes de salir a la red. No es un problema de
código ni de permisos de GitHub. Hace falta alguien con credenciales de verdad.

---

## Lo que hay

| | |
|---|---|
| Repositorio | `dojedacifuentes/aldunate_experimento02` — el juego ya está dentro |
| Rama con el trabajo | `feature/juego-audaces` |
| Ruta del juego | `/experimentos/juegos/ley-de-los-audaces` |
| Estado del proyecto | `docs/juegos/ley-de-los-audaces/CHECKPOINT.md` |

---

## Tareas, en orden

### T1 · Verificar antes de tocar

```bash
npm install
npm run verify        # typecheck + lint + test + build
```

**Debe quedar verde**, con 0 errores y 8 avisos conocidos (justificados en
`DECISIONS.md` D-006). Si no queda verde, **detente y repórtalo**: significa que
algo cambió respecto del checkpoint y publicar sería propagar el problema.

Comprueba también el historial: `git log --oneline` debe mostrar los commits del
proyecto, y `git status` debe estar limpio.

### T2 · Publicar el repositorio

Confirma primero que el remoto está vacío:

```bash
git ls-remote https://github.com/dojedacifuentes/ley-de-los-audaces.git
```

Si devuelve referencias, **no empujes**: alguien subió algo antes. Repórtalo y
espera instrucciones.

Si está vacío:

```bash
git remote add origin https://github.com/dojedacifuentes/ley-de-los-audaces.git
git push -u origin main
```

**Nunca `--force`.** Después comprueba que GitHub Actions corrió el flujo
`Verificación` y quedó verde. Si falló, anota el paso exacto y el mensaje.

### T3 · Desplegar

Vercel, importando el repositorio. Valores por defecto de Next.js, Node **22.x**,
sin variables de entorno. El proyecto compila con `npm run build` y no necesita
backend, base de datos ni servicios de pago.

Al terminar, abre el sitio desplegado y **juega el Capítulo 0 completo** para
confirmar que funciona en producción: portada → creación de personaje →
audiencia → alegato → veredicto. Anota si algo se comporta distinto que en
local.

Si no tienes acceso a Vercel, no improvises otro proveedor: repórtalo y sigue
con T4, que no depende de esto.

### T4 · Enlazar desde el laboratorio

El sitio anfitrión es de **sólo lectura en su rama `main`**: se propone por PR y
nunca se empuja directo a `main`.

Para la rama del PR hay dos caminos, y el correcto depende de tus permisos:

- **Si tienes permiso de escritura en el anfitrión**, empuja la rama al propio
  repositorio: `git push -u origin feature/enlace-audaces`. Rama sí, `main` no.
- **Si no lo tienes**, haz un fork, añádelo como remoto y empuja ahí:

  ```bash
  gh repo fork dojedacifuentes/aldunate_experimento02 --remote=false
  git remote add fork https://github.com/<tu-usuario>/aldunate_experimento02.git
  git push -u fork feature/enlace-audaces
  ```

  El PR se abre desde el fork hacia `main` del anfitrión.

Comprueba cuál es tu caso antes de empujar, y dilo en el informe.

```bash
git clone https://github.com/dojedacifuentes/aldunate_experimento02.git
cd aldunate_experimento02
git checkout -b feature/enlace-audaces
git am ../ley-de-los-audaces/docs/juegos/ley-de-los-audaces/integracion-aldunate/enlace-audaces.patch
npm install
npm run verify        # debe quedar verde
```

Si T3 dejó un despliegue en línea, enciende el enlace antes de abrir el PR:

```ts
// src/data/experiments.ts
export const AUDACES_URL = 'https://<dominio-del-despliegue>';
```

Si no hay despliegue, **déjala vacía**. La ficha se muestra en construcción y no
pinta ningún botón: el parche se puede fusionar igual, y encenderlo después es un
commit de una línea.

Abre el PR contra `main` del anfitrión. No lo fusiones tú: lo revisa el autor.

Detalle: `next dev` reescribe `AGENTS.md` y `CLAUDE.md` del anfitrión. Si
aparecen modificados sin que los hayas tocado, descarta ese cambio antes de
commitear.

### T5 · Informar

Escribe el informe siguiendo `docs/juegos/ley-de-los-audaces/misiones/INFORME-PLANTILLA.md`, guárdalo
como `docs/juegos/ley-de-los-audaces/misiones/INFORME-<AAAA-MM-DD>.md`, y entrégaselo también a quien
te encargó la misión.

Añade la entrada correspondiente a `docs/juegos/ley-de-los-audaces/DEVLOG.md` y, si el estado cambió
—que cambiará—, actualiza `docs/juegos/ley-de-los-audaces/HANDOFF.md` §3.1 y `CHECKPOINT.md` §8, donde
hoy dice que el push está bloqueado.

---

## Fuera de alcance

No hagas nada de esto en esta misión, aunque te parezca mejora:

- escribir el Capítulo 1 o cualquier contenido nuevo;
- cambiar mecánicas, guion, reparto o arte;
- reescribir el código donado para silenciar avisos de lint;
- refactorizar lo que ya funciona;
- tocar `main` de cualquiera de los dos repositorios;
- añadir dependencias.

Si encuentras algo que **crees** que debería cambiar, anótalo en el informe y
sigue. La misión es publicar lo que hay, no mejorarlo.

---

## Criterio de terminada

- [ ] `npm run verify` verde antes y después de cualquier cambio tuyo.
- [ ] El repositorio del juego está en GitHub, con su historial y su CI en verde.
- [ ] Hay un despliegue en línea y el Capítulo 0 se juega entero ahí — o está
      documentado por qué no.
- [ ] Existe un PR abierto en el anfitrión con el parche aplicado y su `verify`
      verde.
- [ ] El informe está escrito, y `DEVLOG`, `HANDOFF` y `CHECKPOINT` reflejan el
      estado nuevo.
