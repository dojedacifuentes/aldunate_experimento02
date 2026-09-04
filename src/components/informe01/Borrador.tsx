import { Notice, Section, Surface } from '@/components/common/ui';
import {
  informe01Agenda,
  informe01Conclusiones,
  informe01Discusion,
  informe01Intereses,
  informe01Introduccion,
  informe01Limitaciones,
  informe01MetodologiaRelato,
  informe01ObjetivoGeneral,
  informe01ObjetivosEspecificos,
  resolverCifras,
} from '@/data/informe01-borrador';
import {
  pucvBrechas,
  pucvDobleRevision,
  pucvFavorable,
  pucvLectura,
  pucvRecomendaciones,
} from '@/data/informe01-pucv';
import { cifrasInforme01 } from '@/lib/informe01';

const cifras = cifrasInforme01();
const t = (s: string) => resolverCifras(s, cifras);

/**
 * Marca `**negrita**` sin dependencia de Markdown. La prosa la usa para el
 * énfasis de una frase por párrafo como mucho, de modo que un intérprete de
 * cuatro líneas basta y evita traer un renderizador entero al servidor.
 */
function Prosa({ children, className = '' }: { children: string; className?: string }) {
  const partes = t(children).split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={`text-pretty leading-relaxed text-muted ${className}`}>
      {partes.map((parte, i) =>
        parte.startsWith('**') && parte.endsWith('**') ? (
          <strong key={i} className="font-medium text-foreground">
            {parte.slice(2, -2)}
          </strong>
        ) : (
          parte
        ),
      )}
    </p>
  );
}

function Bloque({ titulo, parrafos }: { titulo: string; parrafos: readonly string[] }) {
  return (
    <div className="border-l-2 border-border pl-5">
      <h3 className="mb-3 font-serif text-lg leading-snug text-foreground">{titulo}</h3>
      <div className="space-y-3">
        {parrafos.map((p, i) => (
          <Prosa key={i}>{p}</Prosa>
        ))}
      </div>
    </div>
  );
}

/**
 * La prosa va partida en dos porque el orden académico lo exige: introducción,
 * objetivos y método **antes** de los datos; discusión, PUCV, conclusiones,
 * limitaciones y agenda **después**. Entre medio va la publicación de la
 * evidencia, que es lo que la discusión discute.
 */
export function Informe01BorradorApertura() {
  return (
    <>
      <Section eyebrow="1" title="Introducción" className="scroll-mt-20">
        <div className="max-w-prose space-y-4">
          {informe01Introduccion.map((p, i) => (
            <Prosa key={i} className={i === 0 ? 'text-base text-foreground' : ''}>
              {p}
            </Prosa>
          ))}
        </div>
      </Section>

      <Section eyebrow="2" title="Objetivos" className="scroll-mt-20">
        <Surface className="max-w-prose p-5">
          <h3 className="meta mb-2">Objetivo general</h3>
          <Prosa className="text-foreground">{informe01ObjetivoGeneral}</Prosa>
        </Surface>
        <h3 className="meta mb-3 mt-6">Objetivos específicos</h3>
        <ol className="max-w-prose list-decimal space-y-2 pl-5 marker:text-subtle">
          {informe01ObjetivosEspecificos.map((o, i) => (
            <li key={i} className="pl-1">
              <Prosa>{o}</Prosa>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="3"
        title="Metodología"
        description="Cómo se construyó cada dato, qué se excluyó y por qué. Es la parte del documento que permite discutirlo."
        className="scroll-mt-20"
      >
        <div className="max-w-prose space-y-8">
          {informe01MetodologiaRelato.map((b) => (
            <Bloque key={b.titulo} titulo={b.titulo} parrafos={b.parrafos} />
          ))}
        </div>

        <Notice tone="warning" className="mt-8 max-w-prose">
          <h3 className="mb-2 font-medium text-foreground">Declaración de intereses</h3>
          <div className="space-y-3">
            {informe01Intereses.map((p, i) => (
              <Prosa key={i}>{p}</Prosa>
            ))}
          </div>
        </Notice>
      </Section>
    </>
  );
}

export function Informe01BorradorCierre() {
  return (
    <>
      <Section
        eyebrow="4"
        title="Discusión"
        description="Qué significan los registros leídos en conjunto. Separa lo comprobado de lo inferido."
        className="scroll-mt-20"
      >
        <div className="max-w-prose space-y-8">
          {informe01Discusion.map((b) => (
            <Bloque key={b.titulo} titulo={b.titulo} parrafos={b.parrafos} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="5"
        title="La PUCV en contexto"
        description="Evidencia favorable primero, brechas después, y las dos preguntas de control publicadas."
        className="scroll-mt-20"
      >
        <h3 className="meta mb-3">Evidencia favorable localizada</h3>
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          {pucvFavorable.map((f) => (
            <Surface key={f.fuente + f.hecho.slice(0, 20)} className="p-4">
              <Prosa className="text-foreground">{f.hecho}</Prosa>
              <p className="mt-2 text-sm text-muted">{f.fuerza}</p>
              <p className="meta mt-3">{f.fuente}</p>
            </Surface>
          ))}
        </div>

        <h3 className="meta mb-3">Brechas</h3>
        <div className="mb-8 space-y-4">
          {pucvBrechas.map((b) => (
            <div key={b.brecha} className="border-l-2 border-warning/40 pl-5">
              <p className="font-medium text-foreground">
                {b.brecha}
                {b.esDeCohorte && (
                  <span className="meta ml-2 align-middle text-subtle">alcanza a las once</span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{b.evidencia}</p>
              <p className="mt-2 text-sm text-muted">
                <span className="meta">Comparador · </span>
                {b.comparador}
              </p>
            </div>
          ))}
        </div>

        <h3 className="meta mb-3">Lectura</h3>
        <div className="max-w-prose space-y-3">
          {pucvLectura.map((p, i) => (
            <Prosa key={i}>{p}</Prosa>
          ))}
        </div>

        <Notice tone="accent" className="mt-8 max-w-prose">
          <h3 className="mb-3 font-medium text-foreground">Doble revisión de la sección</h3>
          <div className="space-y-4">
            {pucvDobleRevision.map((d) => (
              <div key={d.pregunta}>
                <p className="font-medium text-foreground">{d.pregunta}</p>
                <Prosa className="mt-1">{d.respuesta}</Prosa>
              </div>
            ))}
          </div>
        </Notice>

        <h3 className="meta mb-3 mt-8">Recomendaciones de desarrollo institucional</h3>
        <div className="space-y-4">
          {pucvRecomendaciones.map((r) => (
            <Surface key={r.id} className="p-5">
              <p className="meta mb-2">{r.id}</p>
              <p className="font-medium text-foreground">{r.problema}</p>
              <dl className="mt-3 space-y-2 text-sm">
                {(
                  [
                    ['Evidencia', r.evidencia],
                    ['Referente', r.referente],
                    ['Acción', r.accion],
                    ['Indicador', r.indicador],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="sm:flex sm:gap-3">
                    <dt className="meta shrink-0 sm:w-24">{k}</dt>
                    <dd className="text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            </Surface>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="6"
        title="Conclusiones"
        description="Cada una cita las afirmaciones del dataset que la sostienen. Ninguna introduce información nueva."
        className="scroll-mt-20"
      >
        <div className="space-y-5">
          {informe01Conclusiones.map((c) => (
            <Surface key={c.id} className="p-5">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="meta">{c.id}</span>
                <span className="meta text-subtle">{c.clase}</span>
              </div>
              <h3 className="font-serif text-lg leading-snug text-foreground">{c.titulo}</h3>
              <Prosa className="mt-2">{c.cuerpo}</Prosa>
              <p className="meta mt-3">Se apoya en · {c.apoyo.join(' · ')}</p>
            </Surface>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="7"
        title="Limitaciones"
        description="Lo que este método no puede ver, dicho antes de que lo diga un lector."
        className="scroll-mt-20"
      >
        <ul className="max-w-prose space-y-3">
          {informe01Limitaciones.map((l, i) => (
            <li key={i} className="border-l-2 border-warning/40 pl-5">
              <Prosa>{l}</Prosa>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="8"
        title="Agenda de investigación"
        description="Preguntas abiertas, con la razón por la que importan y lo que las cerraría."
        className="scroll-mt-20"
      >
        <div className="space-y-4">
          {informe01Agenda.map((a) => (
            <Surface key={a.id} className="p-5">
              <p className="meta mb-2">{a.id}</p>
              <h3 className="font-serif text-lg leading-snug text-foreground">{t(a.pregunta)}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="sm:flex sm:gap-3">
                  <dt className="meta shrink-0 sm:w-28">Por qué importa</dt>
                  <dd className="text-muted">{t(a.porQue)}</dd>
                </div>
                <div className="sm:flex sm:gap-3">
                  <dt className="meta shrink-0 sm:w-28">Cómo se cierra</dt>
                  <dd className="text-muted">{t(a.comoSeCierra)}</dd>
                </div>
              </dl>
            </Surface>
          ))}
        </div>
      </Section>
    </>
  );
}
