# Investigación avanzada sobre IA y Derecho en universidades chilenas: fase de establecimiento y piloto institucional

## Estado de la entrega, alcance y auditoría del corpus

**Versión de cohorte:** `COHORTE_IA_DERECHO_CHILE_11_V1`  
**Versión de protocolo declarada:** `METODOLOGIA_IA_DERECHO_V2.0`  
**Fecha de corte:** `2026-09-01`  
**Modelo utilizado:** `GPT-5.5 Thinking`  
**Fecha de ejecución:** `2026-09-01`  
**Instituciones revisadas en profundidad:** `pucv`, `puc-chile`, `uchile`  
**Universo longitudinal cerrado:** las once instituciones definidas por el manifiesto, sin adiciones, eliminaciones ni cambios de nombre.  
**Estado de integración:** `NO_INTEGRADO_AL_CANON`; todos los registros nuevos de esta entrega deben entenderse como propuestas para validación humana. Ningún hallazgo de esta investigación se marca `ACEPTADO`.

Esta entrega ejecuta la primera fase solicitada: auditoría del corpus, reconstrucción metodológica de la línea base 2025, fijación del universo, protocolo de búsqueda, diseño de matriz, piloto sobre PUCV–UC–Universidad de Chile y prueba de escalabilidad. **No constituye el informe nacional definitivo ni autoriza inferencias sobre el conjunto del sistema universitario chileno.**

### Auditoría del corpus recibido

| ID de corpus | Material | Función admisible | Auditoría |
|---|---|---|---|
| `CORPUS-001` | Manifiesto entregado en esta conversación | Regla de investigación | Se adopta como instrucción rectora de esta ejecución. Define cohorte, jerarquía, estados, fecha de corte y obligación de trazabilidad. |
| `CORPUS-002` | “Edición 2 informe mapeo IA y Derecho en Universidades…” | Línea base **no verificada** e inventario de pistas | Contiene las once universidades y un esquema de cinco dimensiones, pero sus afirmaciones y puntuaciones no se heredan. Además, aunque se presenta como revisión correspondiente a 2025, contiene iniciativas expresamente fechadas en 2026, de modo que no puede tratarse como un *snapshot* puro de 2025. fileciteturn0file0 |
| `CORPUS-003` | Informe web sobre IA y escuelas de Derecho | Presentación y estado del proyecto | La propia página lo presenta como trabajo en fase de investigación y separa fuentes, evidencias, datos y conclusiones. No es fuente probatoria sobre universidades. citeturn0view0 |
| `CORPUS-004` | Arquitectura general de investigación | Referencia de arquitectura | Es especialmente útil la cadena `Fuente → Evidencia → Dato → Visualización → Conclusión`; no reemplaza el protocolo canónico. La página presenta, además, información que debe reconciliarse: aparecen contadores de registros y, en otra zona, una indicación de registros todavía vacíos. citeturn0view1 |
| `CORPUS-005` | Informe “Transformación de la enseñanza del Derecho” | Referencia de diseño y versionado | Se utiliza solamente como patrón de presentación, trazabilidad y separación web/PDF, conforme al mandato recibido. citeturn0view2 |

Hay una limitación procedimental crítica: **en esta sesión no quedó expuesto el expediente canónico completo** —registro de universidades, iniciativas, fuentes, matriz, afirmaciones, evaluaciones, conflictos, decisiones, changelog— ni el último paquete `HANDOFF`; tampoco se recibió como archivo autónomo el contenido íntegro de `METODOLOGIA_IA_DERECHO_V2.0`. Por tanto, no es posible cotejar esta investigación registro a registro con el estado canónico previo ni comprobar posibles decisiones humanas que hayan resuelto conflictos anteriormente.

Esto activa la regla de no sobrescritura: la investigación puede avanzar como descubrimiento y contraste, pero **la integración queda detenida antes de `ACEPTADO`**. El conflicto se registra como:

`CONF-001_EXPEDIENTE_CANONICO_AUSENTE` — severidad `ALTA` — disposición: `INVESTIGAR_SIN_INTEGRAR`.

Un segundo problema afecta a la línea base. El documento anterior combina en la misma puntuación actividades donde la IA es central con actividades generales de protección de datos, ciberseguridad, innovación y derecho digital; bajo las nuevas definiciones, varias de estas últimas deben clasificarse como `ADYACENTE` hasta que una fuente demuestre que la IA desempeña un papel central. También mezcla, en ocasiones, infraestructura universitaria con evidencia específica de la Facultad de Derecho. fileciteturn0file0

En consecuencia, los puntajes heredados —PUCV `3,25`, UC `12` y Universidad de Chile `10` en el documento base— se preservan únicamente como `legacy_score_unverified`; **no se recalculan ni utilizan para ordenar instituciones en esta fase**. fileciteturn0file0

La cohorte permanece exactamente como fue fijada:

`puc-chile`, `uchile`, `udp`, `uandes`, `uai`, `unab`, `udd`, `uautonoma`, `ucentral`, `pucv`, `udec`.

Durante la búsqueda apareció además la Universidad Austral de Chile en una fuente secundaria que describía cambios en la formación jurídica frente a nuevas tecnologías. No se incorporó a ninguna comparación y se registra exclusivamente como `CANDIDATA_FUERA_DE_COHORTE-UACh-001`, `PROPUESTO`, `NO_VERIFICADO_EN_FUENTE_ORIGINAL`. citeturn14search0

## Método reproducible y matriz definitiva de evidencia

La principal corrección metodológica respecto del informe anterior consiste en **separar la existencia de una actividad, su relación sustantiva con IA y Derecho y su grado de institucionalización**. Un seminario sobre IA, un curso obligatorio, un laboratorio financiado y una política académica no son unidades intercambiables y no deberían transformarse automáticamente en cuartos de punto dentro de un mismo total.

### Reconstrucción temporal

Para continuidad longitudinal propongo definir la **línea base histórica 2025 como el estado verificable al 31 de diciembre de 2025**. Cada registro debe conservar por separado:

`event_date` — cuándo ocurrió el hecho;  
`publication_date` — cuándo fue publicada la fuente;  
`valid_from` y `valid_to` — cuando sea posible determinar vigencia;  
`accessed_at` — cuándo se comprobó la fuente;  
`cutoff_eligible` — si puede informar el estado al `2026-09-01`.

Así, una noticia de enero de 2026 puede demostrar inequívocamente que una cohorte se ejecutó en 2025, pero no puede retrotraerse una iniciativa de 2026 al estado 2025 simplemente porque aparezca en un documento retrospectivo. El mismo criterio debe aplicarse al corte de septiembre de 2026.

### Protocolo homogéneo de búsqueda

Para cada una de las once universidades debe ejecutarse la misma batería, variando únicamente el dominio y el nombre de institución/unidad. La búsqueda no comienza preguntando “qué tan avanzada está la universidad”, sino buscando entidades observables.

| Capa | Búsqueda homogénea | Regla de inclusión |
|---|---|---|
| Currículo | `IA`, `inteligencia artificial`, `IA generativa`, `algoritmo`, `legaltech` + `malla`, `asignatura`, `curso`, `programa`, `seminario de título`, `clínica` | Se registra el curso; sólo se clasifica A/B/C si una descripción o syllabus demuestra centralidad de IA. |
| Postgrado y continua | mismos términos + `diplomado`, `diploma`, `magíster`, `curso`, `educación continua` | `Ofertado` y `Ejecutado` son estados distintos. Una página de matrícula no prueba realización. |
| Investigación | mismos términos + `centro`, `programa`, `laboratorio`, `proyecto`, `tesis`, `Fondecyt`, `Fondef`, `ANID`, `fondo`, `convenio de investigación` | Se distingue estructura permanente, proyecto, publicación y trabajo individual. |
| Vinculación y transferencia | `seminario`, `congreso`, `taller`, `convenio`, `Poder Judicial`, `legaltech`, `estudio jurídico`, `empresa`, `sector público` | Un congreso general de Derecho y Tecnología es `ADYACENTE` salvo sus sesiones específicamente IA. |
| Uso y gobernanza | `lineamiento`, `política`, `guía`, `integridad`, `evaluación`, `agente`, `asistente`, `IA generativa`, `docencia` | Registrar alcance exacto: universidad, facultad, carrera, curso o persona. |
| Recursos y sostenibilidad | `fondo`, `adjudicación`, `presupuesto`, `financiamiento`, `director`, `equipo`, `convocatoria`, `versión` | Financiamiento competitivo no se equipara a presupuesto basal; reiteración anual sí es evidencia de continuidad. |
| Evaluación | `resultado`, `evaluación`, `encuesta`, `usuarios`, `participantes`, `impacto`, `KPI`, `aprendizaje` | Contar asistentes es una métrica de alcance, no automáticamente una evaluación de resultados. |

El orden de autoridad para búsqueda queda: **documento normativo/curricular oficial → página oficial de universidad o facultad → repositorio institucional → organismo financiador o contraparte pública original → fuente secundaria solamente para descubrimiento**. Esta lógica coincide con la arquitectura pública del proyecto, que exige que la fuente anteceda al dato y a la conclusión. citeturn0view0turn0view1

También queda prohibida una práctica que afectaba el informe anterior: inferir inexistencia desde el silencio web. El registro adecuado es `SIN_EVIDENCIA_PUBLICA_LOCALIZADA_TRAS_BUSQUEDA_X`, acompañado del *search log*. La arquitectura del propio proyecto advierte que falta de evidencia pública no equivale a inexistencia. citeturn0view0

### Esquema definitivo de la matriz

La matriz debería contener, como mínimo, los siguientes grupos de campos:

| Grupo | Campos |
|---|---|
| Identidad | `evidence_id`, `initiative_id`, `university_id`, `unit_id`, `canonical_name`, `alias_observed` |
| Fuente | `source_id`, `source_type`, `source_original`, `publisher`, `url`, `publication_date`, `accessed_at`, `archive_ref` |
| Temporalidad | `event_date`, `valid_from`, `valid_to`, `cutoff_eligible`, `historical_reconstruction` |
| Contenido | `atomic_proposition`, `evidence_note`, `initiative_direction` = A/B/C/D |
| Función | `pregrado`, `postgrado_continua`, `investigacion`, `vinculacion_transferencia`, `uso_gobernanza` |
| Alcance | `universidad`, `facultad`, `escuela`, `centro_programa`, `curso`, `persona` |
| Institucionalización | `governance`, `curricularity`, `continuity`, `funding`, `staffing`, `transversality`, `implementation`, `evaluation_outcomes` |
| Calidad | `directness`, `source_authority`, `confidence`, `status` |
| Historial | `relation_to_prior` = `CONFIRMA/AMPLIA/MATIZA/CONTRADICE/SUSTITUYE`, `predecessor_id`, `change_reason` |
| Control | `model`, `reviewer`, `reviewed_at`, `human_decision_id`, `version` |

La clasificación A/B/C/D debe hacerse **antes** de cualquier valoración de madurez. Por ejemplo, una asignatura denominada “Informática Jurídica” no pasa automáticamente a `IA_PARA_DERECHO`; un diplomado de protección de datos no pasa automáticamente a `DERECHO_DE_IA`; un laboratorio de innovación legal no pasa automáticamente a `AMBOS`. Hay que demostrar el componente de IA en la fuente primaria.

Para mantener continuidad con 2025 sin perpetuar el sesgo del antiguo total de 15 puntos, recomiendo conservar las cinco dimensiones históricas como una capa de presentación, pero evaluar institucionalización mediante un **vector no aditivo**:

`GOV` gobernanza formal; `CUR` currículo; `RES` investigación; `OPS` utilización real; `EXT` transferencia; `FIN` recursos; `CONT` continuidad; `TRANS` transversalidad; `EVAL` medición de resultados.

Sólo cuando existan registros `ACEPTADO` podría una decisión metodológica posterior definir si esos indicadores deben transformarse o no en un índice.

## Reconstrucción crítica de la línea base 2025

La auditoría muestra que el documento de referencia es valioso como **mapa de búsqueda**, pero no como base congelada de hechos. En las tres instituciones piloto aparecen correcciones importantes.

### Panorama de las tres instituciones

| Universidad | Qué decía sustancialmente la línea base | Qué permite reconstruir la evidencia original | Consecuencia propuesta |
|---|---|---|---|
| `pucv` | Pregrado prácticamente limitado a “Derecho Informático”; algunos núcleos de innovación; `Uso interno IA = 0`; total legado 3,25. fileciteturn0file0 | Antes de terminar 2025 ya existían integración de IA en Filosofía del Derecho, un optativo que incluye IA y automatización legal, ScribeClaroPUCV para escritura jurídica, financiamiento VcM específico, talleres de prompting, DIAT/LMIL e investigación interdisciplinaria con IA. citeturn15search7turn15search2turn15search4turn16search4turn16search5turn16search1 | La caracterización 2025 queda **materialmente incompleta** y el `Uso interno = 0` debe proponerse para sustitución. |
| `puc-chile` | Desarrollo alto, Programa Derecho Ciencia y Tecnología, continua, actividades y AyudantIA; total legado 12. fileciteturn0file0 | A fines de 2025 la Facultad formalizó un Departamento de Derecho y Tecnología; en 2026 aparecen además reglas universitarias y una guía propia de Derecho para IA. AyudantIA sí es infraestructura institucional UC, pero la fuente general no demuestra por sí sola utilización concreta por Derecho. citeturn19search2turn19search12turn19search0turn13search1 | La posición cualitativa alta parece tener fundamento estructural, pero deben **separarse ámbito UC y adopción específica de Derecho** y eliminar del cómputo automático actividades sólo adyacentes. |
| `uchile` | Centro especializado, amplia oferta, fuerte vinculación; curso de Informática Jurídica; `Uso interno IA = 0`; total legado 10. fileciteturn0file0 | El curso de Informática Jurídica se verifica oficialmente en 2025, pero sin syllabus no puede asegurarse que IA sea central; CE3 muestra actividad sostenida, existen proyectos de IA también fuera del CE3 y dos tesis IA en 2025. Al corte 2026, lineamientos universitarios obligan a declarar IA en tesis. citeturn14search2turn20search13turn20search0turn21search0turn20search2 | Se confirma una capacidad relevante, pero es necesario **desagregar Derecho y Tecnología de IA específica**, y `Uso interno IA = 0` queda superado al corte 2026. |

La PUCV constituye el caso más claro de por qué el puntaje histórico no debe heredarse. El Programa/Núcleo DIAT tenía actividad pública al menos desde 2023; en abril de 2024 la Escuela ya había introducido ChatGPT en una asignatura regular de Filosofía del Derecho mediante “Prompts Socráticos”, en un proyecto respaldado por la Vicerrectoría Académica. citeturn18search1turn18search12 En enero de 2025 la universidad presentó ScribeClaroPUCV como un asistente basado en IA específicamente diseñado para estudiantes de Derecho y originado en un proyecto de Desarrollo Docente de la Vicerrectoría Académica. citeturn15search4 Por tanto, la afirmación histórica “Uso interno IA: 0” no es compatible con el corpus original localizado para 2025. fileciteturn0file0

Otro problema es la distinción entre **actividad anunciada y actividad ejecutada**. La página actual de la Universidad de Chile para el Diploma en Derecho e Inteligencia Artificial del segundo semestre de 2026 especifica que sus datos son referenciales y que el programa puede suspenderse si no alcanza matrícula mínima. Hasta obtener evidencia de inicio o cierre, sólo corresponde `OFERTADO`, no `EJECUTADO`. citeturn20search4

La reconstrucción confirma así tres reglas que deberían ser obligatorias al extender el trabajo: **no heredar puntajes; no equiparar oferta con ejecución; no convertir temas adyacentes en IA específica sin prueba textual.**

## Investigación piloto trazable

Las siguientes son **evidencias propuestas**, no registros aceptados. En el paquete reproducible anexo cada una posee un `evidence_id` y se vincula a uno o más `source_id`.

### Registros del piloto PUCV

| Evidencia | Hallazgo y clasificación | Consecuencia |
|---|---|---|
| `EV-PUCV-001` | El Legal Management Innovation Lab fue creado en enero de 2022 mediante colaboración PUCV–Thomson Reuters, con ejes de reflexión, networking y desarrollo de proyectos. Por su definición original se clasifica `ADYACENTE`, no IA específica. citeturn18search0 | Acredita infraestructura de innovación jurídica anterior a la ola generativa y permite estudiar continuidad. |
| `EV-PUCV-002` | En noviembre de 2023 existe fuente oficial para el “Núcleo de Derecho, Inteligencia Artificial y Tecnología” de la Escuela. citeturn18search1 | Acredita continuidad temporal del núcleo IA-Derecho, aunque la nomenclatura posterior exige normalización. |
| `EV-PUCV-003` | En abril de 2024 el DIAT integró IA en **Filosofía del Derecho** mediante “Prompts Socráticos”, ChatGPT 3.5, *role play* judicial y mejora argumentativa; el proyecto pertenecía a “Innovación en la Educación” de la Vicerrectoría Académica. `IA_PARA_DERECHO`. citeturn15search7 | Evidencia directa de integración de IA dentro de una asignatura jurídica regular; no equivale a que la asignatura completa sea de IA. |
| `EV-PUCV-004` | ScribeClaroPUCV fue lanzado en enero de 2025 como asistente web de IA para estudiantes de Derecho, destinado a escritura jurídica clara e integridad académica, impulsado desde la Vicerrectoría Académica. `IA_PARA_DERECHO`. citeturn15search4 | Contradice directamente el registro histórico “Uso interno IA: 0”. |
| `EV-PUCV-005` | Una fuente oficial de julio de 2025 identifica el optativo de pregrado **Derecho, Innovación y Tecnología** y señala contenidos de IA, automatización legal y ética tecnológica. `IA_PARA_DERECHO`; `FUENTE_ABIERTA`, pendiente syllabus. citeturn15search2 | La línea base que sólo consignaba “Derecho Informático” requiere sustitución o ampliación. |
| `EV-PUCV-006` | LMIL/DIAT obtuvieron fondos concursables de Vinculación con el Medio en 2025; el financiamiento sostuvo, entre otras actividades, formación en prompting para estudiantes. citeturn16search4turn16search5 | La tesis de una PUCV simplemente “no financiada” queda refutada en sentido literal. Sigue abierto si existe presupuesto basal permanente. |
| `EV-PUCV-007` | El Taller de Prompting en IA Generativa se ejecutó los días 3, 10 y 24 de septiembre de 2025 y reunió cerca de 90 participantes entre estudiantes, egresados y profesionales. `IA_PARA_DERECHO`. citeturn16search5 | Demuestra ejecución y aporta una métrica de alcance, pero no una evaluación de aprendizaje. |
| `EV-PUCV-008` | Innova Day 2025, cuarta edición, reunió Derecho e Ingeniería y comprendió un convenio PUCV–Alto para investigar datos sobre delitos contra la propiedad usando modelos matemáticos e IA; además hubo panel sobre IA en persecución penal. La iniciativa general es `ADYACENTE`, mientras este subproyecto es `AMBOS`. citeturn16search1 | Evidencia investigación aplicada y transversalidad; evita sobrecontar todo Innova Day como IA. |
| `EV-PUCV-009` | En enero de 2026 la PUCV presentó un decálogo institucional sobre IA en docencia con foco en integridad académica, elaborado por Desarrollo Docente y liderado por una académica de Derecho; incorpora reglas de uso, declaración, evaluación de proceso y protección de competencias. citeturn17search0 | Aporta gobernanza universitaria efectiva que alcanza a Derecho. |
| `EV-PUCV-010` | En febrero de 2026 la universidad informó que ScribeClaroPUCV, originalmente desarrollado para estudiantes de Derecho, ya estaba siendo utilizado por el Poder Judicial. citeturn15search5 | Acredita continuidad durante más de un año y transferencia fuera de la universidad. |
| `EV-PUCV-011` | En junio de 2026 Facultad y Escuela de Derecho obtuvieron nuevamente fondos VcM para Innova Day y un Taller de IA y Prompting Jurídico, este último con flujos de trabajo, automatización, varios modelos generativos, regulación, ética y supervisión humana y colaboración con Ingeniería. citeturn15search1 | Evidencia financiación reiterada y transversalidad interfacultades. |

Existe además continuidad más larga de Innova Day: LMIL ya convocaba la actividad en 2022 y la fuente institucional de 2026 describe la próxima como quinta versión desde 2022. citeturn18search2turn16search3 Eso vuelve metodológicamente insostenible caracterizar todo el ecosistema como una colección puramente episódica, aunque no todas sus ediciones sean específicamente de IA.

También aparece un **conflicto de identidad de iniciativa**. Las páginas oficiales han usado, en distintos momentos, “Núcleo de Derecho, Inteligencia Artificial y Tecnología”, “Programa de Derecho, Inteligencia Artificial y Tecnología”, “Programa de Derecho e Inteligencia Artificial” y, en alguna comunicación, “Programa de Derecho, Innovación y Tecnología”. citeturn18search1turn15search0turn16search4turn15search11 Se registra como `CONF-PUCV-001_NOMENCLATURA_DIAT`. No debe corregirse silenciosamente: el expediente necesita un `initiative_id` único con aliases fechados o, si hubo efectivamente transformaciones organizativas, iniciativas/versiones sucesoras.

### Registros del piloto Pontificia Universidad Católica de Chile

| Evidencia | Hallazgo y clasificación | Consecuencia |
|---|---|---|
| `EV-UC-001` | Derecho UC formalizó el **Departamento de Derecho y Tecnología** el 31 de diciembre de 2025. Por ser una estructura de alcance tecnológico general se registra inicialmente `ADYACENTE`; sus iniciativas IA deberán desagregarse. citeturn19search2 | Es evidencia fuerte de gobernanza y estructura, que el antiguo puntaje no modelaba adecuadamente. |
| `EV-UC-002` | En enero de 2026 la Facultad informó que el Programa de Derecho, Ciencia y Tecnología se encontraba consolidado en investigación, formación y vinculación y designó formalmente nuevo director. citeturn19search18 | La existencia del programa está contrastada; sus autodescripciones de “consolidación” deben verificarse mediante registros atómicos antes de ser una evaluación aceptada. |
| `EV-UC-003` | La UC publicó el 2 de marzo de 2026 lineamientos institucionales para integración de IA en pregrado, postgrado y educación continua, con cinco categorías de uso y deber de declaración. citeturn19search0 | Proporciona gobernanza universitaria formal aplicable a Derecho. |
| `EV-UC-004` | En la apertura académica 2026, Derecho UC informó que por primera vez el formulario de condiciones y evaluaciones ofrecía a los profesores una opción formal de integración de IA en sus cursos. citeturn13search2 | Es un paso de gobernanza curricular, pero no demuestra cuántos profesores lo utilizaron. |
| `EV-UC-005` | El 21 de agosto de 2026 Derecho UC publicó una **Guía Ética para el uso de IA generativa**: autonomía del profesor, deber de transparencia, conservación de interacciones durante tres meses, infracciones y posibilidad de verificación oral. El documento fue elaborado por una comisión con distintas unidades y aprobado por órganos de la Facultad. citeturn13search1 | Es la evidencia más fuerte del piloto de gobernanza de IA propia de una Facultad de Derecho. |
| `EV-UC-006` | La UC realizó entre julio y diciembre de 2025 su primer diagnóstico institucional de IA, con 2.329 respuestas; el informe público reportó uso regular de IA por 93,7 % de estudiantes y 72,2 % de académicos. citeturn19search5 | Demuestra una capacidad universitaria de medición; la fuente revisada no ofrece desglose específico para Derecho. |
| `EV-UC-007` | AyudantIA permite a profesores UC crear agentes de IA generativa personalizados para sus cursos; la evidencia pública confirma despliegue institucional en numerosas facultades y cursos. citeturn19search12turn19search3 | Debe evitarse la inferencia del informe anterior “UC tiene AyudantIA, luego Derecho utiliza AyudantIA”: el uso específico en Derecho aún requiere fuente. |

La UC exhibe asimismo numerosas actividades directamente relacionadas con IA: en abril de 2025 el Programa organizó un seminario sobre prácticas jurídicas e IA y otro sobre IA, transparencia y democracia; en octubre de 2025 las Jornadas Calímaco incluyeron IA y protección de datos. citeturn13search8turn13search14 Esto respalda la existencia de una agenda IA sustantiva, pero el nuevo método las mantiene separadas de la estructura más amplia de Derecho y Tecnología.

Un hallazgo metodológicamente importante es que la infraestructura institucional UC es notablemente más amplia que la evidencia específica de Derecho. AyudantIA tiene datos de utilización y evaluación a escala universitaria —el piloto de 2025 alcanzó decenas de cursos y la evaluación reportada en 2026 mostró valoraciones docentes positivas—, pero ello no permite transferir automáticamente esas métricas a la Facultad de Derecho. citeturn19search9

### Registros del piloto Universidad de Chile

| Evidencia | Hallazgo y clasificación | Consecuencia |
|---|---|---|
| `EV-UCH-001` | U-Cursos confirma que **Informática Jurídica (Interacción entre Derecho y Tecnologías)** se dictó en Derecho durante el segundo semestre de 2025. citeturn14search2 | Se confirma existencia, pero se clasifica provisionalmente `ADYACENTE`: sin programa del curso no hay prueba suficiente de centralidad de IA. |
| `EV-UCH-002` | El Consejo de Facultad confirmó a Alberto Cerda como director del CE3 desde el 1 de enero de 2025; la propia fuente describe objetivos de fortalecer pre/postgrado, formalizar líneas de investigación e intensificar colaboración externa. citeturn20search13 | Confirma continuidad institucional del CE3, pero CE3 es Derecho–Tecnología en sentido amplio, no sinónimo de IA. |
| `EV-UCH-003` | El Departamento de Derecho Privado desarrolló en mayo de 2025 un congreso vinculado al proyecto sobre problemas de IA para responsabilidad civil y consumo, con regulación, contratos, daños y derechos fundamentales. `DERECHO_DE_IA`. citeturn20search0 | Relevante porque muestra actividad IA fuera del CE3; aporta transversalidad intrafacultad. |
| `EV-UCH-004` | El repositorio de CE3 registra dos tesis 2025 específicamente bajo “Inteligencia Artificial”: IA como herramienta auxiliar de jueces y propiedad intelectual sobre obras creadas por IA. citeturn21search0 | Evidencia producción estudiantil formal vinculada a IA. |
| `EV-UCH-005` | CE3 informó que durante 2025 sus académicos impartieron más de veinte cursos de pre y postgrado a más de 350 egresados, en un portafolio que incluía regulación de IA además de datos, propiedad intelectual, transformación digital, ciberseguridad y otras materias. citeturn20search5 | Acredita escala formativa del centro, pero **no** autoriza decir que los más de veinte cursos fueron cursos de IA. |
| `EV-UCH-006` | El Diploma Derecho e Inteligencia Artificial se encuentra publicado para el segundo semestre de 2026, pero la propia página advierte que la información es referencial y que el programa puede ser suspendido. citeturn20search4 | Estado correcto: `OFERTADO_PENDIENTE_VERIFICAR_EJECUCION`. |
| `EV-UCH-007` | La Universidad de Chile dispone al corte de lineamientos que obligan a todo trabajo de titulación de pregrado y graduación de postgrado a declarar herramientas de IA, etapas, finalidad y, cuando el uso es sustantivo, prompts y metodología; la responsabilidad sigue siendo humana. citeturn20search2 | La afirmación `Uso interno IA = 0` queda superada para 2026 al menos en el nivel de gobernanza universitaria que se aplica a estudiantes de Derecho. |

Hay además evidencia directa de una agenda IA sustantiva en Derecho: en mayo de 2025 el Departamento de Derecho Procesal organizó un seminario de dos días sobre **IA y acceso a la justicia**, incluyendo marco normativo, aplicaciones al Derecho e implementación institucional de IA. citeturn20search12

La continuidad de formación especializada precede a 2025: existen páginas oficiales para versiones del Diploma en Derecho e Inteligencia Artificial iniciadas en 2022 y 2023. citeturn20search8turn20search9 Esto prueba antecedentes históricos del programa, pero no debe utilizarse sin más como evidencia de que hubo una edición ejecutada en 2025.

En síntesis del piloto, las tres universidades poseen evidencia real de IA y Derecho, pero **la arquitectura de la capacidad es distinta**. La PUCV combina núcleos, experimentación docente, innovación legal y proyectos aplicados; la UC añade una capa particularmente visible de estructura departamental, normativa institucional y normativa propia de Facultad; la Universidad de Chile presenta una estructura histórica de Derecho y Tecnología, producción académica y despliegue de IA también en departamentos doctrinales, mientras su gobernanza de uso de IA identificada en esta fase proviene principalmente del nivel universitario. Esta es una comparación descriptiva de evidencias localizadas, no un ranking ni una conclusión de madurez aceptada. citeturn15search4turn19search2turn13search1turn20search0turn20search2

## Prueba de la hipótesis PUCV y escalabilidad

La hipótesis sometida a prueba fue:

> “La PUCV dispone de iniciativas relevantes en IA y Derecho, pero todavía no las ha convertido en una capacidad institucional coherente, transversal, sostenida, financiada y evaluable”.

El piloto **no permite confirmarla en su formulación literal**. La evidencia obliga a descomponerla.

| Componente | Resultado provisional | Fundamento |
|---|---|---|
| **“Dispone de iniciativas relevantes”** | `FUERTEMENTE_APOYADO` | DIAT, integración en Filosofía del Derecho, curso optativo, ScribeClaro, talleres de prompting e investigación aplicada son iniciativas directamente conectadas con IA y Derecho. citeturn18search12turn15search2turn15search4turn16search5turn16search1 |
| **“No es coherente”** | `MATIZADO` | LMIL y DIAT aparecen repetidamente coorganizando iniciativas; ScribeClaro conecta Escuela de Derecho con Vicerrectoría Académica; existe, por tanto, cierta articulación observable. No se encontró, sin embargo, evidencia pública de una estrategia única de Facultad que integre currículo, investigación, uso, recursos y resultados bajo gobernanza común. citeturn16search5turn15search4turn16search1 |
| **“No es transversal”** | `CONTRADICHO_EN_SENTIDO_ABSOLUTO` | Hay colaboración Derecho–Ingeniería, participación de Vicerrectoría Académica, Vinculación con el Medio y proyectos multidisciplinares. citeturn15search7turn16search1turn15search1 La cuestión abierta es si esa transversalidad se ha convertido en arquitectura permanente y generalizada. |
| **“No es sostenida”** | `CONTRADICHO_EN_SENTIDO_ABSOLUTO` | LMIL existe desde 2022; el núcleo IA está documentado desde 2023; Prompts Socráticos desde 2024; ScribeClaro, prompting e Innova Day continúan en 2025–2026. citeturn18search0turn18search1turn15search7turn15search5turn16search3 |
| **“No es financiada”** | `CONTRADICHO_EN_SENTIDO_LITERAL` | Existen adjudicaciones explícitas de fondos VcM en 2025 y nuevamente en 2026. citeturn16search4turn15search1 No está probado un presupuesto basal permanente, dotación estable o financiamiento plurianual propio. |
| **“No es evaluable”** | `PARCIALMENTE_APOYADO` | Hay métricas de alcance —por ejemplo, cerca de 90 participantes en prompting y cerca de 100 en Match Making— y continuidad observable, pero la búsqueda no localizó una matriz pública de indicadores, evaluación de aprendizaje, resultados, impacto o metas de portafolio. citeturn16search5turn16search6 La ausencia pública no prueba inexistencia interna. |

La **inferencia propuesta**, pendiente de validación humana, debería por tanto reformularse así:

`CLM-PUCV-HYP-001-PROPUESTO` — **La PUCV ya posee un portafolio sostenido y parcialmente transversal de iniciativas relevantes en IA y Derecho, con evidencia de integración docente, transferencia y financiamiento competitivo. Lo que todavía no queda demostrado públicamente es que ese portafolio se encuentre reunido en una estrategia única de Facultad con gobernanza consolidada, trayectoria curricular reconocible, recursos basales estables y un sistema común de evaluación de resultados.** Esta lectura está mejor respaldada por el corpus localizado que la hipótesis original en términos absolutos. citeturn18search0turn15search4turn16search1turn16search4turn15search1turn17search0

Esta matización es estratégicamente importante para el profesor Eduardo Aldunate Lizana: el problema que surge del piloto **no parece ser la inexistencia ni siquiera la pura discontinuidad de iniciativas**, sino la posibilidad de que capacidades ya existentes permanezcan insuficientemente formalizadas como un sistema visible, gobernable y medible. Esa diferencia cambia el diagnóstico y, eventualmente, el tipo de decisión institucional: antes de crear más actividades, habría que determinar mediante documentación interna si conviene **articular, gobernar, financiar basalmente y evaluar** las que ya existen. Se trata todavía de una inferencia estratégica, no de una conclusión `ACEPTADO`. citeturn15search4turn16search3turn17search0

### Escalabilidad

Resultado del piloto: `ESCALABLE_CON_CONDICIONES`.

El método puede escalar de manera homogénea a las **ocho instituciones restantes de la cohorte** porque las variables fundamentales son observables y repetibles. El piloto mostró, sin embargo, cuatro fuentes sistemáticas de error que deben bloquearse antes de ampliar la búsqueda:

**Primero, centralidad de IA.** La Universidad de Chile demuestra el problema: “Informática Jurídica” existe, pero sin syllabus continúa `ADYACENTE`; de manera análoga, un centro de Derecho y Tecnología o un curso de protección de datos no deben transformarse automáticamente en avance específico de IA. citeturn14search2turn20search13

**Segundo, alcance institucional.** AyudantIA pertenece a la UC y sus datos institucionales no son automáticamente datos de Derecho UC; los lineamientos sobre tesis de la Universidad de Chile sí alcanzan Derecho, pero son una política universitaria, no una política creada por la Facultad. citeturn19search12turn20search2

**Tercero, estado de ejecución.** Una oferta publicada, como el Diploma Derecho e IA 2026 de la Universidad de Chile, debe permanecer distinta de una cohorte efectivamente cursada. citeturn20search4

**Cuarto, institucionalización multidimensional.** PUCV demuestra que una facultad puede tener continuidad, financiación competitiva y transversalidad sin que ello pruebe presupuesto permanente, planificación de portafolio o evaluación de resultados. citeturn16search4turn15search1

Por tanto, el método es apropiado para **escalar a `COHORTE_IA_DERECHO_CHILE_11_V1`**, pero esa cohorte seguirá siendo longitudinal y cerrada, no estadísticamente representativa. Un eventual estudio de “todo Chile” necesitaría una capa adicional de definición del universo y cobertura; no corresponde incorporar universidades externas a las comparaciones de este proyecto sin una nueva decisión canónica.

## Registros propuestos, contradicciones y paquete HANDOFF

Esta ejecución produjo un paquete estructurado con registros de fuente, evidencia, conflictos, afirmaciones afectadas y pendientes. Los archivos no modifican el expediente canónico.

**[Descargar paquete reproducible XLSX](sandbox:/mnt/data/ia_derecho_chile_fase1_piloto_2026-09-01/paquete_piloto_ia_derecho_chile_2026-09-01.xlsx)**

**[Descargar paquete completo CSV/JSON/XLSX](sandbox:/mnt/data/ia_derecho_chile_fase1_piloto_2026-09-01.zip)**

### Fuentes nuevas principales

El registro generado contiene **25 fuentes públicas originales propuestas**. Entre las más decisivas para la auditoría están las siguientes:

| `source_id` | Universidad | Fuente / función probatoria |
|---|---|---|
| `SRC-PUCV-001` | `pucv` | Creación de LMIL, 2022. citeturn18search0 |
| `SRC-PUCV-002` | `pucv` | Existencia del Núcleo Derecho, IA y Tecnología, 2023. citeturn18search1 |
| `SRC-PUCV-003` | `pucv` | IA en Filosofía del Derecho, 2024. citeturn15search7 |
| `SRC-PUCV-004` | `pucv` | Lanzamiento de ScribeClaroPUCV, 2025. citeturn15search4 |
| `SRC-PUCV-005` | `pucv` | Evidencia del optativo Derecho, Innovación y Tecnología, 2025. citeturn15search2 |
| `SRC-PUCV-006` | `pucv` | Fondo VcM 2025 para LMIL/DIAT. citeturn16search4 |
| `SRC-PUCV-007` | `pucv` | Ejecución del Taller de Prompting, 2025. citeturn16search5 |
| `SRC-PUCV-008` | `pucv` | Innova Day 2025 e investigación IA PUCV–Alto. citeturn16search1 |
| `SRC-PUCV-009` | `pucv` | Decálogo institucional sobre IA y docencia, 2026. citeturn17search0 |
| `SRC-PUCV-010` | `pucv` | Continuidad y utilización externa de ScribeClaro, 2026. citeturn15search5 |
| `SRC-PUCV-011` | `pucv` | Fondos VcM 2026 para IA/Prompting e Innova Day. citeturn15search1 |
| `SRC-UC-001` | `puc-chile` | Creación Departamento de Derecho y Tecnología. citeturn19search2 |
| `SRC-UC-002` | `puc-chile` | Dirección y estado del Programa Derecho Ciencia y Tecnología. citeturn19search18 |
| `SRC-UC-003` | `puc-chile` | Lineamientos UC sobre IA en formación. citeturn19search0 |
| `SRC-UC-004` | `puc-chile` | Incorporación formal de opción IA en condiciones de cursos de Derecho. citeturn13search2 |
| `SRC-UC-005` | `puc-chile` | Guía ética propia de Derecho UC. citeturn13search1 |
| `SRC-UC-006` | `puc-chile` | Diagnóstico institucional “IA en la UC”. citeturn19search5 |
| `SRC-UC-007` | `puc-chile` | AyudantIA como infraestructura institucional. citeturn19search3turn19search12 |
| `SRC-UCH-001` | `uchile` | Curso Informática Jurídica efectivamente dictado en 2025. citeturn14search2 |
| `SRC-UCH-002` | `uchile` | Dirección y continuidad institucional CE3. citeturn20search13 |
| `SRC-UCH-003` | `uchile` | Proyecto/congreso sobre IA, Derecho Privado y consumo. citeturn20search0 |
| `SRC-UCH-004` | `uchile` | Tesis específicamente clasificadas como IA. citeturn21search0 |
| `SRC-UCH-005` | `uchile` | Actividad formativa CE3 durante 2025. citeturn20search5 |
| `SRC-UCH-006` | `uchile` | Oferta 2026 del Diploma Derecho e IA y condiciones de eventual suspensión. citeturn20search4 |
| `SRC-UCH-007` | `uchile` | Lineamientos institucionales para uso transparente de IA en tesis. citeturn20search2 |

### Cambios propuestos y afirmaciones afectadas

| ID | Registro anterior | Acción propuesta |
|---|---|---|
| `CHG-PUCV-001` | PUCV pregrado reducido prácticamente a Derecho Informático | `SUSTITUIR/MATIZAR` con `EV-PUCV-003` y `EV-PUCV-005`: existe integración en asignatura regular y un optativo con IA verificable. |
| `CHG-PUCV-002` | `Uso interno IA: 0` | `RECHAZAR_COMO_ESTADO_2025` una vez validado: ScribeClaro ya existía en enero de 2025. citeturn15search4 |
| `CHG-PUCV-003` | PUCV descrita como esencialmente episódica/no sostenida | `MATIZAR`: hay una trayectoria LMIL 2022 → DIAT 2023 → docencia IA 2024 → herramientas/fondos 2025 → continuidad/fondos 2026. citeturn18search0turn18search1turn15search7turn16search4turn15search1 |
| `CHG-PUCV-004` | Hipótesis “no financiada” | `MATIZAR/CONTRADICE_LITERALMENTE`: hay fondos 2025 y 2026; queda pendiente determinar financiación basal. citeturn16search4turn15search1 |
| `CHG-UC-001` | AyudantIA tratada como uso interno de Derecho | `SEPARAR_ALCANCE`: registrar infraestructura UC y buscar adopción específica de Derecho. citeturn19search12 |
| `CHG-UCH-001` | Informática Jurídica computada directamente como IA | `CLASIFICAR_ADYACENTE_PENDIENTE_SYLLABUS`. citeturn14search2 |
| `CHG-UCH-002` | `Uso interno IA: 0` | `SUPERADO_AL_CORTE_2026`: existen lineamientos institucionales obligatorios para tesis. citeturn20search2 |
| `CHG-UCH-003` | Diploma Derecho e IA eventualmente contado por mera presencia web | `SEPARAR_OFERTA_DE_EJECUCION`; la edición 2026 necesita comprobación de realización. citeturn20search4 |

### Contradicciones registradas

`CONF-001` — expediente/HANDOFF canónico no disponible: impide aceptación e integración.

`CONF-002` — la arquitectura web presenta estados internos que requieren reconciliación antes de usar sus contadores como registro canónico. citeturn0view1

`CONF-003` — el informe denominado línea base 2025 incorpora hechos de 2026, lo que contamina el *snapshot* temporal. fileciteturn0file0

`CONF-004` — la puntuación anterior no separa consistentemente `ADYACENTE` de IA específica. fileciteturn0file0

`CONF-005` — mezcla de alcance institucional: herramientas o políticas universitarias no deben imputarse automáticamente a una Facultad, y viceversa.

`CONF-PUCV-001` — variantes oficiales en la denominación de DIAT requieren decisión de identidad/versionado antes de crear un nombre canónico único. citeturn18search1turn15search0turn16search4

### Pendientes prioritarios

La principal prioridad no es buscar más noticias, sino **reconciliar esta entrega con el expediente canónico**. Después de ello, para PUCV debe verificarse documentalmente el acto de creación y adscripción actual de DIAT/LMIL, sus equipos y dedicaciones, presupuesto basal, el syllabus y periodicidad del optativo Derecho, Innovación y Tecnología, y métricas de aprendizaje/impacto de ScribeClaro, prompting e Innova Day. Las fuentes abiertas prueban actividad, continuidad y algunos fondos, pero no resuelven todavía esas variables de institucionalización. citeturn15search2turn15search4turn15search1

Para Derecho UC queda pendiente comprobar utilización concreta de AyudantIA por la Facultad y localizar, mediante documentos curriculares primarios, asignaturas de pregrado específicamente centradas en IA; la política y gobernanza están bien documentadas, pero no deben sustituir la evidencia curricular. citeturn19search12turn13search1

Para la Universidad de Chile quedan pendientes el syllabus de Informática Jurídica, la centralidad efectiva de IA en ese curso, la ejecución real del Diploma Derecho e IA 2026 y la fecha formal exacta de entrada en vigor de los lineamientos de tesis. citeturn14search2turn20search4turn20search2

Después de esos controles, la batería puede aplicarse sin cambios conceptuales a `udp`, `uandes`, `uai`, `unab`, `udd`, `uautonoma`, `ucentral` y `udec`.

### Paquete de relevo

```text
HANDOFF_ID:
HANDOFF_IA_DERECHO_CHILE_2026-09-01_PILOTO_01

COHORT_VERSION:
COHORTE_IA_DERECHO_CHILE_11_V1

PROTOCOL_VERSION_DECLARED:
METODOLOGIA_IA_DERECHO_V2.0

CUTOFF:
2026-09-01

MODEL:
GPT-5.5 Thinking

EXECUTION_DATE:
2026-09-01

INSTITUTIONS_REVIEWED:
pucv
puc-chile
uchile

CANONICAL_WRITE:
NO

MAX_STATUS_THIS_DELIVERY:
PROPUESTO / FUENTE_ABIERTA / CONTRASTADO
Nunca ACEPTADO

NEW_SOURCES:
25 registros propuestos

NEW_EVIDENCE:
25 registros propuestos

CONFLICTS:
6 registros

AFFECTED_PRIOR_CLAIMS:
8 grupos

CORE_PUCV_FINDING:
La hipótesis original debe MATIZARSE.
Hay evidencia de continuidad, transversalidad parcial y financiación
competitiva; faltan pruebas públicas de estrategia unificada,
presupuesto basal y evaluación institucional de resultados.

CORE_UC_FINDING:
Alta formalización de gobernanza al corte 2026:
Departamento, lineamientos UC y guía propia de Derecho.
Separar infraestructura UC de adopción específica de Facultad.

CORE_UCHILE_FINDING:
Capacidad histórica fuerte en Derecho y Tecnología y evidencia
específica de IA en investigación/formación.
No computar automáticamente todo CE3 o Informática Jurídica como IA.
Uso interno=0 queda superado por lineamientos universitarios de tesis.

DO_NOT_DO:
No heredar puntajes 2025.
No contar ADYACENTE como IA.
No equiparar OFERTADO con EJECUTADO.
No inferir inexistencia desde silencio web.
No transferir evidencia universidad ↔ facultad sin registrar alcance.
No aceptar registros sin decisión humana.

NEXT_CANONICAL_ACTION:
Leer último HANDOFF y expediente completo.
Reconciliar IDs y decisiones humanas.
Validar/rechazar cada propuesta.
Sólo después extender búsqueda a las ocho universidades restantes.
```

El resultado de esta fase es, por tanto, **una corrección sustantiva de la línea base y una validación del método, no una clasificación nacional**. El hallazgo de mayor importancia estratégica para la PUCV es que la evidencia pública disponible al 1 de septiembre de 2026 muestra más continuidad, aplicación práctica, transversalidad y financiamiento de lo que reflejaba el documento previo; al mismo tiempo, no demuestra todavía una arquitectura única que permita gobernar y evaluar ese conjunto como una capacidad institucional integrada. Esa proposición debe permanecer `PROPUESTO` hasta su contraste con el expediente canónico y la documentación interna correspondiente. citeturn18search0turn15search4turn16search1turn15search1turn17search0