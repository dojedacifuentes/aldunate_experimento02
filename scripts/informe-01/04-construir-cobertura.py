# -*- coding: utf-8 -*-
"""cobertura.csv — cuánto se investigó cada institución, NO cuánto hace.

Trece rutas del protocolo homogéneo de búsqueda (kit canónico §13). Una ruta se
considera recorrida cuando existe al menos una fuente del corpus que la cubre.
Este indicador es deliberadamente independiente de cualquier lectura de madurez:
una institución con mucha comunicación institucional puede parecer más madura
sólo porque publica más.
"""
import csv
from collections import defaultdict
D='content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/'
RUTAS=['sitio-facultad','malla-curricular','programas-syllabus','postgrado-formacion-continua',
 'repositorios-publicaciones','proyectos-fondos','centros-laboratorios','politicas-ia',
 'integridad-evaluacion','herramientas-licencias-convenios','vinculacion-transferencia',
 'noticias-institucionales','fuentes-externas-contraste']
# Ruta que cubre cada fuente. Una fuente puede cubrir más de una.
M={
'src-puc-chile-001':['centros-laboratorios','sitio-facultad'],'src-puc-chile-002':['noticias-institucionales','postgrado-formacion-continua'],
'src-puc-chile-003':['noticias-institucionales','postgrado-formacion-continua'],'src-puc-chile-004':['noticias-institucionales'],
'src-puc-chile-005':['sitio-facultad'],'src-puc-chile-006':['noticias-institucionales','integridad-evaluacion'],
'src-puc-chile-007':['noticias-institucionales'],'src-puc-chile-008':['politicas-ia','integridad-evaluacion'],
'src-puc-chile-009':['noticias-institucionales'],'src-puc-chile-010':['noticias-institucionales','vinculacion-transferencia'],
'src-puc-chile-011':['postgrado-formacion-continua','programas-syllabus'],'src-puc-chile-012':['herramientas-licencias-convenios'],
'src-uchile-001':['centros-laboratorios','sitio-facultad'],'src-uchile-002':['postgrado-formacion-continua','programas-syllabus'],
'src-uchile-003':['postgrado-formacion-continua'],'src-uchile-004':['noticias-institucionales','proyectos-fondos'],
'src-uchile-005':['repositorios-publicaciones'],'src-uchile-006':['repositorios-publicaciones'],
'src-uchile-007':['noticias-institucionales'],'src-uchile-008':['noticias-institucionales'],
'src-uchile-009':['noticias-institucionales'],'src-uchile-010':['noticias-institucionales','vinculacion-transferencia'],
'src-uchile-011':['noticias-institucionales'],'src-uchile-012':['noticias-institucionales','vinculacion-transferencia'],
'src-uchile-013':['noticias-institucionales','vinculacion-transferencia'],'src-uchile-014':['proyectos-fondos','postgrado-formacion-continua'],
'src-uchile-015':['politicas-ia','integridad-evaluacion'],'src-uchile-016':['herramientas-licencias-convenios'],
'src-udp-001':['noticias-institucionales'],'src-udp-002':['sitio-facultad','centros-laboratorios'],
'src-udp-003':['noticias-institucionales','vinculacion-transferencia'],
'src-uandes-001':['noticias-institucionales','proyectos-fondos'],'src-uandes-002':['noticias-institucionales','proyectos-fondos'],
'src-uandes-003':['noticias-institucionales'],'src-uandes-004':['postgrado-formacion-continua','programas-syllabus'],
'src-uandes-005':['noticias-institucionales','vinculacion-transferencia'],
'src-uai-001':['noticias-institucionales','vinculacion-transferencia'],'src-uai-002':['noticias-institucionales','herramientas-licencias-convenios'],
'src-uai-003':['noticias-institucionales','proyectos-fondos'],
'src-unab-001':['noticias-institucionales','sitio-facultad'],'src-unab-002':['noticias-institucionales','vinculacion-transferencia'],
'src-unab-003':['noticias-institucionales','herramientas-licencias-convenios'],'src-unab-004':['postgrado-formacion-continua'],
'src-udd-001':['malla-curricular','sitio-facultad'],'src-udd-002':['noticias-institucionales'],
'src-udd-003':['noticias-institucionales'],'src-udd-004':['noticias-institucionales'],
'src-uautonoma-001':['noticias-institucionales'],'src-uautonoma-002':['noticias-institucionales'],
'src-uautonoma-003':['noticias-institucionales','malla-curricular'],
'src-ucentral-001':['noticias-institucionales','herramientas-licencias-convenios'],'src-ucentral-002':['noticias-institucionales','repositorios-publicaciones'],
'src-ucentral-003':['sitio-facultad','centros-laboratorios'],'src-ucentral-004':['noticias-institucionales','herramientas-licencias-convenios'],
'src-pucv-001':['noticias-institucionales','centros-laboratorios'],'src-pucv-002':['noticias-institucionales','centros-laboratorios'],
'src-pucv-003':['noticias-institucionales'],'src-pucv-004':['noticias-institucionales','herramientas-licencias-convenios'],
'src-pucv-005':['noticias-institucionales'],'src-pucv-006':['noticias-institucionales','proyectos-fondos'],
'src-pucv-007':['politicas-ia','integridad-evaluacion'],'src-pucv-008':['noticias-institucionales','vinculacion-transferencia'],
'src-pucv-009':['noticias-institucionales','proyectos-fondos'],'src-pucv-010':['noticias-institucionales','proyectos-fondos'],
'src-pucv-011':['noticias-institucionales','vinculacion-transferencia'],'src-pucv-012':['malla-curricular','sitio-facultad'],
'src-pucv-013':['herramientas-licencias-convenios'],'src-pucv-014':['noticias-institucionales'],
'src-udec-001':['noticias-institucionales'],'src-udec-002':['noticias-institucionales','vinculacion-transferencia'],
'src-udec-003':['noticias-institucionales'],'src-udec-004':['sitio-facultad','herramientas-licencias-convenios'],
'src-nacional-001':['fuentes-externas-contraste'],'src-nacional-002':['fuentes-externas-contraste'],
}
F=list(csv.DictReader(open(D+'fuentes.csv',encoding='utf-8')))
E=list(csv.DictReader(open(D+'evidencias.csv',encoding='utf-8')))
I=list(csv.DictReader(open(D+'iniciativas.csv',encoding='utf-8')))
U=list(csv.DictReader(open(D+'universidades.csv',encoding='utf-8')))
assert set(M)=={f['source_id'] for f in F}, 'toda fuente necesita ruta'
PILOTO={'pucv','puc-chile','uchile'}
rutas=defaultdict(set); nsrc=defaultdict(int)
for f in F:
    if f['university_id']:
        nsrc[f['university_id']]+=1
        rutas[f['university_id']].update(M[f['source_id']])
nev=defaultdict(int); dims=defaultdict(set)
for e in E: nev[e['university_id']]+=1; dims[e['university_id']].add(e['dimension'])
nini=defaultdict(int)
for i in I: nini[i['university_id']]+=1
DIMS=8
rows=[]
for u in U:
    uid=u['university_id']; r=len(rutas[uid])
    rows.append(dict(university_id=uid,in_pilot='si' if uid in PILOTO else 'no',
        routes_completed=r,routes_total=len(RUTAS),coverage_percent=round(100*r/len(RUTAS)),
        sources=nsrc[uid],evidence=nev[uid],initiatives=nini[uid],
        dimensions_covered=len(dims[uid]),dimensions_total=DIMS,
        routes_missing='; '.join(sorted(set(RUTAS)-rutas[uid])),
        substantively_verified_sources=0,
        notes='Del piloto de profundidad: se la observa desde información privilegiada.' if uid in PILOTO
              else 'Fuera del piloto: su cobertura es menor por diseño de la investigación, no por menor actividad.'))
hdr=['university_id','in_pilot','routes_completed','routes_total','coverage_percent','sources','evidence','initiatives','dimensions_covered','dimensions_total','routes_missing','substantively_verified_sources','notes']
with open(D+'cobertura.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=hdr); w.writeheader()
    for r in rows: w.writerow(r)
p=[r for r in rows if r['in_pilot']=='si']; o=[r for r in rows if r['in_pilot']=='no']
print('cobertura escrita para',len(rows),'instituciones')
print('piloto: fuentes/media %.1f  rutas/media %.1f'%(sum(r['sources'] for r in p)/3,sum(r['routes_completed'] for r in p)/3))
print('resto : fuentes/media %.1f  rutas/media %.1f'%(sum(r['sources'] for r in o)/8,sum(r['routes_completed'] for r in o)/8))
print('razón de fuentes piloto:resto = %.1f:1'%((sum(r['sources'] for r in p)/3)/(sum(r['sources'] for r in o)/8)))
for r in rows: print(' ',r['university_id'],r['routes_completed'],'rutas ·',r['sources'],'fuentes ·',r['dimensions_covered'],'dimensiones')
