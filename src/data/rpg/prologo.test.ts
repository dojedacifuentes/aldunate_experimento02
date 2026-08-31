import { describe, expect, it } from 'vitest';

import { CHARACTERS } from '@/data/rpg/characters';
import { prologo } from '@/data/rpg/chapters/prologo';
import { evidenceById } from '@/data/rpg/evidence';
import { legalSources } from '@/data/rpg/legalSources';

/**
 * Integridad del grafo.
 *
 * Estos tests no comprueban que el capítulo sea bueno: comprueban que no tenga
 * caminos rotos. Un `next` hacia un nodo inexistente no se ve en el build ni en
 * el typecheck, y sí se ve cuando alguien está jugando.
 */

const nodos = Object.values(prologo.nodos);
const ids = new Set(Object.keys(prologo.nodos));

/** Todos los destinos declarados por cada nodo. */
function destinos(): string[] {
  const salida: string[] = [];
  for (const n of nodos) {
    switch (n.kind) {
      case 'dialogo':
      case 'scan':
      case 'prueba':
      case 'alegato':
        salida.push(n.next);
        break;
      case 'decision':
        n.opciones.forEach((o) => salida.push(o.next));
        break;
      case 'fin':
        break;
    }
  }
  return salida;
}

describe('grafo del prólogo', () => {
  it('el nodo inicial existe', () => {
    expect(ids.has(prologo.inicio)).toBe(true);
  });

  it('la clave de cada nodo coincide con su id', () => {
    Object.entries(prologo.nodos).forEach(([clave, nodo]) => {
      expect(nodo.id).toBe(clave);
    });
  });

  it('ningún destino apunta a un nodo inexistente', () => {
    destinos().forEach((d) => expect(ids.has(d), `destino roto: ${d}`).toBe(true));
  });

  it('todo nodo es alcanzable desde el inicio', () => {
    const vistos = new Set<string>([prologo.inicio]);
    let creció = true;
    while (creció) {
      creció = false;
      for (const n of nodos) {
        if (!vistos.has(n.id)) continue;
        const siguientes =
          n.kind === 'decision'
            ? n.opciones.map((o) => o.next)
            : n.kind === 'fin'
              ? []
              : [n.next];
        for (const s of siguientes) {
          if (!vistos.has(s)) {
            vistos.add(s);
            creció = true;
          }
        }
      }
    }
    const huérfanos = [...ids].filter((id) => !vistos.has(id));
    expect(huérfanos).toEqual([]);
  });

  it('el capítulo termina en al menos un desenlace', () => {
    expect(nodos.some((n) => n.kind === 'fin')).toBe(true);
  });
});

describe('contenido del prólogo', () => {
  it('todo hablante existe en el registro de personajes', () => {
    nodos.forEach((n) => {
      if (n.kind === 'dialogo') expect(CHARACTERS[n.speaker]).toBeDefined();
      if (n.kind === 'decision' && n.speaker) expect(CHARACTERS[n.speaker]).toBeDefined();
    });
  });

  it('toda evidencia mencionada existe en el catálogo', () => {
    nodos.forEach((n) => {
      if (n.kind === 'prueba') expect(evidenceById(n.evidenciaCorrecta)).toBeDefined();
      if (n.kind === 'scan') {
        n.objetivos.forEach((t) => {
          if (t.otorgaEvidencia) expect(evidenceById(t.otorgaEvidencia)).toBeDefined();
        });
      }
    });
  });

  it('la evidencia correcta de una prueba es obtenible antes de pedirla', () => {
    const otorgadas = new Set<string>();
    nodos.forEach((n) => {
      if (n.kind === 'scan') {
        n.objetivos.forEach((t) => t.otorgaEvidencia && otorgadas.add(t.otorgaEvidencia));
      }
      if (n.kind === 'decision') {
        n.opciones.forEach((o) => {
          if (o.efectos?.otorgaEvidencia) otorgadas.add(o.efectos.otorgaEvidencia);
        });
      }
    });
    nodos.forEach((n) => {
      if (n.kind === 'prueba') expect(otorgadas.has(n.evidenciaCorrecta)).toBe(true);
    });
  });

  it('cada hueco del alegato tiene una respuesta correcta entre sus opciones', () => {
    nodos.forEach((n) => {
      if (n.kind !== 'alegato') return;
      n.slots.forEach((slot) => {
        expect(slot.opciones.some((o) => o.id === slot.correcta)).toBe(true);
      });
    });
  });
});

describe('fuentes jurídicas', () => {
  it('ninguna se declara verificada sin que alguien la haya verificado', () => {
    legalSources
      .filter((f) => f.estado === 'VERIFIED')
      .forEach((f) => expect(f.urlOficial, `${f.id} sin url oficial`).toBeTruthy());
  });

  it('toda fuente sin verificar declara qué falta para verificarla', () => {
    legalSources
      .filter((f) => f.estado === 'UNVERIFIED')
      .forEach((f) => expect(f.pendiente, `${f.id} sin pendiente`).toBeTruthy());
  });
});
