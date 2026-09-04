import { Notice } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import {
  ATRIBUCIONES,
  DIRECCIONES,
  distribucionDirecciones,
  distribucionEscalera,
  ESCALONES,
  universidad,
} from '@/lib/informe01';
import { direccionesSvg, escaleraSvg } from '@/lib/informe01-graficos';

import { Figura } from './Figura';

/**
 * Escalera de institucionalización, aplicada a **iniciativas**.
 *
 * Una universidad no está en un escalón: sus iniciativas sí. La Universidad
 * Católica tiene a la vez una guía ética aprobada por su Consejo de Facultad y
 * seminarios sueltos, y promediarlos produciría un número que no describe
 * ninguno de los dos. Por eso aquí se distribuyen las 53 iniciativas y no las
 * once instituciones.
 *
 * El último peldaño está vacío, y ésa es la lectura principal del informe.
 */
export function EscaleraInstitucionalizacion() {
  const dist = distribucionEscalera();
  const total = dist.reduce((s, d) => s + d.iniciativas.length, 0);
  const vacio = dist.find((d) => d.nivel === 4)!;

  return (
    <div>
      <Figura
        pregunta="¿Hasta dónde llega la institucionalización de lo que se hace?"
        titulo="La escalera se llena hasta el tercer peldaño y se detiene antes del cuarto"
        svg={escaleraSvg()}
        nota={
          <>
            El peldaño se aplica a la iniciativa y nunca a la universidad, y no se promedia:
            una institución puede exhibir muchas actividades con baja institucionalización y
            otra pocas pero formalizadas. El informe existe para conservar esa diferencia, y un
            promedio la borraría.
          </>
        }
        alternativa={
          <ol className="space-y-3">
            {dist.map(({ nivel, iniciativas }) => {
              const meta = ESCALONES.find((e) => e.nivel === nivel)!;
              const pct = total ? Math.round((iniciativas.length / total) * 100) : 0;
              return (
                <li key={nivel}>
                  <p className="text-sm font-medium text-foreground">
                    <span className="mono mr-2 text-primary">{nivel}</span>
                    {meta.label}
                    <span className="mono ml-2 text-xs font-normal text-muted-foreground">
                      {iniciativas.length} de {total}
                      {iniciativas.length > 0 && ` · ${pct} %`}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {meta.condition}
                  </p>
                  {iniciativas.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {iniciativas.map((i) => (
                        <li key={i.id} className="text-[0.8125rem] leading-relaxed">
                          <span className="text-foreground">{i.name}</span>
                          <span className="text-muted-foreground">
                            {' '}
                            · {universidad(i.universityId)?.officialName}
                          </span>
                          <span className="mono ml-2 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
                            {ATRIBUCIONES[i.attribution].label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        }
      />

      <Notice tone="warning">
        Ninguna de las {total} iniciativas registradas alcanza el cuarto peldaño. Se localizaron
        métricas de cobertura —cerca del 80 % del profesorado de Derecho de una Facultad, unos
        noventa participantes en un taller, dos cohortes graduadas— y ninguna es una medición de
        efecto: cuántos asistieron no dice si algo cambió. Tres rondas de investigación
        independientes, con documentos distintos y fuentes que apenas se solapan, llegaron a
        esta misma ausencia. Con todo, la ruta del protocolo que acreditaría una evaluación
        publicada —repositorios y publicaciones— sólo se recorrió en dos de las once
        instituciones, de modo que la afirmación es sólida sobre el corpus y todavía no está
        cerrada sobre cada Facultad. Ver el {vacio.iniciativas.length === 0 ? 'peldaño vacío' : 'peldaño'} en la matriz de capacidades.
      </Notice>
    </div>
  );
}

/**
 * Qué clase de relación con la IA tiene cada iniciativa.
 *
 * La distinción hace un trabajo concreto: impide que una Facultad que discute la
 * regulación de la IA aparezca como una que la usa para enseñar, y viceversa.
 * Y `ADYACENTE` existe para lo contrario: tratar como IA una tecnología digital
 * que no lo es —realidad virtual, un laboratorio de innovación legal, una
 * plataforma de búsqueda— es el modo de inflar un mapa sin inventar una fuente.
 */
export function MapaDirecciones() {
  const dist = distribucionDirecciones();
  const total = informe01Recuento.iniciativas;

  return (
    <Figura
      pregunta="¿Se está usando la IA para enseñar Derecho, o se la está estudiando como objeto jurídico?"
      titulo="Tres de cada cuatro iniciativas usan la IA; una minoría la estudia como problema jurídico"
      svg={direccionesSvg()}
      nota={
        <>
          {DIRECCIONES.length} categorías y {total} iniciativas, sin solapamiento: cada
          iniciativa recibe una sola dirección, y las que integran las dos de forma sustantiva
          se registran como <span className="mono text-foreground">AMBOS</span> en vez de
          contarse dos veces. <span className="mono text-foreground">ADYACENTE</span> existe
          para lo contrario: tratar como inteligencia artificial una tecnología digital que no
          lo es —realidad virtual, un laboratorio de innovación legal, una plataforma de
          búsqueda— es el modo de inflar un mapa sin inventar una sola fuente.
        </>
      }
      alternativa={
        <ul className="space-y-3">
          {dist.map((d) => (
            <li key={d.id}>
              <p className="text-sm font-medium text-foreground">
                {d.label}
                <span className="mono ml-2 text-xs font-normal text-muted-foreground">
                  {d.iniciativas.length} de {total} ·{' '}
                  {Math.round((d.iniciativas.length / total) * 100)} %
                </span>
              </p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {d.definition}
              </p>
            </li>
          ))}
        </ul>
      }
    />
  );
}
