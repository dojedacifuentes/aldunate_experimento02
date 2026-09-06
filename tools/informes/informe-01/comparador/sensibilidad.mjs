import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* La ruta se resuelve desde el propio archivo y no desde el directorio de
   trabajo: si no, el guion sólo corre estando dentro de su carpeta, que es
   justo lo que nadie recuerda al volver meses después. */
const aquí = path.dirname(fileURLToPath(import.meta.url));
const D = JSON.parse(fs.readFileSync(path.join(aquí, 'matriz-v2.json'), 'utf8'));
const P = { OPF:3, OP:2, INC:1, ENT:1, ADY:1, NL:0, NC:null };
const calc = m => Object.fromEntries(Object.entries(m).map(([k,f])=>{
  let piso=0,nc=0; for(const c of f){ if(c==='NC') nc++; else piso+=P[c]; }
  return [k,{piso,techo:piso+nc*2,nc}];
}));
const orden = r => Object.entries(r).sort((a,b)=>b[1].piso-a[1].piso||b[1].techo-a[1].techo||a[0].localeCompare(b[0]));
const clonar = m => Object.fromEntries(Object.entries(m).map(([k,v])=>[k,[...v]]));
const i = n => D.caps.indexOf(n);

const escenarios = {
  'BASE · Ronda 2 aceptada tal cual': D.v2,
  'Si la Resolución 13/2025 (U. Central) no se recupera': (()=>{ const m=clonar(D.v2); m['U. Central de Chile'][i('Norma')]='NC'; return m; })(),
  'Si la Resolución 118/2020 (Autónoma) no se puede leer': (()=>{ const m=clonar(D.v2); m['U. Autónoma de Chile'][i('Unidad')]='NC'; return m; })(),
  'Si ninguno de los dos se sostiene': (()=>{ const m=clonar(D.v2);
     m['U. Central de Chile'][i('Norma')]='NC'; m['U. Autónoma de Chile'][i('Unidad')]='NC'; return m; })(),
};

for (const [nombre, m] of Object.entries(escenarios)) {
  const r = calc(m); const o = orden(r);
  console.log('\n■ ' + nombre);
  o.slice(0,5).forEach(([inst,v],k)=>console.log('   '+(k+1)+'. '+inst.padEnd(32)+v.piso+'–'+v.techo+(v.nc?'  ('+v.nc+' s/c)':'')));
  const pucv = o.findIndex(([n])=>n.includes('Valparaíso'))+1;
  console.log('   → PUCV queda #'+pucv+'  ·  distancia al 3.º: '+(r['P. U. Católica de Valparaíso'].piso - o[2][1].piso)+' puntos');
}
