import type { Metadata } from 'next';

import {
  Breadcrumbs,
  Container,
  MetaRow,
  Notice,
  PendingBlock,
  Section,
} from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { CabinaAudaces } from '@/components/rpg/game/CabinaAudaces';
import { CHARACTER_IDS, CHARACTERS } from '@/data/rpg/characters';
import { prologo } from '@/data/rpg/chapters/prologo';
import { legalSources } from '@/data/rpg/legalSources';

import './juego.css';

export const metadata: Metadata = {
  title: 'La Ley de los Audaces',
  description:
    'RPG jurídico chileno. Capítulo 0 jugable: una audiencia, una contradicción y un alegato. Prototipo de ficción, auditable y documentado.',
};

/**
 * La Ley de los Audaces — ficha jugable.
 *
 * La página tiene dos mitades y las dos importan. Arriba se juega; abajo se
 * audita: de qué está hecho el capítulo, qué reparto lo interpreta, qué
 * referencias normativas usa y en qué estado de verificación está cada una.
 *
 * Un experimento que sólo se puede jugar es una demo. Uno que además se puede
 * revisar es un experimento.
 */
export default function LeyDeLosAudacesPage() {
  const nodos = Object.values(prologo.nodos);
  const decisiones = nodos.filter((n) => n.kind === 'decision').length;
  const reparto = CHARACTER_IDS.map((id) => CHARACTERS[id]).filter((c) => c.role !== 'ambient');
  const sinVerificar = legalSources.filter((f) => f.estado !== 'VERIFIED').length;

  return (
    <>
      {/*
        El juego va primero y ocupa el alto disponible. No es una preferencia
        estética: mientras estuvo debajo de la cabecera y del aviso, había que
        desplazar 895 px para empezar a jugar y el juego seguía sin caber. La
        cabina se mide contra el viewport y el resto de la página —que es la
        ficha auditable, no el juego— queda debajo. D-027.
      */}
      <CabinaAudaces />

      <header className="border-b border-border/70 py-10 sm:py-14">
        <Container>
          {/*
            Tercer nivel: un solo «← Juegos» decía de dónde se venía pero no
            dónde se está. La ruta completa cabe en una línea.
          */}
          <Breadcrumbs
            items={[
              { label: 'Experimentos', href: '/experimentos' },
              { label: 'Juegos', href: '/experimentos/juegos' },
              { label: 'La Ley de los Audaces' },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            La Ley de los Audaces
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-muted-foreground">
            RPG jurídico chileno
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Gane un juicio. Es lo único que tiene que hacer hoy, y es lo último
            que le va a salir bien. El Capítulo 0 dura entre tres y cinco
            minutos y es todo lo que existe: el resto está en construcción, y se
            construye en este mismo repositorio.
          </p>
          <p className="mono mt-6 text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
            Teclado: 1–5 elegir · E o Espacio avanzar · Esc pausa
          </p>
        </Container>
      </header>

      <Section>
        <Notice tone="warning" className="max-w-3xl">
          Ficción. Personajes, empresa, documentos, tribunal y causa son
          inventados y no corresponden a nada real. Las referencias normativas
          van rotuladas según su estado de verificación y ninguna se presenta
          como Derecho vigente sin contraste. No es asesoría jurídica.
        </Notice>
      </Section>

      {/* ── Auditoría ──────────────────────────────────────────────────── */}

      <Section
        eyebrow="Auditoría"
        title="De qué está hecho"
        description="Lo que se puede revisar sin abrir el código."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MetaRow label="Nodos del capítulo" value={String(nodos.length)} />
          <MetaRow label="Decisiones con consecuencia" value={String(decisiones)} />
          <MetaRow label="Personajes con ficha" value={String(reparto.length)} />
          <MetaRow label="Referencias por verificar" value={`${sinVerificar} de ${legalSources.length}`} />
        </div>
      </Section>

      <Section eyebrow="Reparto" title="Quién aparece">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reparto.map((c) => (
            <li
              key={c.id}
              className="border border-border/70 p-4"
            >
              <p className="mono text-muted-foreground">
                {c.provisionalArt ? 'Arte provisional' : 'Arte definitivo'}
              </p>
              <p className="mt-2 font-serif text-lg">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.title}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Todo el reparto se dibuja proceduralmente con el motor de{' '}
          <code>src/lib/rpg/art/</code> y se hornea a PNG con{' '}
          <code>npm run juego:arte</code>. Los diseños son originales: no
          derivan de personas reales ni de obras protegidas.
        </p>
      </Section>

      <Section
        eyebrow="Fuentes"
        title="Referencias normativas del capítulo"
        description="Ninguna se presenta como Derecho vigente mientras no esté verificada contra el texto oficial."
      >
        <ul className="grid gap-3">
          {legalSources.map((f) => (
            <li key={f.id} className="border border-border/70 p-4">
              <p className="mono" style={{ color: f.estado === 'VERIFIED' ? undefined : 'var(--warning, inherit)' }}>
                {f.estado === 'VERIFIED' ? 'Verificada' : 'Por verificar'}
              </p>
              <p className="mt-2 font-serif">
                {f.cuerpo} {f.articulo}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{f.resumen}</p>
              {f.pendiente && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="font-normal">Falta:</strong> {f.pendiente}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Qué falta"
        title="Estado real del proyecto"
        description="Declarado, no disimulado. El detalle vive en docs/juegos/ley-de-los-audaces/."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <PendingBlock
            label="Validación con jugadores"
            detail="El Capítulo 0 funciona; falta saber si entretiene. Antes de escribir el capítulo siguiente hay que ver a alguien jugarlo entero sin instrucciones y anotar dónde se aburre. Construir el resto antes de eso es multiplicar un problema que todavía no se ha medido."
          />
          <PendingBlock
            label="Verificación jurídica"
            detail="Las tres referencias del capítulo están rotuladas «por verificar» y así se muestran dentro del juego. Pasan a citarse como Derecho vigente sólo cuando alguien las contraste con el texto oficial y deje la fecha."
          />
          <PendingBlock
            label="Capítulo 1 · La caída"
            detail="Amenaza, allanamiento y detención. Debe reutilizar el motor sin añadir mecánicas nuevas: si necesita una, es señal de que el capítulo cero no validó lo que decía validar."
          />
          <PendingBlock
            label="Audio"
            detail="No hay nada. Pasos, evidencia, XP, interfaz, alerta y ambiente de sala. Sólo material original o libre."
          />
        </div>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="sunset" className="max-w-3xl">
            <p>
              El juego le pedirá encontrar una contradicción entre lo que un
              testigo recuerda y lo que un registro documenta. Ganar así no
              prueba que su representada sea inocente: prueba que la acusación
              no probó lo contrario. La diferencia entre ambas cosas es el
              capítulo entero, y también buena parte del oficio.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
