/**
 * Vuelca los datos del juego a JSON para la versión de un solo archivo.
 * Importa el mismo contenido que usa la aplicación: cero duplicación de guion.
 */
import { writeFileSync } from 'node:fs';

/** tsx puede entregar el módulo bajo `default`: se normaliza aquí. */
async function cargar(ruta: string): Promise<Record<string, unknown>> {
  const modulo = (await import(ruta)) as Record<string, unknown>;
  const plano = modulo.default as Record<string, unknown> | undefined;
  return plano && typeof plano === 'object' ? { ...plano, ...modulo } : modulo;
}

const cap = await cargar('../../src/data/rpg/chapters/prologo.ts');
const evi = await cargar('../../src/data/rpg/evidence.ts');
const leg = await cargar('../../src/data/rpg/legalSources.ts');
const ski = await cargar('../../src/data/rpg/skills.ts');
const per = await cargar('../../src/data/rpg/characters.ts');

const CHARACTERS = per.CHARACTERS as Record<string, Record<string, unknown>>;
const personajes = Object.fromEntries(
  Object.entries(CHARACTERS).map(([id, c]) => [
    id,
    { id, name: c.name, title: c.title, role: c.role, style: c.dialogueStyle, expressions: c.expressions },
  ]),
);

writeFileSync(
  '.tmp/data.json',
  JSON.stringify(
    {
      prologo: cap.prologo,
      evidenceCatalog: evi.evidenceCatalog,
      legalSources: leg.legalSources,
      especialidades: ski.especialidades,
      statsBase: ski.statsBase,
      personajes,
      avatares: per.PLAYER_AVATARS,
    },
    null,
    0,
  ),
);
console.log('ok');
