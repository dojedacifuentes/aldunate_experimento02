# Pipeline de contenido e investigación

## 1. Ingesta
Todo contenido nuevo se clasifica como:
- fuente;
- paper;
- curso;
- informe;
- dataset;
- experimento;
- asset;
- nota.

## 2. Registro
Toda fuente de investigación debe incorporar:
`source_id, title, organization, url, published_date, accessed_date, geography, evidence_type, notes, confidence`.

## 3. Evidencia
Las afirmaciones importantes se vinculan con `source_id`.
Niveles:
- FACT;
- SIGNAL;
- INFERENCE;
- HYPOTHESIS;
- PENDING.

## 4. Versionado de informes
Nunca sobrescribir silenciosamente un informe publicado.
Estructura sugerida:
`public/v0.1/`, `public/v0.2/`, etc.
La UI muestra última versión y permite acceder a historial.

## 5. Publicación
Checklist:
- fuentes verificadas;
- fecha de actualización;
- resumen ejecutivo;
- metodología;
- limitaciones;
- visualizaciones legibles;
- PDF descargable;
- changelog;
- accesibilidad.

## 6. Investigación profunda
Separar:
- material bruto;
- notas;
- evidencia procesada;
- dataset;
- conclusiones;
- visualizaciones.

La interfaz puede ser tecnológica; la evidencia no puede ser decorativa.
