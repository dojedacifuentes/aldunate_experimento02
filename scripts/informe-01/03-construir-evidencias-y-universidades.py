# -*- coding: utf-8 -*-
"""evidencias.csv y universidades.csv del Informe 01.

Una evidencia es lo que UNA fuente prueba sobre UNA iniciativa. Varias fuentes
sobre un mismo hecho no producen varias iniciativas (kit §17), pero sí producen
varias evidencias: es la diferencia entre contar actividades y contar pruebas.
`last_verified` queda vacío en las 74: DEC-108.
"""
import csv, os
D='content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/'
fuentes={r['source_id']:r for r in csv.DictReader(open(D+'fuentes.csv',encoding='utf-8'))}
inis={r['initiative_id']:r for r in csv.DictReader(open(D+'iniciativas.csv',encoding='utf-8'))}

# ── universidades.csv ──
U=[
 ('puc-chile','Pontificia Universidad Católica de Chile','Facultad de Derecho UC','La estructura orgánica publicada lista el Departamento de Derecho y Tecnología como unidad formal.'),
 ('uchile','Universidad de Chile','Facultad de Derecho, Universidad de Chile','El CE3 es la unidad de referencia en derecho y tecnología; su especificidad en IA se evalúa aparte.'),
 ('udp','Universidad Diego Portales','Facultad de Derecho UDP','La unidad oficial es Dirección de Inteligencia Artificial y Derecho, no «Centro».'),
 ('uandes','Universidad de los Andes','Facultad de Derecho, Universidad de los Andes','Dos de sus cinco fuentes corresponden a unidades que no son Derecho.'),
 ('uai','Universidad Adolfo Ibáñez','Facultad de Derecho UAI','El Laboratorio de Justicia Centrada en las Personas es la unidad con actividad recurrente.'),
 ('unab','Universidad Andrés Bello','Facultad de Derecho UNAB','La cuenta pública de la Facultad es la fuente principal: la institución describiéndose a sí misma.'),
 ('udd','Universidad del Desarrollo','Facultad de Derecho UDD','Su evidencia curricular está orientada a Admisión 2027: anuncio, no ejecución.'),
 ('uautonoma','Universidad Autónoma de Chile','Facultad de Derecho, Universidad Autónoma de Chile','Opera en tres sedes: Santiago, Talca y Temuco.'),
 ('ucentral','Universidad Central de Chile','Facultad de Ciencias Jurídicas y Sociales (FACDEH)','En 2026 la Cátedra LegalTech fue sustituida por el Programa IA & LegalTech; la Cátedra se conserva como antecedente.'),
 ('pucv','Pontificia Universidad Católica de Valparaíso','Facultad y Escuela de Derecho PUCV','En 2026 la unidad es Programa DIAT, no «Centro DIAT». Una de las tres del piloto: se la observa desde información privilegiada.'),
 ('udec','Universidad de Concepción','Facultad de Ciencias Jurídicas y Sociales','Mantiene dos dominios y sólo uno tiene el certificado bien configurado (ISSUE-002).'),
]
with open(D+'universidades.csv','w',newline='',encoding='utf-8') as f:
    w=csv.writer(f); w.writerow(['university_id','official_name','cohort_id','cohort_version','unit_name','status','notes'])
    for uid,name,unit,note in U:
        w.writerow([uid,name,'COHORTE_IA_DERECHO_CHILE_11_V1','1.0.0',unit,'PENDIENTE_VERIFICACION',note])

# ── evidencias.csv ──
# Qué prueba cada fuente, con sus propias palabras acotadas. Clave: source_id.
ST={
'src-puc-chile-001':('El sitio oficial del Programa de Derecho, Ciencia y Tecnología mantiene publicados un diplomado y un curso en Derecho e IA junto a otras líneas tecnológicas.','La página no declara fecha ni presupuesto: prueba existencia y oferta, no continuidad ni recursos.'),
'src-puc-chile-002':('La Facultad documenta la graduación de la generación 2024 de los diplomados del Programa.','Acredita ejecución de una cohorte; no informa matrícula, deserción ni resultados de aprendizaje.'),
'src-puc-chile-003':('La Facultad documenta la graduación de la generación 2025 de los diplomados del Programa.','Segunda cohorte documentada: es serie temporal, no evaluación.'),
'src-puc-chile-004':('La Facultad anuncia la creación del Departamento de Derecho y Tecnología, dirigido por Raúl Madrid.','Es el anuncio de creación. El acto formal —resolución o documento constitutivo— no se ha localizado.'),
'src-puc-chile-005':('La estructura orgánica publicada de la Facultad lista el Departamento de Derecho y Tecnología como unidad formal.','Es el único respaldo orgánico publicado de todo el corpus para una unidad nueva.'),
'src-puc-chile-006':('El decano informa la oficialización, en el formulario de condiciones y evaluaciones, de la opción de que los profesores integren IA en sus cursos.','Prueba el mecanismo formal, no su adopción: cuántos cursos lo activaron no consta.'),
'src-puc-chile-007':('La fuente identifica a Raúl Madrid como director del Departamento de Derecho y Tecnología recientemente creado.','Es una noticia de seminario: corrobora la existencia del Departamento de forma incidental.'),
'src-puc-chile-008':('La Facultad establece una guía ética que regula autonomía docente, transparencia, conservación de registros, infracciones y verificación oral en el uso de IA generativa.','Gobernanza dictada por la Facultad. No consta su aplicación ni su supervisión.'),
'src-puc-chile-009':('La Dirección Superior formaliza a Matías Aránguiz como director del Programa de Derecho, Ciencia y Tecnología.','El documento fuente declara que no logró abrir el original: la evidencia queda PROPUESTA.'),
'src-puc-chile-010':('El Programa realiza un seminario sobre el impacto jurídico de la inteligencia artificial en Chile, México y Estados Unidos.','Actividad puntual de vinculación.'),
'src-puc-chile-011':('El Diplomado en Derecho e Inteligencia Artificial está en ejecución entre el 04-08-2026 y el 10-12-2026, con 180 horas y la Facultad de Derecho como unidad responsable.','Prueba oferta y duración; no informa matrícula real.'),
'src-puc-chile-012':('La universidad ofrece AyudantIA, que permite crear agentes de IA generativa por curso e integrarlos con sus plataformas.','La fuente no identifica a la Facultad de Derecho ni cursos jurídicos: la atribución es a la universidad.'),
'src-uchile-001':('La historia institucional del CE3 documenta su genealogía desde 1988 y el cambio de nombre el 01-01-2025.','Es infraestructura de derecho y tecnología; no acredita por sí sola actividad específica en IA.'),
'src-uchile-002':('La página del Diploma en Derecho e Inteligencia Artificial de 2022 describe fundamentos de IA, regulación, ética, propiedad intelectual, responsabilidad y derechos fundamentales.','Página histórica: prueba la edición 2022, no la oferta vigente.'),
'src-uchile-003':('La Facultad ofrece el Diploma en Derecho e IA en el segundo semestre de 2026, con el CE3 como unidad académica.','Sustituye la dependencia en las ediciones 2022 y 2023 como única prueba de continuidad.'),
'src-uchile-004':('El Departamento de Derecho Privado desarrolla un proyecto sobre IA, responsabilidad civil y derecho del consumo, adjudicado como proyecto de internacionalización.','El monto no está publicado y la fuente no declara fecha.'),
'src-uchile-005':('El repositorio del CE3 lista tesis sobre IA judicial, propiedad intelectual y transparencia algorítmica entre 2008 y 2025.','Producción formativa acumulada; no informa cuántas corresponden a cada año.'),
'src-uchile-006':('El índice general del repositorio del CE3 mantiene una categoría específica de inteligencia artificial.','Corrobora la anterior; no agrega un hecho nuevo.'),
'src-uchile-007':('El balance del CE3 reconstruye su actividad de 2025 en materia de investigación, docencia y vinculación.','Publicada el 08-01-2026 y probatoria de 2025: la fecha de publicación no es la del hecho. Los juicios de liderazgo son autoevaluación.'),
'src-uchile-008':('La Facultad realiza un congreso internacional sobre los desafíos de la IA en el derecho privado.','Dos documentos fuente le atribuyen fechas distintas: la evidencia queda PROPUESTA hasta abrir el original.'),
'src-uchile-009':('La Facultad realiza un workshop sobre IA y derecho privado con casos prácticos.','Corrobora continuidad del proyecto; no informa asistencia ni resultados.'),
'src-uchile-010':('El CE3 organiza una actividad sobre la excepción de derechos de autor para el entrenamiento de sistemas de IA.','Actividad de extensión: por sí sola no eleva institucionalización.'),
'src-uchile-011':('Alberto Cerda asume la dirección del CE3 mediante nombramiento confirmado por el Consejo de Facultad.','Prueba conducción formal del centro.'),
'src-uchile-012':('La Facultad realiza un seminario sobre inteligencia artificial y acceso a la justicia en dos jornadas.','Actividad puntual.'),
'src-uchile-013':('El CE3 convoca un Programa de Visitas Académicas latinoamericano con estadías de cuatro a seis semanas.','Convocatoria abierta al corte: programada, no ejecutada.'),
'src-uchile-014':('El registro institucional documenta un Diploma en Derecho e IA para funcionarios de la Contraloría General de la República entre julio y noviembre de 2025.','El documento fuente declara timeout al abrir el original: la evidencia queda PROPUESTA.'),
'src-uchile-015':('La universidad adopta lineamientos que obligan a declarar el uso de IA en todos los trabajos de titulación.','Política universitaria aplicable a Derecho, no dictada por la Facultad.'),
'src-uchile-016':('La Vicerrectoría de Tecnologías de la Información ofrece una capacitación institucional de 27 horas en IA generativa.','Dirigida a toda la comunidad: no informa participación de Derecho.'),
'src-udp-001':('La Facultad crea una Dirección de Inteligencia Artificial y Derecho y nombra a Rafael Mery como su director.','Lo orgánico está documentado; los cambios curriculares que la misma fuente anuncia, no.'),
'src-udp-002':('La presentación institucional de la Dirección anuncia trabajo desde el primer semestre, un taller de IA en escritura legal y formación posterior sobre tecnología en la profesión.','Anuncio. No consta ejecución, obligatoriedad ni matrícula.'),
'src-udp-003':('La Vicerrectoría de Investigación e Innovación suscribe, con participación de Derecho, un convenio de I+D+i con Quantico y Merlín Research.','Convenio firmado sin evidencia pública de ejecución.'),
'src-uandes-001':('Un proyecto FONDEF busca escalar y transferir una plataforma de IA que procesa normativa, jurisprudencia y datos para la evaluación ambiental.','Consta por noticia universitaria; falta la verificación en ANID.'),
'src-uandes-002':('La misma investigación se describe con un equipo interfacultades e interuniversitario de derecho, ingeniería, lingüística y ciencias ambientales, con participación de la PUCV.','Segunda fuente sobre la misma iniciativa: no se cuenta dos veces.'),
'src-uandes-003':('El CET e Ingeniería desarrollan DOMus AI, plataforma de revisión automatizada de normas y formularios de permisos de edificación.','La unidad principal no es Derecho: la atribución es a la universidad.'),
'src-uandes-004':('La Facultad de Derecho dicta un curso de Compliance, ética pública y nuevas tecnologías que incluye legalidad y control en la implementación de IA por la Administración.','La fuente no declara fecha de publicación.'),
'src-uandes-005':('La Facultad de Derecho realiza un seminario sobre el uso de obras ajenas por sistemas de IA generativa y la excepción de minería de datos.','Actividad puntual.'),
'src-uai-001':('El Laboratorio de Justicia Centrada en las Personas dicta una nueva versión del curso de IA, ética y debido proceso para la Academia Judicial.','La fuente declara una nueva versión: prueba recurrencia, no cobertura ni resultados.'),
'src-uai-002':('La Facultad de Derecho firma un convenio con la legaltech Legu para ampliar el acceso a información y servicios jurídicos mediante IA.','Convenio firmado y fechado. Sin cobertura, productos ni resultados públicos.'),
'src-uai-003':('Ricardo Lillo, de la Facultad de Derecho, se adjudica un Fondecyt Regular 2026 sobre el debido proceso en la era de la inteligencia artificial.','Consta por noticia universitaria; falta la verificación en ANID.'),
'src-unab-001':('La Facultad informa asistentes de IA generativa integrados en Canvas en asignaturas nombradas del primer ciclo de Derecho.','Es una cuenta pública: la institución describiéndose a sí misma, sin verificación externa ni métricas de uso.'),
'src-unab-002':('La Facultad de Derecho, Transferencia Tecnológica UNAB y la Superintendencia de Insolvencia y Reemprendimiento lanzan un asesor virtual de insolvencia basado en IA.','Transferencia a un servicio público; no informa uso ni resultados.'),
'src-unab-003':('La universidad inicia la implementación progresiva de MIAsistentes, un ecosistema institucional de asistentes virtuales.','Capacidad de toda la universidad: no se atribuye adicionalmente a Derecho.'),
'src-unab-004':('El postgrado ofrece un Diplomado en Derecho, Innovación y Tecnología.','Recuperada en la ronda 3. Falta comprobar si la IA es componente sustantivo: por ahora ADYACENTE.'),
'src-udd-001':('La malla de Derecho declara una línea LegalTech e IA e incluye talleres de herramientas digitales e inteligencia artificial y de análisis de datos.','La página está orientada a Admisión 2027: diseño curricular anunciado, no curso dictado.'),
'src-udd-002':('Estudiantes de debate y litigación realizan entrenamiento práctico con tecnologías que incluyen IA y realidad virtual.','La realidad virtual no es IA: sólo el componente de IA cuenta como evidencia.'),
'src-udd-003':('El Doctorado en Derecho realiza un workshop sobre los desafíos regulatorios de la IA.','Actividad puntual de formación doctoral.'),
'src-udd-004':('Un estudiante de Derecho y uno de Ingeniería Civil Informática desarrollan Hereda Fácil, que usa IA para posesiones efectivas intestadas.','Atribución estudiantil: no es una capacidad de la Facultad.'),
'src-uautonoma-001':('Una decena de talleres alcanza cerca del 80 % del cuerpo docente de Derecho en Santiago, Talca y Temuco, y comienza la extensión a estudiantes.','Es la única cobertura docente cuantificada del corpus. Capacitar no es adoptar: cuántos docentes cambiaron su curso no consta.'),
'src-uautonoma-002':('La Facultad pone en marcha un programa de 18 semanas de IA aplicada para estudiantes de Clínicas Jurídicas en las tres sedes.','En marcha al corte: programado en su mayor parte, no ejecutado.'),
'src-uautonoma-003':('Estudiantes de Derecho egresan del Minor en Inteligencia Artificial y Derecho del año académico 2025.','La ceremonia es de enero de 2026 y el hecho, de 2025. No informa cuántos egresaron.'),
'src-ucentral-001':('La Facultad presenta Docente iLex, asistente generativo propio para retroalimentación, rúbricas, casos y metodologías activas.','Herramienta desarrollada por la propia Facultad. Falta comprobar vigencia en 2026.'),
'src-ucentral-002':('La revista del Doctorado dedica un número a inteligencia artificial, responsabilidad algorítmica y derechos fundamentales.','Producción investigativa; no informa indexación ni impacto.'),
'src-ucentral-003':('La Facultad mantiene la página oficial del Programa de IA & LegalTech, cuya misión declarada integra investigación aplicada, productos, educación avanzada e innovación.','Sustituye la denominación «Cátedra LegalTech». Falta el acto formal de creación.'),
'src-ucentral-004':('La universidad presenta IDEA UCEN, plataforma institucional de búsqueda con IA.','Recuperada en la ronda 3. Herramienta heredada: falta comprobar vigencia en 2026.'),
'src-pucv-001':('La Facultad crea el Legal Management Innovation Lab como laboratorio de transformación digital, innovación legal y gestión de proyectos, en colaboración con Thomson Reuters.','LMIL nace como innovación legal, no como IA específica: la clasificación es ADYACENTE.'),
'src-pucv-002':('La fuente oficial afirma que el Núcleo de Derecho, Inteligencia Artificial y Tecnología se oficializó en 2020, con objetivos regulatorios y de aplicación de IA a la docencia y la profesión.','En 2026 la unidad es Programa, no Centro. El presupuesto basal no está públicamente determinado.'),
'src-pucv-003':('El Programa DIAT integra IA en Filosofía del Derecho mediante prompting y un chatbot de asignatura, con apoyo de un proyecto de innovación docente.','Experiencia acotada a una asignatura. Fuente única: no hay prueba pública de continuidad.'),
'src-pucv-004':('ScribeClaroPUCV es una herramienta web creada inicialmente para estudiantes de Derecho, con apoyo del Programa de Desarrollo Docente.','No informa número de usuarios ni resultados de aprendizaje.'),
'src-pucv-005':('La edición 2025 del Taller de IA y Prompting Jurídico se ejecuta en tres jornadas con cerca de 90 participantes.','Recuento de participantes. Cuántos asistieron no dice si algo cambió.'),
'src-pucv-006':('La Facultad y la Escuela de Derecho se adjudican dos proyectos de Vinculación con el Medio en 2026.','Financiamiento concursable, no basal. Los montos no están publicados.'),
'src-pucv-007':('La universidad presenta un decálogo para el uso ético de la IA en docencia, elaborado por la Unidad de Integridad Académica y liderado por una profesora de Derecho.','Lineamiento universitario. No es política propia de la Escuela de Derecho.'),
'src-pucv-008':('La Facultad ejecuta un workshop internacional para alumni sobre manejo, gobernanza e implementación responsable de IA en el ámbito legal.','Actividad puntual con expositor internacional.'),
'src-pucv-009':('El Legal Management Program y LMIL participan de un FDI financiado por el Ministerio de Educación.','Financiamiento de un componente adyacente, no de IA específica.'),
'src-pucv-010':('El Laboratorio de Innovación Legal y el Programa de Derecho e IA se adjudican fondos internos en 2025.','Junto con la adjudicación de 2026 documenta financiamiento competitivo en dos años consecutivos.'),
'src-pucv-011':('La cuarta versión de Innova Day incluye un panel sobre automatización e inteligencia artificial.','La actividad general es ADYACENTE: sólo el panel aporta evidencia específica de IA.'),
'src-pucv-012':('La página vigente de Derecho declara como competencia el uso de tecnologías de información y comunicación y enlaza al plan de estudios.','La revisión pública no permitió verificar una línea curricular obligatoria en IA. No autoriza a afirmar que no exista.'),
'src-pucv-013':('Desde marzo de 2026 la universidad habilita Gemini integrado a su entorno institucional para la comunidad académica y administrativa.','Demuestra acceso institucional, no adopción efectiva en Derecho.'),
'src-udec-001':('La Facultad realiza una sesión con demostraciones de modelos de lenguaje para lectura, investigación, redacción y argumentación jurídica.','Actividad puntual.'),
'src-udec-002':('La Facultad realiza un seminario interdisciplinario sobre IA, regulación, práctica jurídica, cibercrimen e innovación.','Su dominio tiene el certificado mal configurado: el enlace mostrará una advertencia de seguridad.'),
'src-udec-003':('La Facultad realiza un taller presencial para sus académicos sobre uso crítico, responsable y pedagógico de IA generativa en docencia, evaluación e investigación.','La fuente no declara fecha de publicación.'),
'src-udec-004':('[genIA] es un programa interdisciplinario institucional con roadmap 2026, formación, tecnología y ética.','Acredita una capacidad de toda la universidad, no una estructura de Derecho.'),
}
E=[]; n={}
for iid,ini in inis.items():
    for sid in [s for s in ini['source_ids'].split('; ') if s]:
        uid=ini['university_id']
        n[uid]=n.get(uid,0)+1
        stmt,lim=ST[sid]
        E.append(dict(evidence_id=f'ev-{uid}-{n[uid]:03d}',source_id=sid,initiative_id=iid,
            university_id=uid,direction=ini['direction'],dimension=ini['primary_dimension'],
            factual_statement=stmt,institutional_level=ini['institutional_level'],
            temporal_status=ini['temporal_change'],last_verified='',
            workflow_status=fuentes[sid]['workflow_status'],created_by=fuentes[sid]['created_by'],
            verified_by='',limitations=lim))
hdr=['evidence_id','source_id','initiative_id','university_id','direction','dimension','factual_statement','institutional_level','temporal_status','last_verified','workflow_status','created_by','verified_by','limitations']
with open(D+'evidencias.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=hdr); w.writeheader()
    for r in E: w.writerow(r)
print('evidencias:',len(E))
assert len({e['evidence_id'] for e in E})==len(E)
assert all(e['last_verified']=='' for e in E)
from collections import Counter
print(Counter(e['university_id'] for e in E))
