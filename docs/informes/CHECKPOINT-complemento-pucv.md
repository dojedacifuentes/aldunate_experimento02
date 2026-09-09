# Checkpoint · el complemento PUCV y su aritmética

**Fecha:** 09-09-2026 · **Objeto:** `complemento-pucv-v1.1.html`, tal como viaja
con el Informe 01 v3.1.0 · **Estado:** hallazgos verificados, corrección **sin
empezar**.

Este archivo existe para que la sesión siguiente no tenga que redescubrir nada.
Todo lo que afirma está comprobado contra la rúbrica publicada del anexo D y
contra `tools/informes/informe-01/comparador/matriz-v2.json`.

---

## 0 · Lo primero, porque es el error que hay que no repetir

El encargo v3 dice que el complemento tiene «las brechas y las prioridades sin
desarrollar». **Es falso.** El complemento v1.1 ya trae, en doce páginas:

- la sección 4, con las tres formas de los doce puntos que faltan y el acto que
  cierra cada una;
- seis decisiones **D-1 a D-6**, cada una con `Evidencia · Referente ·
  Indicador · Efecto · Plazo`;
- la sección 9, con la aritmética de la decisión y la ventana.

Está bien construido. **No lo reescribas.** Es el mismo error que el encargo
comete sobre las capas 5 y 6 del informe, ya registrado en
`docs/informes/10-auditoria-sustantiva.md` §2: dar por ausente lo que existe.

---

## 1 · El perfil, para tenerlo a mano

Calculado desde `matriz-v2.json`, matriz `.v2`, rúbrica del anexo D.

| Capacidad | Estado | Puntos | Faltan |
|---|---|---:|---:|
| Unidad especializada | `OP` | 2/3 | 1 |
| Norma propia | `ENT` | 1/3 | 2 |
| Presencia en pregrado | `OP` | 2/3 | 1 |
| Formación estructurada | `OP` | 2/3 | 1 |
| Herramienta desplegada | `OPF` | 3/3 | — |
| Adopción en la enseñanza | `ENT` | 1/3 | 2 |
| Alcance declarado | `OP` | 2/3 | 1 |
| Investigación | `OP` | 2/3 | 1 |
| Transferencia | `OPF` | 3/3 | — |
| Evaluación de efecto | `NL` | 0/3 | 3 |

**Piso 18 de 30, banda cerrada** —ninguna celda sin concluir—, y **12 puntos que
faltan**, repartidos en 5 por instrumento, 4 por nivel de decisión y 3 por
capacidad inexistente.

---

## 2 · Los tres defectos, verificados

### A · D-3 promete un punto que la rúbrica no puede dar

Su campo `Efecto` dice **«+1 a +2 puntos en presencia en pregrado»**. Esa
capacidad está en `OP` = 2 de 3, y el techo de la rúbrica es 3. **El máximo
posible es +1.** El «+2» no existe bajo ninguna lectura del anexo D.

### B · D-4 nombra la capacidad equivocada

Su título —«Declarar el alcance real de lo que ya se ejecuta»—, su evidencia
—cifras de público mixto sin penetración interna— y su indicador —«una serie de
al menos dos años con cifras desagregadas»— son íntegramente sobre **alcance
declarado**. Su campo `Efecto` dice **«+1 punto en adopción en la enseñanza»**,
que es otra capacidad y se cierra con otro acto: decidir en el nivel de la
Escuela, no publicar cifras.

La lectura correcta es que **D-4 cierra alcance declarado, +1**.

### C · Tres capacidades quedan sin decisión que las cierre

La sección 4 declara que cinco capacidades recuperan su punto publicando un
documento «que en la mayoría de los casos ya existe»: unidad, presencia,
**formación**, **alcance** e **investigación**. Las decisiones cubren unidad
(D-1), presencia (D-3) y alcance (D-4, mal rotulado).

**Formación estructurada, investigación y adopción en la enseñanza no tienen
ninguna decisión que las cierre.**

### La consecuencia sobre la aritmética

| | Puntos |
|---|---:|
| Lo que la sección 9 declara | «hasta 9» |
| Lo que las seis decisiones cierran de verdad | **8** |
| Puntos huérfanos | **4** — formación +1, investigación +1, adopción +2 |

El «hasta 9» se sostiene únicamente sobre el +2 imposible de D-3.

---

## 3 · Cómo corregirlo · el método, no el texto

El defecto de fondo no es que las cifras estén mal: es que **están escritas a
mano**. Es el mismo defecto que D-039 corrigió para las figuras y que la v3.1.0
extendió a la web. La corrección es la misma.

1. **Un guion que deriva el efecto de cada decisión desde la matriz.** Se
   declara el mapa `decisión → capacidad`, y el delta lo calcula la rúbrica. Si
   una decisión promete un punto que su capacidad no puede dar, **el guion se
   detiene y no publica**. El error de D-3 deja de ser posible.
   Copia el patrón de `tools/informes/informe-01/v3.1.0/armonizar.mjs`, que ya
   lleva once guardianes de ese tipo sobre la matriz.
2. **Corregir D-3** (+1, no +2) y **re-rotular D-4** a alcance declarado.
3. **Añadir las decisiones que faltan.** Formación e investigación son del tipo
   barato de D-1 —publicar el código del programa formativo, el del proyecto
   adjudicado—; adopción es del tipo caro de D-2, porque exige decidir en el
   nivel de la Escuela y no publicar nada.
4. **Cerrar la aritmética.** Las decisiones deben sumar exactamente los 12, o
   declarar cuáles no se cierran y por qué. Un documento que enumera doce
   brechas y propone cerrar ocho sin decir nada de las otras cuatro deja al
   lector haciendo la resta.
5. Sale **complemento v1.2**, viajando con un **informe v3.2.0** cuyo único
   cambio es el enlace.

**No toca ninguna cifra del comparador.** La PUCV está fuera de él por D-037, de
modo que la puerta de aprobación del encargo no se abre por este trabajo.

---

## 4 · La mecánica, que ya está resuelta

El complemento **no se edita a mano**: se deriva, igual que el informe.

```bash
node tools/informes/informe-01/v3.2.0/armonizar.mjs   # a escribir
npm run informe:lector
npm run informe:pdf
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts\informes\lector\html-a-word.ps1 -Version 3.2.0
```

```bash
npm run informe:word
npm run verify
```

Recuerda: `scripts/informes/lector/documentos.mjs` apunta sólo a la versión que
se está publicando, y el `.docx` se escribe en `entregas/`, nunca en
`public/descargas/`. Las dos trampas de Word por COM están resueltas y
comentadas en `html-a-word.ps1`.

**Y lo que no debe romperse:** la declaración de intereses de la primera página
del complemento se conserva íntegra. Un documento que empuja a invertir en un
área y oculta que su autor trabaja en ella es refutable de un golpe.
