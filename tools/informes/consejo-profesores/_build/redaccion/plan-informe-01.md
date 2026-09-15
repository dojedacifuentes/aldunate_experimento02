# Plan del Documento A

## Identidad

- **Título:** Uso y enseñanza de inteligencia artificial en las escuelas de Derecho chilenas
- **Subtítulo:** Informe sobre capacidades institucionales, septiembre de 2026
- **Naturaleza:** informe de trabajo para la Dirección de la Escuela de Derecho de la PUCV y su Consejo de Profesores. Autor: Diego Hernán Ojeda Cifuentes. Deriva del informe experto v3.2.0 (corte de la evidencia: 6 de septiembre de 2026).
- **Extensión objetivo:** unas 15.500 palabras en total, nueve gráficos de barras y seis a ocho tablas. Con portada, índice y anexos, unas 50 páginas.
- **Registro:** el de la guía de estilo (`estilo/guia-de-estilo.md`), sección del Documento A: informe de estructura simple, títulos descriptivos, párrafos algo más breves que los de un artículo, notas al pie para las fuentes, sobriedad.

## Mensaje central

Entre las once escuelas estudiadas hay mucha actividad reciente y poca capacidad formalizada. Casi todo empezó en 2025 o 2026. Se crean unidades antes que reglas, la formación entra por diplomados y talleres antes que por la malla, y ninguna institución ha medido si lo que hace mejora el aprendizaje. El índice ordena a diez de ellas con una lógica verificable, pero parte de los primeros lugares descansa en fuentes que todavía no fueron contrastadas. La Escuela de Derecho de la PUCV tiene una base real y una distancia que es, en su mayor parte, documental.

## Reglas de contenido que valen para todo el documento

1. Toda cifra del índice sale de `puntaje/resultados.json`. Toda cifra de capacidades sale de la matriz vigente (en `hechos/instituciones/<id>.md`). Nunca de las fichas del anexo A, que conservan cifras antiguas.
2. La PUCV no tiene posición. No escribir que «encabezaría», «sería segunda» ni nada equivalente. Su índice (53,6) se informa en su capítulo, con la advertencia del sesgo del piloto.
3. Sesgo del piloto, con las cifras correctas: la PUCV tiene 14 fuentes frente a 3,8 de media en las ocho instituciones que no formaron parte del piloto, y 11 vías de búsqueda recorridas de 13 frente a 6,6 de media en esas ocho. No usar el «44 %».
4. Iniciativas por año: 17 en 2025 y 23 en 2026 (no al revés). De 53 iniciativas, 49 tienen fecha y 41 empiezan en 2025 o después (incluida una anunciada para 2027).
5. No heredar de la v3.2.0 las frases «la primera posición» de la PUCV, «18 sobre 30» como máximo, ni «seis decisiones» en el cuerpo del informe principal.
6. Lenguaje llano para los estados: formalizada (con instrumento publicado), en funcionamiento, incipiente, solo a nivel de la universidad, adyacente, no localizada, sin información concluyente. No usar «celda», «ruta», «OPF», «NC», «piso», «techo» ni «comparador» en el cuerpo; en su lugar, «capacidad», «vía de búsqueda», «valor mínimo acreditado», «margen» u «orden».
7. Ausencia de evidencia pública no es inexistencia. Se explica una vez, en el capítulo II, y en el resto basta con fórmulas breves («no consta públicamente», «no se localizó»).
8. La salvedad sobre ANID (registra adjudicaciones y no postulaciones) se dice una sola vez.
9. Nombres: primera mención completa (Pontificia Universidad Católica de Chile), después la forma breve (Universidad Católica de Chile o UC). Para la PUCV, «la Escuela» cuando el contexto es claro.
10. Personas: no nombrar a académicos salvo cuando la fuente pública lo hace y es necesario (por ejemplo, responsables de proyectos ANID en el anexo).

## Estructura

### Presentación · `00-presentacion.md` · 450 palabras
Sin título numerado (título «Presentación»). Encargo de la Dirección; qué contiene y cómo está ordenado; relación con el informe experto (la metodología completa y las tablas van en anexos); declaración de intereses en un párrafo: el autor trabaja en el Programa DIAT de la Escuela, por eso la PUCV se examina aparte y sin posición.

### Síntesis · `01-sintesis.md` · 900 palabras y una tabla
Título «Síntesis». Seis o siete conclusiones en párrafos breves numerados, cada uno con su dato. Una tabla con el orden (posición, institución, índice) generada a partir de `resultados.json`, más una línea con la PUCV sin posición. Se escribe al final, con los capítulos terminados a la vista.

### I. Introducción · `02-introduccion.md` · 900 palabras
- Por qué la pregunta importa ahora (en dos o tres párrafos, sin dramatizar): cambios en el ejercicio profesional y en la docencia.
- Preguntas del informe: qué capacidades han construido las escuelas, con qué grado de formalización y qué puede afirmarse con evidencia pública.
- Alcance: once instituciones, fuentes públicas, fecha de corte.
- Insumos: `insumos/informe-01/secciones/01-resumen-ejecutivo.txt`, `04-introduccion-y-objetivos.txt`, `03-como-leer.txt`.

### II. Cómo se midió · `03-metodo.md` · 1.500 palabras y tres tablas
- La cohorte de once y su criterio.
- Las fuentes: 96 públicas, de las cuales 74 fueron abiertas y contrastadas una por una; 22 provienen de una segunda ronda sin ese contraste; 31 fuentes de terceros (ANID, prensa, organismos).
- Las diez capacidades, con la pregunta que responde cada una (tabla).
- Los estados y su valor (tabla).
- El índice en lenguaje llano: cuatro dimensiones, pesos según la cercanía al aprendizaje del estudiante (tabla de dimensiones y pesos), margen por información no concluyente, índice verificado y pruebas de robustez. Sin fórmulas; la fórmula va al anexo A.
- Qué no mide el índice: calidad de la enseñanza, mérito de personas, actividad no publicada.
- Por qué la PUCV queda fuera del orden (un párrafo; remite al capítulo VII).
- Insumos: `puntaje/resultados.json` (campo `metodo`), `hechos/i01-pucv-y-metodo.json` (campo `metodologia`), `secciones/05-metodologia.txt`, `secciones/D-rubrica.txt`, `secciones/C-celdas.txt`.

### III. Panorama del campo · `04-panorama.md` · 2.000 palabras y cuatro gráficos
- Un fenómeno de dos años (gráfico `a01-iniciativas-anio`).
- Qué capacidades existen y cuáles no aparecen (gráfico `a02-estados-capacidad`): la evaluación de efecto no consta en ninguna.
- Estructura antes que reglas: seis de diez con unidad especializada en funcionamiento, dos con norma propia formalizada, y ninguna de las unidades creadas en 2025 y 2026 publica su acto de creación.
- La formación entra por diplomados, cursos y talleres; ninguna institución tiene una asignatura obligatoria de IA con créditos documentada.
- Buena parte de lo atribuido a las facultades pertenece a sus universidades (siete de once herramientas).
- Las iniciativas en la escalera de institucionalización: ninguna llega a resultados evaluados (gráfico `a03-escalera`).
- El financiamiento público: siete proyectos ANID de Derecho estudian la IA como objeto jurídico; ninguno, en ningún año, estudia la enseñanza del Derecho con IA; en otras disciplinas sí hay diez proyectos sobre IA y enseñanza (gráfico `a04-anid`).
- Insumos: `hechos/i01-transversal.json` (hallazgos H-1 a H-5 y H-7, `cifras_generales`, `anid`), `secciones/02-ocho-hallazgos.txt`, `secciones/06-panorama.txt`, `secciones/11-discusion.txt`.

### IV. Resultados por universidad · `05-resultados.md` · 1.500 palabras, tres gráficos y una tabla
- El orden del índice con su margen (gráfico `a05-ranking-icia`) y cómo leerlo.
- Perfiles por dimensión (gráfico `a06-subindices`): dónde está fuerte cada institución y dónde está vacío el campo entero (alcance y efecto).
- La solidez de los resultados (gráfico `a07-solidez`): la U. Central apoya el 47 % de su índice en fuentes sin contrastar, entre ellas la resolución cuya dirección hoy devuelve error; la U. Adolfo Ibáñez, el 58 %; la U. del Desarrollo, el 74 %. Si esas capacidades no se cuentan, la U. Central pasa del segundo al cuarto lugar.
- Robustez (tabla con posición base, rango en las 231 combinaciones de pesos y posición con solo fuentes contrastadas): las tres primeras son las mismas en todas las combinaciones; los lugares intermedios cambian.
- Lo que el orden no dice: no mide calidad docente ni mérito; mide capacidad acreditada públicamente.
- Insumos: `puntaje/resultados.json`, `redaccion/informe-01/B-matriz-y-resultados.md` (tablas ya generadas).

### V. Las diez facultades · dos archivos · 3.700 palabras
`06-facultades-a.md`: Universidad Católica de Chile, U. Central, U. Autónoma, U. de Chile, U. Andrés Bello.
`06-facultades-b.md`: U. Adolfo Ibáñez, U. Diego Portales, U. del Desarrollo, U. de Concepción, U. de los Andes.
Título del capítulo en el primer archivo; cada institución con un subtítulo (`## 1. Pontificia Universidad Católica de Chile`). Unas 370 palabras cada una: posición e índice; qué acredita y con qué instrumento; qué no consta; hallazgos de la verificación que corrigieron lecturas previas; advertencias (fuentes sin contrastar, direcciones caídas, anuncios no ejecutados). Sin adjetivos valorativos. Fuentes principales en notas al pie (título, editor, fecha, dirección).
- Insumos: `hechos/instituciones/<id>.md` de cada una.

### VI. El entorno regulatorio y profesional · `07-entorno.md` · 1.300 palabras
- La Comisión Nacional de Acreditación y la acreditación voluntaria de Derecho.
- La guía del Colegio de Abogados (6 de julio de 2026) y la de la Academia Judicial (7 de abril de 2026).
- La Política Nacional de Inteligencia Artificial y la formación jurídica.
- El colapso de la Oficina Judicial Virtual por escritos automatizados (28 de julio de 2026).
- La Ley 21.719, que rige desde diciembre de 2026.
- Movimientos en el mercado profesional y en otras facultades de la región (laboratorio presentado el 4 de septiembre de 2026).
- Referencia internacional breve: la asignatura obligatoria de IA es excepcional; dos modelos de norma de facultad; la fiabilidad medida de las herramientas jurídicas se trata en el Documento B.
- Insumos: `hechos/i01-transversal.json` (`contexto_externo`, `internacional`), `secciones/12-contraste-externo.txt`, `secciones/13-escala-internacional.txt`.

### VII. La Escuela de Derecho de la PUCV · `08-pucv.md` · 2.000 palabras, dos gráficos y una tabla
- Por qué está fuera del orden: conflicto de interés del autor y sesgo del piloto, con las cifras correctas de la regla 3.
- Su índice con el mismo sistema (53,6, sin posición) y sus subíndices frente al promedio de las diez (gráfico `a10-pucv-dimensiones`), con la advertencia de que el sesgo del piloto opera a su favor.
- Su perfil capacidad por capacidad (gráfico `a09-pucv-perfil`).
- Lo que acredita: certamen con cinco versiones, herramienta propia registrada y usada por el Poder Judicial, fondos concursables en dos años consecutivos, experiencia de aula, convenio con la Corte Suprema.
- Lo que falta, en tres grupos: capacidades que funcionan pero no tienen documento publicado; reglas y adopción que hoy existen a nivel de la universidad y no de la Escuela; y la evaluación de efecto, que no existe en ninguna institución.
- Opciones para la Escuela en una tabla (decisión, qué implica, quién decide, costo, plazo), con las seis decisiones del complemento, sin columna de puntos. La medición de efecto se presenta como opción de la Escuela, sin atarla a un curso ni a un relator.
- Un párrafo final que declare que estas opciones las formula una parte interesada.
- Insumos: `hechos/i01-pucv-y-metodo.json` (`pucv`), `hechos/instituciones/pucv.md`, `puntaje/resultados.json`, `insumos/informe-01/complemento-pucv-v1.2.txt`.

### VIII. Conclusiones · `09-conclusiones.md` · 1.200 palabras
- Seis a ocho conclusiones en prosa, cada una apoyada en lo expuesto (C-1 a C-8 del informe experto, adaptadas al índice nuevo).
- Las cuatro prioridades del campo (financiar investigación sobre la propia enseñanza, publicar los actos, cerrar la regla de uso, dotar de contraparte evaluadora), dirigidas a quien corresponde y no a una universidad nombrada.
- Lo que queda abierto.
- Insumos: `hechos/i01-transversal.json` (`conclusiones`, `prioridades`), `secciones/15-conclusiones.txt`, `secciones/16-implicancias.txt`.

## Anexos

- **Anexo A. Metodología** · `A-metodologia.md` · 1.800 palabras: protocolo y trece vías de búsqueda, estados y escalera, verificación de fuentes y divergencias encontradas, segunda ronda y direcciones caídas, fórmula del índice y pesos, variantes de sensibilidad, limitaciones, instituciones candidatas fuera de la cohorte, y nota sobre la elaboración (qué tareas se apoyaron en herramientas de IA y qué verificó personalmente el autor). Insumos: `puntaje/resultados.json`, `hechos/i01-pucv-y-metodo.json` (`metodologia`), `secciones/05-metodologia.txt`, `17-limitaciones.txt`, `19-nota-metodologica.txt`, `G-candidatas.txt`, `B-divergencias.txt`.
- **Anexo B. Matriz de capacidades y resultados** · `B-matriz-y-resultados.md` · generado por `anexos-informe-01.mjs`.
- **Anexo C. Instrumentos formales y proyectos ANID** · `C-instrumentos-y-anid.md` · generado por `anexos-informe-01.mjs`.

## Gráficos

| id | Capítulo | Qué muestra |
|---|---|---|
| a01-iniciativas-anio | III | Iniciativas por año de inicio declarado |
| a02-estados-capacidad | III | Estado de cada capacidad en las diez facultades |
| a03-escalera | III | Iniciativas según su grado de institucionalización |
| a04-anid | III | Proyectos ANID según su objeto |
| a05-ranking-icia | IV | Índice por institución, con margen |
| a06-subindices | IV | Subíndices por dimensión y promedio de las diez |
| a07-solidez | IV | Parte del índice sostenida por fuentes contrastadas y por fuentes pendientes |
| a09-pucv-perfil | VII | Puntos de la PUCV en cada capacidad |
| a10-pucv-dimensiones | VII | Subíndices de la PUCV frente al promedio de las diez |
