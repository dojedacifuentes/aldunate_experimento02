# Construcción del dataset canónico del Informe 01

Estos cinco scripts registran **cómo** se construyó
`content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/`
a partir de los cinco documentos de investigación profunda versionados en
`content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/`.

Se ejecutan desde la raíz del repositorio y en orden:

```bash
python3 scripts/informe-01/01-construir-fuentes.py
python3 scripts/informe-01/02-construir-iniciativas.py
python3 scripts/informe-01/03-construir-evidencias-y-universidades.py
python3 scripts/informe-01/04-construir-cobertura.py
python3 scripts/informe-01/05-construir-afirmaciones.py
```

Cada uno falla si la integridad referencial se rompe: una iniciativa que cita una
fuente inexistente, una afirmación que cita una evidencia inexistente, un
identificador repetido o una URL duplicada detienen la construcción.

## Qué es fuente de verdad y qué no

**Los CSV son la fuente de verdad.** Estos scripts son el registro auditable de
su primera construcción y llevan dentro la curaduría: qué prueba cada fuente,
qué límite tiene, a qué unidad se atribuye.

Si editas un CSV a mano, **no vuelvas a ejecutar el script correspondiente**: lo
sobrescribiría. Traslada el cambio al script y vuelve a ejecutarlo, o deja de
usarlo y anótalo en `docs/report-01/DECISIONS.md`. Dos fuentes de verdad para el
mismo archivo es exactamente el problema que la cadena de informes existe para
evitar.

## Por qué la curaduría vive en el código

El paso que no puede automatizarse es decidir *qué prueba* una fuente y *qué no
prueba*. Esa decisión está escrita, fuente por fuente, en el diccionario `ST` de
`03-construir-evidencias-y-universidades.py` y en las notas de
`01-construir-fuentes.py`. Ponerla en un script en vez de en un CSV generado a
mano permite que un tercero lea de una vez todas las lecturas y discuta con
ellas, en vez de reconstruirlas celda por celda.

## Lo que estos scripts NO hacen

No verifican contenido. Ninguno abre una URL. `last_verified` y `verified_by`
salen vacíos a propósito: la verificación sustantiva es responsabilidad de quien
firma y no se delega (`docs/report-01/DECISIONS.md`, DEC-108).
