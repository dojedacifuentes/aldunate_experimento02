import { Notice, Section, Surface } from '@/components/common/ui';
import { conclusionesSvg } from '@/lib/informe01-graficos';

import { Figura } from './Figura';
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

import { ComparadorMecanismos, MapaDesarrollo } from './Capacidades';

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
    <p className={`text-pretty leading-relaxed text-muted-foreground ${className}`}>
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
      <Section id="introduccion"
        eyebrow="1" title="Introducción" className="scroll-mt-20">
        <div className="max-w-prose space-y-4">
          {informe01Introduccion.map((p, i) => (
            <Prosa key={i} className={i === 0 ? 'text-base text-foreground' : ''}>
              {p}
            </Prosa>
          ))}
        </div>
      </Section>

      <Section id="objetivos"
        eyebrow="2" title="Objetivos" className="scroll-mt-20">
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
        id="metodologia-relato"
        eyebrow="3"
        title="Metodología"
        description="Cómo se construyó cada dato, qué se excluyó y por qué. Es la parte del documento que permite discutirlo."
        className="scroll-mt-20"
      >
        {/* El ancla del botón «Ver metodología» de la cabecera apunta aquí. */}
        <div id="metodologia" className="max-w-prose space-y-8">
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
        id="discusion"
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
        description="Primero lo que consta, después lo que no, y las dos preguntas de control publicadas. El orden no es cortesía: una sección que empieza por las brechas ya decidió su conclusión antes de exponer los hechos."
        className="scroll-mt-20"
      >
        <div id="pucv">
          <MapaDesarrollo universityId="pucv" />

          <h3 className="meta mb-3 mt-10">Evidencia favorable localizada</h3>
          <div className="mb-10 grid gap-3 md:grid-cols-2">
            {pucvFavorable.map((f) => (
              <Surface key={f.fuente + f.hecho.slice(0, 20)} className="p-4">
                <Prosa className="text-foreground">{f.hecho}</Prosa>
                <p className="mt-2 text-sm text-muted-foreground">{f.fuerza}</p>
                <p className="meta mt-3">{f.fuente}</p>
              </Surface>
            ))}
          </div>

          <h3 className="meta mb-2 mt-10">Qué falta, y con qué instrumento lo resolvió quien ya lo resolvió</h3>
          <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Cada bloque nombra la capacidad, lo que aquí consta y el mecanismo concreto —con su
            institución— allí donde la misma capacidad está en operación. No propone qué hacer:
            pone el referente a la vista. Una capacidad sin referente también aparece, porque que
            nadie la haya resuelto es tan informativo como que alguien lo haya hecho.
          </p>
          <ComparadorMecanismos universityId="pucv" />

          <h3 className="meta mb-3 mt-10">Brechas declaradas</h3>
          <div className="mb-8 space-y-4">
            {pucvBrechas.map((b) => (
              <div key={b.brecha} className="border-l-2 border-warning/40 pl-5">
                <p className="font-medium text-foreground">
                  {b.brecha}
                  {b.esDeCohorte && (
                    <span className="meta ml-2 align-middle text-subtle">alcanza a las once</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{b.evidencia}</p>
                <p className="mt-2 text-sm text-muted-foreground">
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
        </div>
      </Section>

      <Section
        id="conclusiones"
        eyebrow="6"
        title="Conclusiones"
        description="Cada una cita las afirmaciones del dataset que la sostienen. Ninguna introduce información nueva."
        className="scroll-mt-20"
      >
        <Figura
          pregunta="¿Qué puede sostener este estudio, y con qué firmeza?"
          titulo="Las siete conclusiones, con la clase de afirmación que son y la confianza declarada de lo que las sostiene"
          svg={conclusionesSvg()}
          nota={
            <>
              La barra es la confianza de la afirmación más débil en que se apoya cada
              conclusión: una conclusión no es más firme que su apoyo más flojo. La escala
              arranca en 50 y no en 0 porque ninguna baja de 70, y la referencia se dibuja
              para que esa elección quede a la vista. El orden es el del documento y no el
              de la confianza: ordenar por firmeza invitaría a leer la lista como un ranking
              de solidez y a descartar el final, que es donde está la única inferencia.
            </>
          }
        />

        <div className="mt-8 space-y-5">
          {informe01Conclusiones.map((c) => (
            <Surface key={c.id} className="p-5">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="meta">{c.id}</span>
                <span className="meta text-subtle">
                  {c.clase === 'HECHO' ? 'Hecho sobre el corpus' : 'Inferencia'}
                  {c.acotada ? ' · alcance acotado' : ''}
                </span>
              </div>
              <h3 className="font-serif text-lg leading-snug text-foreground">{c.titulo}</h3>
              <Prosa className="mt-2">{c.cuerpo}</Prosa>
              <p className="meta mt-3">Se apoya en · {c.apoyo.join(' · ')}</p>
            </Surface>
          ))}
        </div>
      </Section>

      <Section
        id="implicancias"
        eyebrow="6 bis"
        title="Implicancias para la PUCV"
        description="Las conclusiones dicen qué muestra la evidencia. Esto dice qué preguntas de gestión abre esa evidencia, que es cosa distinta y no equivale a una recomendación."
        className="scroll-mt-20"
      >
        <Notice tone="muted" className="mb-6 max-w-prose">
          Ninguno de estos bloques dice qué debe hacer la institución. Cada uno enuncia un
          problema observado, la evidencia que lo sostiene, el referente donde ese mismo problema
          ya tiene un mecanismo, la decisión que eso abre y el indicador con el que podría
          comprobarse más adelante si se tomó. La decisión es de quien gobierna la Facultad; el
          informe sólo la vuelve discutible con datos a la vista.
        </Notice>
        <div id="implicancias" className="space-y-4">
          {pucvRecomendaciones.map((r) => (
            <Surface key={r.id} className="p-5">
              <p className="meta mb-2">{r.id}</p>
              <p className="font-medium text-foreground">{r.problema}</p>
              <dl className="mt-3 space-y-2 text-sm">
                {(
                  [
                    ['Evidencia', r.evidencia],
                    ['Referente observado', r.referente],
                    ['Decisión que abre', r.accion],
                    ['Indicador', r.indicador],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="sm:flex sm:gap-3">
                    <dt className="meta shrink-0 sm:w-36">{k}</dt>
                    <dd className="text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </Surface>
          ))}
        </div>
      </Section>

      <Section
        id="limitaciones"
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
        id="agenda"
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
                  <dd className="text-muted-foreground">{t(a.porQue)}</dd>
                </div>
                <div className="sm:flex sm:gap-3">
                  <dt className="meta shrink-0 sm:w-28">Cómo se cierra</dt>
                  <dd className="text-muted-foreground">{t(a.comoSeCierra)}</dd>
                </div>
              </dl>
            </Surface>
          ))}
        </div>
      </Section>
    </>
  );
}
