import { ButtonLink, Disclosure, Notice, Section, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import { informe01Hallazgos, informe01ResumenEjecutivo } from '@/data/informe01-hallazgos';
import { resolverCifras } from '@/data/informe01-borrador';
import { cifrasInforme01 } from '@/lib/informe01';

import {
  CoberturaFrenteACapacidad,
  LineaDeTiempo,
  MatrizCapacidades,
  MecanismosInstitucionales,
} from './Capacidades';
import { CoberturaInvestigacion } from './Cobertura';
import { EscaleraInstitucionalizacion, MapaDirecciones } from './Escalera';
import { AuditoriaLineaBase, Lagunas } from './Lagunas';
import { ListaAfirmaciones } from './Afirmaciones';
import { MatrizEvidencia } from './Matriz';
import { afirmacionesDeCohorte } from '@/lib/informe01';

const cifras = cifrasInforme01();
const t = (s: string) => resolverCifras(s, cifras);

/**
 * La publicación del Informe 01.
 *
 * ── El orden, y por qué cambió en la v0.7.0 ─────────────────────────────────
 *
 * La versión anterior ponía la evidencia primero y la lectura al final. Era
 * defendible como orden de trabajo y era malo como orden de lectura: el
 * destinatario recorría once fichas, cuatro visualizaciones y catorce
 * afirmaciones antes de encontrar una razón para seguir. El orden académico
 * exige que el método preceda a los datos; no exige esconder los resultados
 * detrás del método.
 *
 * Ahora el documento abre por **resumen ejecutivo y hallazgos**, y sólo después
 * introduce, justifica y detalla. Lo que era cuerpo denso —la matriz de las ocho
 * dimensiones, el registro completo de fuentes, la auditoría de la línea base—
 * baja a anexos, disponible y sin estorbar.
 *
 * El otro cambio es de instrumento. El comparador principal ya no es cuánta
 * evidencia se localizó por dimensión sino **qué capacidad institucional demuestra
 * cada Facultad**, con la desigualdad de cobertura incorporada a cada celda. La
 * matriz anterior no se elimina: cambiar de instrumento no autoriza a hacer
 * desaparecer el instrumento con el que se publicó la versión anterior.
 *
 * Sin JavaScript de cliente: todo lo que se pliega usa `<details>` nativo, cada
 * figura es SVG generado en el servidor desde el dataset y ninguna cifra se
 * escribe a mano. La página funciona impresa y con el JavaScript apagado.
 */

/** Resumen ejecutivo y hallazgos. Van antes que la introducción. */
export function Informe01Apertura() {
  return (
    <>
      <Section
        eyebrow="Resumen"
        title="Qué se investigó, qué apareció y qué queda abierto"
        description="Dos páginas. Si sólo va a leerse una parte del documento, que sea ésta."
        className="scroll-mt-20"
      >
        <div id="resumen" className="prose-editorial max-w-prose">
          {informe01ResumenEjecutivo.map((p, i) => (
            <Parrafo key={i} destacado={i === 0}>
              {p}
            </Parrafo>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Hallazgos"
        title={`Los ${informe01Hallazgos.length} hallazgos principales`}
        description="Cada uno declara el dato que lo sostiene, la lectura que permite y el límite hasta el que llega. El límite no es un descargo de responsabilidad: es parte del hallazgo."
        className="scroll-mt-20"
      >
        <ol id="hallazgos" className="space-y-5">
          {informe01Hallazgos.map((h) => (
            <li key={h.id}>
              <Surface className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="mono text-[0.6875rem] uppercase tracking-widest text-accent">
                    {h.id}
                  </span>
                  <h3 className="font-serif text-lg leading-snug text-foreground sm:text-xl">
                    {h.enunciado}
                  </h3>
                </div>
                <dl className="mt-4 space-y-3">
                  <Campo etiqueta="Dato">{h.dato}</Campo>
                  <Campo etiqueta="Lectura">{h.lectura}</Campo>
                  <Campo etiqueta="Límite" atenuado>
                    {h.limite}
                  </Campo>
                </dl>
                <p className="meta mt-4">Se apoya en · {h.apoyo.join(' · ')}</p>
              </Surface>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

/** El cuerpo comparado: panorama, cobertura, capacidades y el control entre ambas. */
export function Informe01Publicacion() {
  const r = informe01Recuento;

  return (
    <>
      <Section
        eyebrow="Panorama"
        title="Qué hay, desde cuándo y con qué instrumentos"
        description="Antes de comparar instituciones conviene ver la forma del conjunto: cuándo empezó, con qué se está haciendo y hasta dónde ha llegado."
        className="scroll-mt-20"
      >
        <div id="panorama" className="space-y-10">
          <LineaDeTiempo />
          <MecanismosInstitucionales />
          <EscaleraInstitucionalizacion />
          <MapaDirecciones />
        </div>
      </Section>

      <Section
        eyebrow="Cobertura"
        title="Cuánto se investigó cada institución"
        description="Este bloque va antes que cualquier comparación y no después. Sin el denominador, una fila más poblada se lee como una universidad que hace más, cuando indica dónde se buscó más."
        className="scroll-mt-20"
      >
        <div id="cobertura">
          <CoberturaInvestigacion />
        </div>
      </Section>

      <Section
        eyebrow="Capacidades"
        title="Qué capacidad institucional demuestra cada Facultad"
        description="El comparador principal del informe. No ordena, no puntúa y no suma: compara estados de una misma pregunta en once instituciones."
        className="scroll-mt-20"
      >
        <div id="capacidades">
          <MatrizCapacidades />
        </div>
      </Section>

      <Section
        eyebrow="Control"
        title="La comprobación que impide leer mal todo lo anterior"
        description="Si cuánto investigamos y cuánto hacen las Facultades fueran la misma variable, el informe entero estaría midiendo su propio trabajo de campo."
        className="scroll-mt-20"
      >
        <div id="control">
          <CoberturaFrenteACapacidad />
        </div>
      </Section>

      <Section
        eyebrow="Instituciones"
        title="Las once, una por una"
        description="Cada ficha empieza por su cobertura y no por sus hallazgos, porque sin el denominador la ficha engaña."
      >
        <Surface className="p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Las fichas institucionales viven en una página propia: son {r.universidades}{' '}
            instituciones, {r.iniciativas} iniciativas y {r.evidencias} evidencias, y meterlas
            aquí devolvería el documento al problema que esta versión corrige, que era hacer
            recorrer once perfiles antes de dar una razón para hacerlo.
          </p>
          <ButtonLink
            href="/informes/ia-escuelas-derecho-chile/instituciones"
            variant="primary"
            className="mt-5"
          >
            Ver las once fichas institucionales
          </ButtonLink>
        </Surface>
      </Section>
    </>
  );
}

/**
 * Anexos. Aquí baja lo que en la v0.6.0 ocupaba el cuerpo: la matriz de las ocho
 * dimensiones, las afirmaciones con su cadena completa, las lagunas declaradas y
 * la auditoría del documento antecedente.
 *
 * Bajar algo a anexo no es degradarlo. Es reconocer que un lector que quiere
 * auditar y un lector que quiere entender no necesitan lo mismo en el mismo
 * sitio, y que servir a los dos en el cuerpo del documento no sirve a ninguno.
 */
export function Informe01Anexos() {
  return (
    <Section
      eyebrow="Anexos"
      title="El aparato completo"
      description="Trazabilidad, límites y el instrumento con que se publicó la versión anterior. Nada de esto se necesita para entender el informe; todo esto se necesita para discutirlo."
      className="scroll-mt-20"
    >
      <div id="anexos" className="space-y-4">
        <Disclosure
          summary="Anexo A · Las afirmaciones, con su cadena completa"
          hint={`${informe01Recuento.afirmaciones}`}
        >
          <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Cada una publica su razonamiento, su contraevidencia, sus límites y su confianza.
            Ninguna está aceptada: aceptar exige una firma humana que el procedimiento todavía
            no ha recogido.
          </p>
          <ListaAfirmaciones afirmaciones={afirmacionesDeCohorte} />
        </Disclosure>

        <Disclosure summary="Anexo B · Lo que la evidencia pública no alcanza a mostrar" hint="12 lagunas">
          <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Quien vaya a citar este informe necesita saber qué no puede citar.
          </p>
          <Lagunas />
        </Disclosure>

        <Disclosure summary="Anexo C · Matriz de evidencia localizada por dimensión" hint="metodología 2.0">
          <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Es el comparador con que se publicó la v0.6.0, y se conserva por dos razones. La
            primera es de trazabilidad: quien leyó la versión anterior debe poder reencontrar lo
            que leyó. La segunda es de honestidad metodológica: la matriz de capacidades es una
            propuesta nueva, y hacer desaparecer la anterior impediría comprobar si el cambio de
            instrumento cambió las conclusiones. La respuesta —que las cambió en dos puntos y en
            ningún otro— está en el análisis de sensibilidad de la metodología 2.1.
          </p>
          <MatrizEvidencia />
        </Disclosure>

        <Disclosure summary="Anexo D · Auditoría de la línea base de 2025" hint="documento antecedente">
          <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
            El informe anterior es línea de base documental, no una medición válida de 2026. Se
            audita a la vista y se conserva sin modificar.
          </p>
          <AuditoriaLineaBase />
        </Disclosure>
      </div>

      <Notice tone="warning" className="mt-8 max-w-prose">
        Este documento es un <strong>borrador académico para revisión</strong>. De sus{' '}
        {informe01Recuento.fuentes} fuentes, {informe01Recuento.fuentesVerificadas} han sido
        abiertas y contrastadas contra su publicación original y{' '}
        {informe01Recuento.fuentes - informe01Recuento.fuentesVerificadas} no lo han sido
        todavía. Ninguna afirmación está aceptada en el sentido editorial del protocolo. Las
        cifras y los estados que aquí se publican pueden cambiar cuando la verificación se
        complete, y el reparto de lo verificado no es uniforme entre instituciones.
      </Notice>
    </Section>
  );
}

/* ── Piezas ────────────────────────────────────────────────────────────────── */

function Campo({
  etiqueta,
  children,
  atenuado = false,
}: {
  etiqueta: string;
  children: string;
  atenuado?: boolean;
}) {
  return (
    <div className="sm:flex sm:gap-4">
      <dt className="meta shrink-0 sm:w-16 sm:pt-0.5">{etiqueta}</dt>
      <dd className={atenuado ? 'text-sm leading-relaxed text-muted-foreground' : 'text-sm leading-relaxed text-foreground/85'}>
        <Marcado>{children}</Marcado>
      </dd>
    </div>
  );
}

function Parrafo({ children, destacado = false }: { children: string; destacado?: boolean }) {
  return (
    <p className={destacado ? 'text-base leading-relaxed text-foreground' : undefined}>
      <Marcado>{children}</Marcado>
    </p>
  );
}

/**
 * Resuelve las marcas de cifra y el énfasis `**negrita**` sin traer un
 * renderizador de Markdown al servidor. La prosa usa el énfasis una vez por
 * párrafo como mucho, así que cuatro líneas bastan.
 */
function Marcado({ children }: { children: string }) {
  return (
    <>
      {t(children)
        .split(/(\*\*[^*]+\*\*)/g)
        .map((parte, i) =>
          parte.startsWith('**') && parte.endsWith('**') ? (
            <strong key={i} className="font-medium text-foreground">
              {parte.slice(2, -2)}
            </strong>
          ) : (
            parte
          ),
        )}
    </>
  );
}
