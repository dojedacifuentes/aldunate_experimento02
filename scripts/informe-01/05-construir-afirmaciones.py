# -*- coding: utf-8 -*-
"""afirmaciones.csv — cada afirmación con sus evidencias reales, su
contraevidencia, su razonamiento, sus límites y su nivel epistemológico.

Las `evidence_ids` no se escriben a mano: se consultan sobre evidencias.csv, de
modo que una afirmación no puede citar una evidencia que no existe. Ninguna
afirmación pasa de PROPUESTO mientras ISSUE-001 siga abierto.
"""
import csv
D='content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/'
E=list(csv.DictReader(open(D+'evidencias.csv',encoding='utf-8')))
I={r['initiative_id']:r for r in csv.DictReader(open(D+'iniciativas.csv',encoding='utf-8'))}
F={r['source_id']:r for r in csv.DictReader(open(D+'fuentes.csv',encoding='utf-8'))}
def ev(**kw):
    """Selecciona evidencias por campo; devuelve ids ordenados."""
    out=[]
    for e in E:
        if all((e[k] in v if isinstance(v,(list,set)) else e[k]==v) for k,v in kw.items()): out.append(e['evidence_id'])
    return '; '.join(sorted(out))
def evs(sids):
    return '; '.join(sorted(e['evidence_id'] for e in E if e['source_id'] in sids))
def evi(iids):
    return '; '.join(sorted(e['evidence_id'] for e in E if e['initiative_id'] in iids))

C=[]
def c(cid,uid,text,cls,evids,counter,reason,lim,conf):
    C.append(dict(claim_id=cid,university_id=uid,claim_text=text,classification=cls,
        evidence_ids=evids,counterevidence_ids=counter,reasoning=reason,limitations=lim,
        confidence=conf,last_verified='',workflow_status='PROPUESTO',
        created_by='fusion-ronda-3',verified_by=''))

c('clm-cohorte-001','','Ninguna de las 53 iniciativas registradas en las once instituciones alcanza evidencia pública de evaluación de efecto sobre el aprendizaje jurídico.','FACT',
  evi(set(I)),'',
  'Las 53 iniciativas se clasificaron con la escalera del kit canónico (§11), cuyo nivel 4 exige productos o resultados públicamente revisables. Ninguna lo alcanza: el máximo del corpus es 3. Se localizaron métricas de cobertura —cerca del 80 % del profesorado de Derecho de la Autónoma, unos 90 participantes en el taller de la PUCV— y ninguna es una evaluación de efecto. Tres rondas independientes de investigación, con documentos distintos y fuentes que apenas se solapan, llegaron a la misma ausencia.',
  'Es un hecho sobre el corpus, no sobre las instituciones: una evaluación no publicada no queda registrada. La afirmación dice que no hay evidencia pública de medición, no que nadie mida.',85)

c('clm-cohorte-002','','Cuatro Facultades de Derecho formalizaron entre 2025 y 2026 una estructura dedicada a tecnología o inteligencia artificial.','FACT',
  evi({'ini-puc-chile-003','ini-udp-001','ini-ucentral-002','ini-pucv-001'}),'',
  'Departamento de Derecho y Tecnología en la UC, Dirección de Inteligencia Artificial y Derecho en la UDP, Programa de IA & LegalTech en la Universidad Central y Programa DIAT en la PUCV. Son señales distintas de una sucesión de seminarios: hay nombre, conducción y unidad.',
  'Sólo la UC tiene respaldo orgánico publicado. De las otras tres falta el acto formal de creación —resolución, organigrama o documento constitutivo—, de modo que consta el nombre comunicacional y no la unidad administrativa (ISSUE-006).',70)

c('clm-cohorte-003','','Del corpus, una sola política sobre uso de IA fue dictada por una Facultad de Derecho; las demás son universitarias y sólo resultan aplicables a Derecho.','FACT',
  evi({'ini-puc-chile-004','ini-pucv-006','ini-uchile-007'}),'',
  'La guía ética de Derecho UC la aprueba la propia Facultad con su Comité Directivo y su Consejo. El decálogo de la PUCV lo elabora la Unidad de Integridad Académica de la universidad, aunque lo lidere una profesora de Derecho, y los lineamientos de tesis de la Universidad de Chile son de la universidad. Quién dicta la regla importa tanto como la regla.',
  'Una política universitaria aplicable a Derecho sí demuestra capacidad institucional disponible; lo que no demuestra es capacidad desarrollada por la Facultad. La distinción es de atribución, no de calidad de la política.',80)

c('clm-cohorte-004','','El uso interno de IA dejó de ser una casilla vacía: cuatro instituciones documentan herramientas o formación desplegadas dentro de la enseñanza del Derecho.','SIGNAL',
  evi({'ini-unab-001','ini-ucentral-001','ini-uautonoma-001','ini-udec-003'}),'',
  'UNAB informa asistentes generativos en asignaturas nombradas de primer ciclo; la Universidad Central desarrolló Docente iLex dentro de la Facultad; la Autónoma capacitó a cerca del 80 % de sus docentes de Derecho en tres sedes; la UdeC realizó un taller propio para sus académicos.',
  'Tres de las cuatro fuentes son la institución describiéndose a sí misma, sin verificación externa ni métricas de uso. Capacitar no es adoptar y desplegar no es usar: cuántos docentes cambiaron efectivamente su curso no consta en ninguna.',60)

c('clm-cohorte-005','','La formación continua es el único eje del corpus con serie temporal documentada.','FACT',
  evi({'ini-puc-chile-002','ini-uchile-002'}),'',
  'Los diplomados de la UC y de la Universidad de Chile acreditan ejecución en años sucesivos: dos graduaciones documentadas más una cohorte en curso en la UC, y ediciones de 2022 y 2026 en la Universidad de Chile. En el resto de los ejes hay fuentes fechadas, pero no repetición probada de la misma iniciativa.',
  'Serie temporal no es evaluación: que un programa se repita no dice qué aprendieron sus egresados. Tampoco consta la matrícula real de ninguna cohorte.',80)

c('clm-cohorte-006','','No se localizó en ninguna de las once instituciones evidencia pública de una línea curricular obligatoria en IA con syllabus, semestre, créditos y matrícula.','PENDING',
  evs({'src-pucv-012','src-udd-001','src-udp-002','src-uautonoma-003'}),'',
  'Hay mallas y anuncios: la malla de la UDD declara una línea LegalTech e IA en una página de admisión 2027, la Dirección de la UDP anuncia innovación curricular, la página de Derecho de la PUCV declara competencia en TIC sin trayectoria explícita en IA, y el Minor de la Autónoma es la única trayectoria con una cohorte egresada. En ninguna aparece el documento que separa un taller optativo de una línea obligatoria.',
  'Es ausencia de evidencia pública, no evidencia de ausencia: los syllabus pueden existir y no estar publicados. La afirmación alcanza a las once precisamente para no convertir en defecto de una universidad lo que es un límite del método (DEC-110).',75)

c('clm-cohorte-007','','Nueve registros del corpus corresponden a capacidades de la universidad y no de la Facultad de Derecho.','FACT',
  ev(institutional_level='INSTITUCIONAL_UNIVERSIDAD'),'',
  'AyudantIA y MIAsistentes, la habilitación de Gemini y el decálogo de la PUCV, los lineamientos de tesis y el curso institucional de la Universidad de Chile, IDEA UCEN, DOMus AI y [genIA]. En los nueve la fuente identifica una unidad que no es Derecho, o no identifica ninguna.',
  'Contarlos como capacidad de Derecho es el modo más frecuente de inflar un mapa sin inventar una sola fuente. Excluirlos del todo sería el error simétrico: son capacidad institucional disponible, y como tal se registran.',85)

c('clm-cohorte-008','','Cinco iniciativas del corpus prueban anuncio y no ejecución.','FACT',
  evi({'ini-udd-001','ini-udp-002','ini-uai-002','ini-uchile-005','ini-unab-003'}),'',
  'La malla de la UDD está orientada a Admisión 2027; la innovación curricular de la UDP se anuncia en la presentación de su Dirección; el convenio de la UAI con Legu está firmado y fechado sin cobertura ni productos públicos; el programa de visitas del CE3 es una convocatoria abierta al corte; MIAsistentes está en implementación progresiva. Existir no es funcionar.',
  'Verificar ejecución es la ronda siguiente. Que hoy sea anuncio no permite anticipar que no se ejecute.',80)

c('clm-metodo-001','','La cobertura de investigación es 3,7 veces mayor en el piloto de tres que en las ocho restantes, de modo que ninguna comparación ni ranking nacional es publicable.','FACT',
  '','',
  'Tras la ronda 3 el piloto —PUCV, PUC y Universidad de Chile— reúne 42 fuentes, 14 de media, y las ocho restantes 30, 3,8 de media. En rutas del protocolo la brecha es mayor todavía: 9,7 rutas recorridas de trece frente a 4,0. Esa diferencia mide esfuerzo de investigación, no actividad institucional. La Universidad Autónoma, con dos rutas recorridas, aporta la única cobertura docente cuantificada de todo el corpus: es la prueba de que evidencia localizada y madurez institucional no son la misma variable.',
  'La cifra se calcula sobre el corpus disponible, que a su vez depende de qué publica cada institución. Una universidad que comunica poco quedará subrepresentada aunque se le apliquen las trece rutas.',90)

c('clm-metodo-002','','Ninguna de las 74 fuentes del corpus proviene de contraste externo: todas son institucionales o bases oficiales.','FACT',
  '','',
  'El registro clasifica las 74 fuentes por tipo. Setenta y dos son publicaciones de las propias universidades —noticias, páginas, políticas, repositorios, programas— y dos son bases oficiales del Ministerio de Educación y del Consejo Nacional de Educación. La ruta 13 del protocolo, fuentes externas de contraste, está sin recorrer en las once.',
  'El corpus hereda íntegro el sesgo de autodescripción: mide lo que las instituciones cuentan de sí mismas. Es la limitación estructural más grande del informe y no se corrige agregando más fuentes del mismo tipo.',90)

c('clm-metodo-003','','El corpus contiene 74 fuentes públicas únicas y no las 72 declaradas en la versión 0.4.0.','FACT',
  evs({'src-ucentral-004','src-unab-004'}),'',
  'La re-extracción mecánica de URL sobre los cinco documentos de investigación profunda arroja 74 direcciones únicas tras normalizar host, prefijo www y barra final, y excluir tres del propio sitio del laboratorio. Las dos que faltaban aparecen citadas en la tabla-resumen de intento-2b —IDEA UCEN y el Diplomado en Derecho, Innovación y Tecnología de la UNAB— y nunca recibieron registro propio, de modo que quedaron fuera del inventario.',
  'Es el mismo defecto que el proyecto detectó en el documento antecedente, ahora encontrado en su propio corpus. La versión 0.4.0 no se reescribe: se corrige con fe de erratas.',95)

c('clm-metodo-004','','Ninguna afirmación de la forma «X aumentó desde 2025» es publicable: no se dispone de una línea base congelada de 2025.','FACT',
  '','',
  'El documento tratado como línea base histórica contiene actividades fechadas en abril, junio, agosto y septiembre de 2026. Una comparación mecánica entre ese archivo y el corte de septiembre de 2026 mezclaría cambios reales con incorporaciones hechas retrospectivamente sobre el propio archivo.',
  'Reconstruir un corte auténticamente congelado exige decidir qué se considera público al 31-12-2025, y esa decisión no puede tomarla un proceso automático sobre un archivo ya editado (ISSUE-009).',90)

c('clm-pucv-001','pucv','La PUCV muestra una capacidad organizativa más persistente de lo que sugería el antecedente, pero la evidencia pública no demuestra todavía institucionalización curricular, financiera ni evaluativa.','INFERENCE',
  evi({'ini-pucv-001','ini-pucv-002','ini-pucv-004','ini-pucv-005','ini-pucv-006'}),
  evi({'ini-pucv-003','ini-pucv-007','ini-pucv-008','ini-pucv-009'}),
  'A favor de la capacidad: el Núcleo DIAT se oficializó en 2020 y en 2026 opera como Programa; LMIL existe desde 2022; ScribeClaroPUCV es una herramienta de IA nacida para estudiantes de Derecho; el Taller de IA y Prompting Jurídico se ejecutó en 2025 con cerca de 90 participantes y obtuvo financiamiento competitivo de Vinculación con el Medio en 2025 y de nuevo en 2026; y el decálogo institucional de IA lo lideró una profesora de Derecho. En contra de la institucionalización: no se localizó línea curricular obligatoria, dotación académica específicamente asignada, presupuesto basal propio, adopción cuantificada dentro de la Facultad ni evaluación pública de resultados.',
  'Arrastra íntegra la advertencia de clm-metodo-001: la PUCV es una de las tres del piloto, con 14 fuentes y nueve rutas recorridas, de modo que se la observa desde una posición de información privilegiada. Lo que se afirma es una diferencia en la evidencia localizada, no una diferencia demostrada en la actividad. Las cuatro carencias que se enumeran tampoco están demostradas en las otras diez: sólo se han buscado con este detalle en tres.',55)

c('clm-pucv-002','pucv','El financiamiento localizado de la PUCV en materia de IA y Derecho es concursable, no basal.','SIGNAL',
  evi({'ini-pucv-005','ini-pucv-002'}),'',
  'Las adjudicaciones documentadas son fondos internos de Vinculación con el Medio en 2025 y 2026, y un FDI del Ministerio de Educación en 2023 para un componente adyacente. La fuente oficial del Núcleo declara expresamente que su presupuesto basal no está públicamente determinado.',
  'Que el presupuesto basal no esté publicado no significa que no exista: significa que no se localizó. Financiar proyectos demuestra interés; sobre financiar capacidad, la evidencia pública no dice nada en ninguna de las once.',50)

hdr=['claim_id','university_id','claim_text','classification','evidence_ids','counterevidence_ids','reasoning','limitations','confidence','last_verified','workflow_status','created_by','verified_by']
with open(D+'afirmaciones.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=hdr); w.writeheader()
    for r in C: w.writerow(r)
allev={e['evidence_id'] for e in E}
for r in C:
    for k in ('evidence_ids','counterevidence_ids'):
        for e in [x for x in r[k].split('; ') if x]:
            assert e in allev, f'evidencia inexistente {e} en {r["claim_id"]}'
print('afirmaciones:',len(C))
from collections import Counter
print(Counter(r['classification'] for r in C))
print('sin evidencia enlazada (metodológicas):',[r['claim_id'] for r in C if not r['evidence_ids']])
