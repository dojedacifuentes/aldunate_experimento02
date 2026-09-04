import Link from 'next/link';

import { ButtonLink, Notice, Section, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import { CoberturaInvestigacion } from './Cobertura';
import { EscaleraInstitucionalizacion, MapaDirecciones } from './Escalera';
import { AuditoriaLineaBase, Lagunas } from './Lagunas';
import { ListaAfirmaciones } from './Afirmaciones';
import { MatrizEvidencia } from './Matriz';
import { PucvEnContexto } from './Pucv';
import { afirmacionesDeCohorte } from '@/lib/informe01';

/**
 * La publicación del Informe 01, en capas de lectura progresiva.
 *
 * El orden no es decorativo. La cobertura va **antes** que la comparación
 * porque sin el denominador la comparación engaña, y las lagunas van antes que
 * la sección de la PUCV porque una carencia sólo significa algo cuando ya se
 * sabe dónde se buscó y dónde no.
 *
 * Sin JavaScript de cliente: todo lo que se pliega usa `<details>` nativo, toda
 * cifra viene del dataset compilado y ninguna visualización necesita hidratarse.
 * La página funciona impresa y con el JavaScript apagado, que es la prueba que
 * una publicación académica tiene que pasar.
 */
export function Informe01Publicacion() {
  const r = informe01Recuento;

  return (
    <>
      {/* ── Qué se puede decir y qué no ── */}
      <Section
        eyebrow="Hallazgos"
        title="Qué muestra la evidencia, y qué no alcanza a mostrar"
        description="Cuatro lecturas que el corpus sostiene, y tres que todavía no. Las cifras se calculan desde el dataset canónico: ninguna está escrita a mano."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Cifra
            valor={String(r.iniciativasEvaluadas)}
            de={`de ${r.iniciativas}`}
            etiqueta="iniciativas con evaluación de efecto"
            nota="Ninguna. Es la conclusión más sólida del informe, y tres rondas independientes llegaron a ella por separado."
            destacada
          />
          <Cifra
            valor={String(r.fuentes)}
            de={`${r.fuentesInstitucionales} institucionales`}
            etiqueta="fuentes públicas únicas"
            nota={`Dos son bases oficiales de universo nacional. Ninguna proviene de contraste externo.`}
          />
          <Cifra
            valor={`${r.razonCobertura}:1`}
            de={`${r.coberturaPiloto} frente a ${r.coberturaResto}`}
            etiqueta="asimetría de cobertura"
            nota="Fuentes de media en el piloto de tres frente a las otras ocho. Por eso no hay comparación nacional."
          />
          <Cifra
            valor={String(r.fuentesVerificadas)}
            de={`de ${r.fuentes}`}
            etiqueta="fuentes con verificación sustantiva"
            nota="Que una URL responda no prueba que diga lo que se le atribuye. De las abiertas y contrastadas, once no decían lo que el registro les asignaba. Mientras la cifra no alcance el total, esto es un borrador y no un informe de resultados."
            destacada
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="meta mb-4">Lo que vemos</h3>
            <ul className="space-y-3">
              {[
                'Cuatro Facultades crearon entre 2025 y 2026 una estructura dedicada a tecnología o inteligencia artificial. En ninguna de las cuatro se localizó el acto que la constituye; sólo una figura en el organigrama de su Facultad.',
                'El uso interno de IA dejó de ser una casilla vacía: cuatro instituciones documentan herramientas o formación desplegadas dentro de la enseñanza del Derecho.',
                'La formación continua es el único eje con serie temporal documentada, y la serie es de una sola institución: dos graduaciones consecutivas, de más de 90 y más de 100 titulados.',
                'Una sola norma sobre IA del corpus la dictó una Facultad de Derecho, con órgano aprobador y sanción. Los otros dos instrumentos son universitarios y orientadores.',
              ].map((t) => (
                <li
                  key={t}
                  className="border-l-2 border-l-signal bg-signal/[0.05] px-4 py-3 text-sm leading-relaxed text-foreground/85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="meta mb-4 text-warning">Lo que todavía no sabemos</h3>
            <ul className="space-y-3">
              {[
                'Si algo de esto funciona. Ninguna fuente mide efecto sobre el aprendizaje jurídico, en ninguna de las once instituciones.',
                'Qué se enseña de verdad. No se localizó ningún syllabus de 2026 con obligatoriedad, semestre, créditos y matrícula real.',
                'Con qué se sostiene. Dos de las ocho dimensiones —recursos y capacidades, y continuidad y resultados— están vacías en toda la cohorte.',
              ].map((t) => (
                <li
                  key={t}
                  className="border-l-2 border-l-warning bg-warning/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Cobertura, antes que cualquier comparación ── */}
      <Section
        eyebrow="Cobertura"
        title="Cuánto se investigó cada institución"
        description="Este gráfico va antes que la matriz y no después. Sin él, una fila más poblada se lee como una universidad que hace más, cuando indica dónde se buscó más."
      >
        <CoberturaInvestigacion />
      </Section>

      {/* ── La matriz ── */}
      <Section
        eyebrow="Comparación"
        title="Chile en una mirada"
        description="Evidencia pública localizada por universidad y dimensión, al corte del 1 de septiembre de 2026. No es un ranking, y las filas van en orden alfabético para que no pueda leerse como uno."
        className="scroll-mt-20"
      >
        <div id="matriz">
          <MatrizEvidencia />
        </div>
      </Section>

      {/* ── De la actividad a la capacidad ── */}
      <Section
        eyebrow="Institucionalización"
        title="De la actividad a la capacidad"
        description="La distinción que organiza el informe entero. Actividad es lo que ocurre; capacidad es lo que sigue ocurriendo cuando la persona que lo empujó cambia de cargo."
      >
        <EscaleraInstitucionalizacion />
      </Section>

      <Section
        eyebrow="Taxonomía"
        title="Qué clase de relación con la IA"
        description="Enseñar con IA y estudiar el Derecho de la IA son cosas distintas, y confundirlas infla el mapa sin inventar una sola fuente."
      >
        <MapaDirecciones />
      </Section>

      {/* ── Fichas ── */}
      <Section
        eyebrow="Instituciones"
        title="Las once, una por una"
        description="Cada ficha empieza por su cobertura y no por sus hallazgos, porque sin el denominador la ficha engaña."
      >
        <Surface className="p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Las fichas institucionales viven en una página propia: son{' '}
            {r.universidades} instituciones, {r.iniciativas} iniciativas y {r.evidencias}{' '}
            evidencias, y meterlas aquí convertiría el informe en un documento que nadie
            recorre hasta el final.
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

      {/* ── PUCV ── */}
      <Section
        eyebrow="Caso de interés"
        title="PUCV: doce temas de capacidad institucional"
        description="La pregunta no es si la PUCV hace algo con inteligencia artificial. Es qué faltaría para que lo que ya hace alcance un grado superior de institucionalización."
        className="scroll-mt-20"
      >
        <div id="pucv">
          <PucvEnContexto />
        </div>
      </Section>

      {/* ── Afirmaciones ── */}
      <Section
        eyebrow="Trazabilidad"
        title="Las afirmaciones, con su cadena completa"
        description="Cada una publica su razonamiento, su contraevidencia, sus límites y su confianza. Ninguna está aceptada: el procedimiento no ha llegado hasta ahí."
        className="scroll-mt-20"
      >
        <div id="afirmaciones">
          <ListaAfirmaciones afirmaciones={afirmacionesDeCohorte} />
        </div>
      </Section>

      {/* ── Lagunas ── */}
      <Section
        eyebrow="Límites"
        title="Lo que la evidencia pública no alcanza a mostrar"
        description="Doce lagunas declaradas. Quien vaya a citar este informe necesita saber qué no puede citar."
        className="scroll-mt-20"
      >
        <div id="lagunas">
          <Lagunas />
        </div>
      </Section>

      {/* ── Auditoría de la línea base ── */}
      <Section
        eyebrow="Antecedente"
        title="Auditoría de la línea base"
        description="El informe anterior es línea de base documental, no una medición válida de 2026. Se audita a la vista y se conserva sin modificar."
      >
        <AuditoriaLineaBase />
      </Section>

      {/* ── Cierre ── */}
      <Section eyebrow="Cierre" title="Qué habría que observar después">
        <div className="prose-editorial max-w-2xl">
          <p>
            La discusión chilena dejó de ser si las Facultades de Derecho deben reaccionar a
            la inteligencia artificial. Varias ya crearon departamentos, direcciones,
            políticas, programas y herramientas, y lo hicieron entre 2025 y 2026.
          </p>
          <p>
            La diferencia que emerge es otra, y este informe todavía no puede resolverla:
            cuáles de esas iniciativas se convierten en capacidad sostenida y evaluable. La
            casilla vacía del cuarto peldaño dice que, al corte, ninguna institución de la
            cohorte lo ha demostrado públicamente. No dice que nadie lo esté haciendo: dice
            que nadie lo ha publicado, y son cosas distintas.
          </p>
          <p>
            El siguiente dato que cambiaría la lectura es barato y concreto: una sola
            Facultad que mida el efecto de una sola actividad que ya realiza, y lo publique.
            Sería el primer registro de nivel 4 del país.
          </p>
        </div>
        <Notice tone="warning" className="mt-8 max-w-2xl">
          Nada de esta página debe citarse todavía como resultado. Las {r.fuentes} fuentes
          fueron abiertas por los modelos que produjeron los documentos de investigación, no
          por quien firma: la verificación sustantiva —abrir cada una y contrastar lo que
          dice contra lo que se le atribuye— sigue pendiente y no se delega.{' '}
          <Link href="/investigacion" className="text-primary hover:underline">
            Ver el método
          </Link>
          .
        </Notice>
      </Section>
    </>
  );
}

function Cifra({
  valor,
  de,
  etiqueta,
  nota,
  destacada = false,
}: {
  valor: string;
  de: string;
  etiqueta: string;
  nota: string;
  destacada?: boolean;
}) {
  return (
    <Surface className={destacada ? 'border-warning/40 p-5' : 'p-5'}>
      <p className="flex items-baseline gap-2">
        <span className="mono text-3xl leading-none text-foreground" data-count>
          {valor}
        </span>
        <span className="mono text-[0.6875rem] text-muted-foreground">{de}</span>
      </p>
      <p className="mt-2 text-sm leading-snug text-foreground/85">{etiqueta}</p>
      <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">{nota}</p>
    </Surface>
  );
}
