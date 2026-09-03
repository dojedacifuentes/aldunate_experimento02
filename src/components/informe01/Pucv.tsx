import { Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import { informe01TemasPucv } from '@/data/informe01-editorial';
import { afirmacionesDe, coberturaDe, iniciativasDe } from '@/lib/informe01';
import { ListaAfirmaciones } from './Afirmaciones';
import { cn } from '@/lib/utils';
import type { Informe01EstadoTema } from '@/data/informe01-editorial';

/**
 * PUCV en contexto.
 *
 * La sección tiene una regla propia y es la que la hace defendible: **reconoce
 * primero lo que existe.** El antecedente describía a la PUCV como un conjunto
 * de iniciativas inconexas, y la evidencia de 2026 no sostiene esa lectura: hay
 * una unidad oficializada en 2020, un laboratorio desde 2022, una herramienta
 * nacida para estudiantes de Derecho, un taller que se ejecutó y se volvió a
 * financiar, y un decálogo universitario liderado desde Derecho.
 *
 * Lo que sigue no es un juicio sobre la Facultad sino sobre la evidencia
 * pública, y arrastra una advertencia que no puede omitirse: la PUCV es una de
 * las tres universidades del piloto, con la cobertura más alta del corpus junto
 * a la Universidad de Chile. Se la mira con más luz que a las otras ocho, y una
 * carencia sólo se ve donde se ha buscado.
 */

const ESTADOS: Record<Informe01EstadoTema, { label: string; clase: string }> = {
  existe: { label: 'Existe', clase: 'text-success border-success/35 bg-success/[0.08]' },
  parcial: { label: 'Parcial', clase: 'text-warning border-warning/35 bg-warning/[0.08]' },
  'no-demostrado': {
    label: 'No demostrado públicamente',
    clase: 'text-muted-foreground border-border bg-muted/50',
  },
};

export function PucvEnContexto() {
  const cob = coberturaDe('pucv');
  const inis = iniciativasDe('pucv');
  const claims = afirmacionesDe('pucv');
  const conteo = (e: Informe01EstadoTema) =>
    informe01TemasPucv.filter((f) => f.estado === e).length;

  return (
    <div>
      <div className="prose-editorial max-w-2xl">
        <p>
          La PUCV no parte de cero, y ése es exactamente el punto. De las {inis.length}{' '}
          iniciativas registradas, la más antigua se oficializó en 2020 y la más reciente
          obtuvo financiamiento en 2026: hay continuidad, personas y programas suficientes
          para que la pregunta siguiente ya no sea si conviene experimentar.
        </p>
        <p>
          Lo que la evidencia pública no muestra es el paso siguiente. De los doce temas de
          la tabla, {conteo('existe')} tienen evidencia, {conteo('parcial')} la tienen
          parcial y {conteo('no-demostrado')} no se localizaron. Y conviene leer esa última
          columna con cuidado: tres de esos temas —dotación, adopción cuantificada y
          evaluación— tampoco se localizaron en ninguna de las otras diez universidades. No
          son carencias de la PUCV: son carencias del campo, que aquí se ven mejor porque
          aquí se buscó más.
        </p>
      </div>

      <Notice tone="warning" className="mt-6">
        Advertencia de lectura, y no es una formalidad. La PUCV es una de las tres
        universidades del piloto de profundidad: se recorrieron {cob?.routesCompleted} de{' '}
        {cob?.routesTotal} rutas del protocolo y se localizaron {cob?.sources} fuentes, frente
        a una media de {informe01Recuento.rutasResto} rutas y{' '}
        {informe01Recuento.coberturaResto} fuentes en las ocho restantes. Una carencia sólo
        se ve donde se ha buscado, de modo que esta tabla describe una asimetría de evidencia
        y no una asimetría demostrada de actividad.
      </Notice>

      <div className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[48rem] border-collapse text-sm">
          <caption className="sr-only">
            Doce temas de capacidad institucional en la PUCV, con su estado de evidencia
            pública, la evidencia localizada y el próximo salto verificable.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="meta py-3 pr-4 text-left">
                Tema
              </th>
              <th scope="col" className="meta px-4 py-3 text-left">
                Estado
              </th>
              <th scope="col" className="meta px-4 py-3 text-left">
                Qué muestra la evidencia pública
              </th>
              <th scope="col" className="meta py-3 pl-4 text-left">
                Próximo salto verificable
              </th>
            </tr>
          </thead>
          <tbody>
            {informe01TemasPucv.map((f) => (
              <tr key={f.tema} className="border-b border-border/50 align-top">
                <th scope="row" className="py-4 pr-4 text-left text-sm font-medium text-foreground">
                  {f.tema}
                </th>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      'mono inline-block whitespace-nowrap rounded border px-2 py-0.5 text-[0.625rem] uppercase tracking-wider',
                      ESTADOS[f.estado].clase,
                    )}
                  >
                    {ESTADOS[f.estado].label}
                  </span>
                </td>
                <td className="px-4 py-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {f.evidencia}
                </td>
                <td className="py-4 pl-4 text-[0.8125rem] leading-relaxed text-foreground/85">
                  {f.salto}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Surface className="mt-8 p-6">
        <p className="meta mb-3">Lo que la comparación permite decir, y lo que no</p>
        <div className="prose-editorial max-w-2xl">
          <p>
            Permite decir que otras Facultades han publicado actos que la PUCV no ha
            publicado: una guía ética aprobada por un Consejo de Facultad, una dirección con
            mandato curricular explícito, un minor con una cohorte egresada, una cobertura
            docente medida. Son hechos verificables y están fechados.
          </p>
          <p>
            No permite decir que la PUCV esté por detrás. Para eso haría falta haber buscado
            en las otras ocho con la misma intensidad, y no se hizo: la razón de cobertura es
            de {informe01Recuento.razonCobertura} a 1. Lo que sí puede afirmarse, y es
            distinto, es que la PUCV tiene hoy más evidencia pública disponible sobre sí
            misma que ocho de sus pares, y aun así ninguno de los tres indicadores que separan
            actividad de capacidad —dotación, adopción medida y evaluación— aparece en ella
            ni en ninguna otra.
          </p>
        </div>
      </Surface>

      {claims.length > 0 && (
        <div className="mt-8">
          <h3 className="meta mb-4">Las afirmaciones sobre la PUCV, con su contraevidencia</h3>
          <ListaAfirmaciones afirmaciones={claims} />
        </div>
      )}
    </div>
  );
}
