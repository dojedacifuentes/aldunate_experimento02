import { Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import {
  CAPACIDADES,
  celdaCapacidad,
  ESTADOS_CAPACIDAD,
  mecanismosDe,
} from '@/lib/informe01-capacidades';
import {
  coberturaVsCapacidadSvg,
  lineaTiempoSvg,
  mapaDesarrolloSvg,
  matrizCapacidadesSvg,
  mecanismosSvg,
} from '@/lib/informe01-graficos';
import { coberturaDe, universidadesOrdenadas } from '@/lib/informe01';

import { Figura } from './Figura';

const ids = universidadesOrdenadas.map((u) => u.id);
const nombre = (id: string) =>
  universidadesOrdenadas.find((u) => u.id === id)?.officialName ?? id;
const estadoLabel = (id: string, cap: string) =>
  ESTADOS_CAPACIDAD.find((e) => e.id === celdaCapacidad(id, cap as never).estado)!.label;

/**
 * La matriz de capacidades: la visualización principal de la versión 0.7.0.
 *
 * Sustituye a la matriz de evidencia localizada, que respondía «¿cuánta
 * evidencia encontramos?» cuando la pregunta del informe es «¿qué capacidad
 * demuestra cada Facultad?». La anterior se conserva en anexo, porque el cambio
 * de instrumento no autoriza a hacer desaparecer el instrumento anterior.
 */
export function MatrizCapacidades() {
  const total = ids.length * CAPACIDADES.length;
  const sinConcluir = ids.reduce(
    (s, id) =>
      s + CAPACIDADES.filter((c) => celdaCapacidad(id, c.id).estado === 'NO_CONCLUYENTE').length,
    0,
  );

  return (
    <div>
      <Figura
        ancha
        pregunta="¿Qué capacidad institucional demuestra cada Facultad, y dónde no podemos saberlo?"
        titulo="Diez capacidades, once Facultades, y una de cada cuatro celdas todavía sin respuesta"
        svg={matrizCapacidadesSvg()}
        nota={
          <>
            Cada celda se calcula desde el dataset con una regla mecánica, no con un juicio
            editorial. Una capacidad está <strong>en operación</strong> cuando la Facultad, un
            centro suyo o un equipo académico sostiene un mecanismo en el segundo peldaño de la
            escalera o más arriba. Las ausencias se separan en dos, y es la corrección
            metodológica de esta versión: <strong>no localizada</strong> significa que se
            recorrió la ruta del protocolo que la habría encontrado; <strong>no
            concluyente</strong>, que esa ruta no se recorrió en esa institución. {sinConcluir}{' '}
            de las {total} celdas son de la segunda clase, de modo que la matriz declara los
            límites del trabajo de campo en lugar de disimularlos.
          </>
        }
        alternativa={<ListaCapacidades />}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Surface className="p-5">
          <p className="meta mb-3">Por qué no hay una columna de totales</p>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            Sumar capacidades produciría un número por institución, y ese número sería un
            ranking del trabajo de campo tanto como del trabajo institucional: cinco
            capacidades observadas con dos rutas recorridas y cinco con once no son la misma
            cantidad de información. La matriz se lee fila a fila, comparando estados, no
            magnitudes.
          </p>
        </Surface>
        <Surface className="p-5">
          <p className="meta mb-3">Qué cambió respecto de la versión anterior</p>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            La matriz de la v0.6.0 contaba evidencias por dimensión, y una fila más poblada
            indicaba dónde se había buscado más. El aviso que lo advertía no corregía la
            lectura visual. Aquí la desigualdad de cobertura está{' '}
            <strong className="text-foreground">dentro de cada celda</strong>, que es donde el
            lector la necesita.
          </p>
        </Surface>
      </div>
    </div>
  );
}

/** Alternativa textual de la matriz: institución por institución, en prosa. */
function ListaCapacidades() {
  return (
    <ul className="space-y-4">
      {universidadesOrdenadas.map((u) => {
        const porEstado = (estado: string) =>
          CAPACIDADES.filter((c) => celdaCapacidad(u.id, c.id).estado === estado).map(
            (c) => c.label.toLowerCase(),
          );
        const operacion = porEstado('EN_OPERACION');
        const incipiente = porEstado('INCIPIENTE');
        const entorno = porEstado('SOLO_ENTORNO');
        const noLocalizada = porEstado('NO_LOCALIZADA');
        const noConcluyente = porEstado('NO_CONCLUYENTE');
        return (
          <li key={u.id}>
            <p className="text-sm font-medium text-foreground">{u.officialName}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {[
                operacion.length && `En operación: ${operacion.join(', ')}.`,
                incipiente.length && `Incipiente: ${incipiente.join(', ')}.`,
                entorno.length && `Sólo en el entorno: ${entorno.join(', ')}.`,
                noLocalizada.length && `No localizada: ${noLocalizada.join(', ')}.`,
                noConcluyente.length &&
                  `Sin concluir porque no se recorrió su ruta: ${noConcluyente.join(', ')}.`,
              ]
                .filter(Boolean)
                .join(' ')}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * El gráfico que impide confundir las dos variables. Va emparejado con el caso
 * que lo prueba dentro del propio corpus, porque una advertencia enunciada se
 * olvida y un contraejemplo no.
 */
export function CoberturaFrenteACapacidad() {
  const filas = universidadesOrdenadas.map((u) => {
    const cob = coberturaDe(u.id)!;
    const celdas = CAPACIDADES.map((c) => celdaCapacidad(u.id, c.id));
    return {
      u,
      rutas: cob.routesCompleted,
      operacion: celdas.filter((c) => c.estado === 'EN_OPERACION').length,
      sinConcluir: celdas.filter((c) => c.estado === 'NO_CONCLUYENTE').length,
    };
  });
  const masInvestigada = [...filas].sort((a, b) => b.rutas - a.rutas)[0];
  const menosInvestigada = [...filas].sort((a, b) => a.rutas - b.rutas)[0];

  return (
    <div>
      <Figura
        pregunta="¿Cuánto de lo que vemos es lo que hacen las Facultades, y cuánto es dónde miramos?"
        titulo={`${menosInvestigada.u.officialName} acredita tantas capacidades como ${masInvestigada.u.officialName} con una quinta parte del trabajo de campo`}
        svg={coberturaVsCapacidadSvg()}
        nota={
          <>
            El eje vertical no es una nota ni un puntaje: es el recuento de preguntas que el
            corpus contesta afirmativamente, y está acotado por arriba por lo que se buscó. Por
            eso cada punto lleva un halo gris proporcional a sus celdas sin concluir. Un punto
            bajo con halo grande no dice «hace poco»: dice «no lo sabemos».
          </>
        }
        alternativa={
          <ul className="space-y-2">
            {filas.map((f) => (
              <li key={f.u.id} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                <span className="text-foreground">{f.u.officialName}</span> · {f.rutas} de 13
                rutas recorridas · {f.operacion} de 10 capacidades en operación ·{' '}
                {f.sinConcluir} celdas sin concluir.
              </li>
            ))}
          </ul>
        }
      />
      <Notice tone="signal">
        Este par de valores es la razón por la que el informe no publica ranking.{' '}
        <strong>{menosInvestigada.u.officialName}</strong> es la institución menos investigada
        de las once —{menosInvestigada.rutas} de trece rutas, ninguna fuente contrastada— y
        aporta la única cobertura docente cuantificada de todo el corpus. Si el trabajo de campo
        y la capacidad institucional fueran la misma variable, ese punto no podría existir.
      </Notice>
    </div>
  );
}

/** Con qué instrumentos se hace lo que se hace. Sustituye al recuento de iniciativas. */
export function MecanismosInstitucionales() {
  return (
    <Figura
      pregunta="¿Con qué instrumentos institucionales se está incorporando la inteligencia artificial?"
      titulo="Predominan los programas formativos y las herramientas; los convenios y las publicaciones son marginales"
      svg={mecanismosSvg()}
      nota={
        <>
          El mecanismo es un eje nuevo de la metodología 2.1 y es ortogonal a la dimensión: la
          dimensión dice en qué ámbito académico ocurre algo y el mecanismo, con qué instrumento
          se hace. Clasificar no aportó evidencia nueva —reordena la que ya estaba verificada en
          el nombre, la unidad responsable y los productos de cada registro—, de modo que no
          reabre la verificación de ninguna fuente.
        </>
      }
      alternativa={
        <ul className="space-y-2">
          {universidadesOrdenadas.map((u) => (
            <li key={u.id} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              <span className="text-foreground">{u.officialName}</span> ·{' '}
              {mecanismosDe(u.id)
                .map((m) => `${m.label.toLowerCase()} (${m.iniciativas.length})`)
                .join(', ')}
              .
            </li>
          ))}
        </ul>
      }
    />
  );
}

/** Cuándo empezó todo esto. Es la visualización que la v0.6.0 declaraba y no tenía. */
export function LineaDeTiempo() {
  return (
    <Figura
      pregunta="¿Desde cuándo existe este fenómeno en las Facultades chilenas?"
      titulo="El campo entero cabe en dos años: 41 de las 49 iniciativas fechadas empiezan en 2025 o después"
      svg={lineaTiempoSvg()}
      nota={
        <>
          El año es el de inicio declarado por la fuente, no el de su publicación. Cuatro
          iniciativas no declaran fecha y no se les inventa una. Las dos anteriores a 2020 son
          unidades que existían antes de la inteligencia artificial generativa y que después
          incorporaron el tema: su antigüedad no es antigüedad en esta materia, y por eso se
          agrupan aparte.
        </>
      }
    />
  );
}

/**
 * Mapa de desarrollo de una institución. Se usa para la PUCV en el cuerpo del
 * informe y está disponible para cualquiera de las once: la herramienta no está
 * hecha para una sola, que es lo que la vuelve un instrumento y no un alegato.
 */
export function MapaDesarrollo({ universityId }: { universityId: string }) {
  const celdas = CAPACIDADES.map((c) => ({ c, celda: celdaCapacidad(universityId, c.id) }));
  const operacion = celdas.filter((x) => x.celda.estado === 'EN_OPERACION');
  const pendientes = celdas.filter((x) => x.celda.estado !== 'EN_OPERACION');

  return (
    <Figura
      ancha
      pregunta={`¿Qué capacidades constan hoy en ${nombre(universityId)} y con qué instrumento las resolvieron las Facultades donde ya están en operación?`}
      titulo={`${operacion.length} de las diez capacidades constan en operación; las otras ${pendientes.length} no se distribuyen por igual`}
      svg={mapaDesarrolloSvg(universityId)}
      nota={
        <>
          No es un semáforo. La tercera columna no propone una meta: nombra las Facultades donde
          esa misma capacidad consta en operación, para que la comparación sea con un mecanismo
          concreto y no con un adjetivo. Que una capacidad esté sin concluir no es un reproche a
          la institución: es una tarea pendiente de esta investigación.
        </>
      }
      alternativa={
        <ul className="space-y-2">
          {celdas.map(({ c, celda }) => (
            <li key={c.id} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              <span className="text-foreground">{c.label}</span> ·{' '}
              {estadoLabel(universityId, c.id)}. {celda.motivo}
            </li>
          ))}
        </ul>
      }
    />
  );
}

/** Cifras de encabezado, calculadas y nunca escritas a mano. */
export function CifrasDeCapacidad() {
  const conteo = (estado: string) =>
    ids.reduce(
      (s, id) => s + CAPACIDADES.filter((c) => celdaCapacidad(id, c.id).estado === estado).length,
      0,
    );
  return {
    total: ids.length * CAPACIDADES.length,
    operacion: conteo('EN_OPERACION'),
    incipiente: conteo('INCIPIENTE'),
    entorno: conteo('SOLO_ENTORNO'),
    noLocalizada: conteo('NO_LOCALIZADA'),
    noConcluyente: conteo('NO_CONCLUYENTE'),
    iniciativas: informe01Recuento.iniciativas,
  };
}

/**
 * Comparador de mecanismos.
 *
 * Responde la pregunta que una sección institucional debe responder y que un
 * recuento de iniciativas no responde: **con qué instrumento concreto resolvió
 * esto la Facultad donde ya está resuelto**. No dice qué debería hacerse; nombra
 * el mecanismo, la institución y la fuente, y deja la inferencia al lector.
 *
 * Es la pieza que sustituye a la comparación por adjetivos. «Otras Facultades
 * están más avanzadas» no es información. «La Facultad de Derecho UC dictó una
 * guía ética aprobada para toda la Facultad, y aquí el único instrumento
 * localizado es un decálogo de la Vicerrectoría» sí lo es.
 */
export function ComparadorMecanismos({ universityId }: { universityId: string }) {
  const filas = CAPACIDADES.map((c) => {
    const propia = celdaCapacidad(universityId, c.id);
    const referentes = ids
      .filter((o) => o !== universityId)
      .map((o) => ({ id: o, celda: celdaCapacidad(o, c.id) }))
      .filter((x) => x.celda.estado === 'EN_OPERACION');
    return { c, propia, referentes };
  }).filter((f) => f.propia.estado !== 'EN_OPERACION');

  return (
    <div className="space-y-4">
      {filas.map(({ c, propia, referentes }) => (
        <Surface key={c.id} className="p-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="font-serif text-base leading-snug text-foreground">{c.label}</h4>
            <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
              {ESTADOS_CAPACIDAD.find((e) => e.id === propia.estado)!.label}
            </span>
          </div>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {c.pregunta}
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="sm:flex sm:gap-3">
              <dt className="meta shrink-0 sm:w-32">Aquí consta</dt>
              <dd className="text-muted-foreground">
                {propia.iniciativas.length
                  ? propia.iniciativas.map((i) => i.name).join(' · ')
                  : propia.motivo}
              </dd>
            </div>
            <div className="sm:flex sm:gap-3">
              <dt className="meta shrink-0 sm:w-32">Mecanismo observado</dt>
              <dd className="text-muted-foreground">
                {referentes.length ? (
                  <ul className="space-y-1">
                    {referentes.map((r) => (
                      <li key={r.id}>
                        <span className="text-foreground">
                          {r.celda.iniciativas.map((i) => i.name).join(', ')}
                        </span>{' '}
                        · {nombre(r.id)}
                        {r.celda.contrastada && (
                          <span className="mono ml-2 text-[0.5625rem] uppercase tracking-widest text-accent">
                            fuente contrastada
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'En ninguna de las otras diez consta esta capacidad en operación. No hay referente que observar.'
                )}
              </dd>
            </div>
          </dl>
        </Surface>
      ))}
    </div>
  );
}
