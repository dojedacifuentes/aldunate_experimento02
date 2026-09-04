/** Diagnóstico temporal: conclusiones y la fuerza de sus apoyos. */
import { informe01Afirmaciones } from '../../src/data/informe01.js';
import { informe01Conclusiones } from '../../src/data/informe01-borrador.js';

console.log('conclusiones:', informe01Conclusiones.length);
for (const c of informe01Conclusiones) {
  const ap = c.apoyo
    .map((id) => informe01Afirmaciones.find((a) => a.id === id))
    .filter(Boolean);
  console.log(
    c.id,
    '|',
    c.clase.padEnd(10),
    '| apoyo:',
    c.apoyo.join(','),
    '| niveles:',
    ap.map((a) => `${a!.level}:${a!.confidence}`).join(' '),
    '|',
    c.titulo.slice(0, 60),
  );
}
