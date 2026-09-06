# 09 · Recálculo del comparador · encargo abierto

Encargo preparado el 07-09-2026 para la sesión siguiente. Contiene la decisión
tomada, los dos problemas que la bloquean, los números ya calculados y la lista
exacta de lo que hay que tocar.

**Léelo entero antes de cambiar una cifra.** Lo que sigue no es una mejora de
presentación: cambia lo que el informe afirma sobre once instituciones
nombradas.

---

## 1 · La decisión

**La Pontificia Universidad Católica de Valparaíso sale del comparador
ordinal.** No es una decisión nueva: es la que el propio documento ya declara y
funda, y que nunca se aplicó a sus datos.

Lo declara en dos sitios:

- La sección 8 del informe principal se titula **«La institución que no está en
  el comparador»**.
- El documento complementario lo dice seis veces, la primera así: *«El
  comparador ordinal del Informe 01 cubre diez instituciones y la Pontificia
  Universidad Católica de Valparaíso no es una de ellas, por decisión
  metodológica que aquí se explica y se funda.»*

El fundamento está escrito y no hay que rehacerlo: quien firma trabaja en el
Programa DIAT de esa Escuela, el conflicto es actual y sobre el objeto medido,
y hay además un sesgo medible —la PUCV fue una de las tres instituciones del
piloto de profundidad, de modo que en un instrumento que puntúa capacidades
acreditadas por evidencia pública, haberla investigado más produce
mecánicamente una puntuación más alta—.

**Qué queda por hacer:** aplicarlo. Hoy la figura del comparador, la tabla del
anexo D y `matriz-v2.json` contienen **once** instituciones, la PUCV entre
ellas, con 18 puntos y banda cerrada. Y el resumen ejecutivo dice que la PUCV
**«encabeza el comparador»**.

---

## 2 · El problema que hay que resolver antes

Al preparar este encargo apareció algo mayor, y **no se puede recalcular sin
resolverlo primero.**

`tools/informes/informe-01/comparador/matriz-v2.json` contiene dos matrices, y
**el documento publica la primera**:

| | celdas sin concluir | encabeza | de dónde sale |
|---|---|---|---|
| `.v1` | **31** | PUC de Chile 18-20 | es lo que publica la figura del informe |
| `.v2` | **5** | PUC de Chile 20-20 | aplica los 26 cierres de la Ronda 2 |

Los números de la figura publicada coinciden **exactamente** con `.v1`:
PUC 18-20, PUCV 18, Autónoma 12-20, U. de Chile 12-14, UNAB 10-14, Central
8-16, UAI 6-14, UDP 6-14, Andes 5-13, UdeC 5-11, UDD 3-11. Y el texto del
informe dice «celdas sin concluir: de 47 a 31», que es el recuento de `.v1`.

`.v2` está calculado, declara `aplicados: 26` y `rechazados: 0`, y **no se
publicó**. Aplicarlo cambia el orden de forma sustantiva:

| Institución | publicado (`.v1`) | con Ronda 2 (`.v2`) |
|---|---|---|
| U. Central de Chile | 8-16 | **17-17** |
| U. Autónoma de Chile | 12-20 | **17-17** |
| U. Adolfo Ibáñez | 6-14 | **11-11** |
| U. del Desarrollo | 3-11 | **8-10** |
| PUC de Chile | 18-20 | **20-20** |

**La pregunta que hay que contestar primero, y es del autor:** ¿cuál de las dos
matrices es la canónica de la v2.0.0?

- Si es `.v1`, hay que explicar por qué el informe dice que la Ronda 2 cerró
  celdas y publica la matriz anterior, y `.v2` debe declararse descartada con su
  motivo.
- Si es `.v2`, la figura, la tabla del anexo D, el recuento de celdas sin
  concluir (31 → 5) y todas las cifras derivadas están mal en el documento
  publicado, y la corrección es mayor que la de la PUCV.

**No lo decidas tú.** Pregunta, y deja la respuesta escrita en `DECISIONS.md`.

---

## 3 · Los números, ya calculados

Con la matriz que se elija, quitar la PUCV da esto. Calculado el 07-09-2026 con
la rúbrica del propio informe (`OPF` 3, `OP` 2, `INC`/`ENT`/`ADY` 1, `NL` 0,
`NC` sin puntuar y sumando 2 al techo).

### Sobre `.v1` — la matriz que hoy se publica

```
 1. P. U. Católica de Chile      18-20   nc=1     ← pasa a encabezar
 2. U. Autónoma de Chile         12-20   nc=4
 3. U. de Chile                  12-14   nc=1
 4. U. Andrés Bello              10-14   nc=2
 5. U. Central de Chile           8-16   nc=4
 6. U. Adolfo Ibáñez              6-14   nc=4
 7. U. Diego Portales             6-14   nc=4
 8. U. de los Andes               5-13   nc=4
 9. U. de Concepción              5-11   nc=3
10. U. del Desarrollo             3-11   nc=4
```

La PUCV salía con **18-18, banda cerrada, cero celdas sin concluir**: el único
perfil completo de la cohorte. Ese dato no desaparece — se traslada al
complemento, que es donde el conflicto está declarado.

### Sobre `.v2` — si resulta ser la canónica

```
 1. P. U. Católica de Chile      20-20   nc=0
 2. U. Autónoma de Chile         17-17   nc=0
 3. U. Central de Chile          17-17   nc=0
 4. U. de Chile                  12-14   nc=1
 5. U. Adolfo Ibáñez             11-11   nc=0
 6. U. Andrés Bello              11-11   nc=0
 7. U. del Desarrollo             8-10   nc=1
 8. U. Diego Portales             8- 8   nc=0
 9. U. de los Andes               5- 9   nc=2
10. U. de Concepción              5- 7   nc=1
```

Para reproducirlos:

```bash
node tools/informes/informe-01/comparador/recalcular.mjs
node tools/informes/informe-01/comparador/sensibilidad.mjs
```

---

## 4 · Todo lo que hay que tocar

Inventariado el 07-09-2026. **La cuenta es la prueba de que no falta nada:** al
terminar, ninguna de estas frases puede seguir diciendo lo que dice hoy.

### En el documento entregado

`content/reports/01_ia_escuelas_derecho_chile/entregas/v2.0.0/informe-01-v2.0.0.html`

| Dónde | Qué dice hoy | Veces |
|---|---|---|
| Resumen ejecutivo | «la PUCV … **encabeza el comparador**» | 1 |
| Resumen ejecutivo | «la **única** de las once cuyo perfil no tiene ninguna celda sin concluir» | 1 |
| Resumen ejecutivo | remite a «la **sección 10**», que ya no existe: se movió al complemento | 1 |
| Figura del comparador | once barras, PUCV incluida | 1 |
| Anexo D · rúbrica y cálculo | once filas | 1 |
| Cuerpo | «las once instituciones» | 11 |
| Cuerpo | «banda cerrada» — hoy sólo la PUCV la tiene | 11 |

### En el sitio

`src/data/reports.ts`, entrada de la v2.0.0:

- `figures[]` publica **«18 / 30 · el techo real · alcanzado por dos
  instituciones»**. Con la PUCV fuera lo alcanza una sola, y si la matriz
  canónica es `.v2`, el techo es 20.
- `figures[]` publica **«31 / 110 · celdas sin concluir»**. Depende de la matriz
  que se elija.
- `subtitle` dice «once Escuelas y Facultades»; `descriptor` dice «comparador
  ordinal de diez instituciones». Las dos son correctas —la cohorte es de once y
  el comparador de diez— pero juntas se leen como contradicción y conviene
  desambiguarlas.
- `changelog[]` de la v2.0.0 describe el comparador; revisar si alguna frase
  queda falsa.

### En el complemento

`…/entregas/v2.0.0/complemento-pucv-v1.0.html`

Es el documento que **recibe** lo que sale del principal. Hay que:

- incorporar el perfil completo de la PUCV con sus diez capacidades, su
  puntuación y su banda cerrada, presentado **como caso y no como posición**;
- desarrollar las ventanas de oportunidad y los vacíos actuales, que es lo que
  el encargo pide y hoy está enunciado y no desarrollado;
- comprobar que sus seis menciones a «diez instituciones» siguen siendo ciertas
  después del recálculo.

---

## 5 · Cómo publicarlo cuando esté hecho

El original entregado **no se edita a mano**: es la fuente del que se derivan
los tres formatos. Se corrige, y después:

```bash
npm run informe:publicar     # capa de lectura + PDF + Word a 12 pt
npm run informe:calibrar     # sólo si cambian las figuras
npm run verify
```

Si el cambio altera cifras publicadas, **es una versión nueva** —v2.1.0— y no
una corrección en el sitio: se añade una entrada a `versions` en `reports.ts` y
la v2.0.0 se queda donde está, con su changelog diciendo qué se corrigió. Es la
regla del §8 de `CLAUDE.md` y aquí es especialmente importante, porque la v2.0.0
ya está publicada y alguien pudo citarla.

Ver [07 · Puente con el sitio](07-puente-con-el-sitio.md) y
[08 · El lector en línea](08-lector-en-linea.md).

---

## 6 · Lo que NO hay que hacer

- **No recalcular sin resolver el §2.** Elegir matriz por cuenta propia es
  decidir por el autor sobre once instituciones nombradas.
- **No borrar los datos de la PUCV.** Salen del comparador y entran al
  complemento; no desaparecen.
- **No reescribir la rúbrica.** Está cerrada desde antes de calcular, y ésa es
  la razón de que el comparador sea defendible. Si se toca, deja de serlo.
- **No sobrescribir la v2.0.0 publicada.**
