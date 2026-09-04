import { Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import { coberturaSvg } from '@/lib/informe01-graficos';
import { coberturaDe, universidadesOrdenadas } from '@/lib/informe01';

import { Figura } from './Figura';

/**
 * Cobertura de investigación: cuánto se investigó cada institución.
 *
 * Es el gráfico que impide leer mal todos los demás, y por eso va antes que
 * ninguna comparación. Mide trabajo de campo —cuántas de las trece rutas del
 * protocolo se recorrieron y qué proporción de sus fuentes se contrastó— y no
 * actividad institucional.
 *
 * Desde la versión 0.7.0 no carga solo con esa advertencia: la separación entre
 * cobertura y capacidad está además dentro de cada celda de la matriz, en la
 * distinción entre «no localizada» y «no concluyente». Aquí se publica el
 * denominador; allí se aplica.
 */
export function CoberturaInvestigacion() {
  const r = informe01Recuento;
  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Cifra
          valor={`${r.coberturaPiloto} · ${r.coberturaResto}`}
          etiqueta="fuentes de media, piloto frente a las otras ocho"
          detalle={`Razón de ${r.razonCobertura} a 1`}
        />
        <Cifra
          valor={`${r.rutasPiloto} · ${r.rutasResto}`}
          etiqueta="rutas del protocolo recorridas, de trece"
          detalle="Piloto frente al resto"
        />
        <Cifra
          valor={`${Math.round((r.fuentesVerificadas / r.fuentes) * 100)} %`}
          etiqueta="de las fuentes con verificación sustantiva"
          detalle={`${r.fuentesVerificadas} de ${r.fuentes}, y el reparto tampoco es uniforme`}
        />
      </div>

      <Figura
        ancha
        pregunta="¿Con qué profundidad se investigó cada institución?"
        titulo="El trabajo de campo es desigual por diseño, y su reparto condiciona todo lo demás"
        svg={coberturaSvg()}
        nota={
          <>
            Las dos cifras de la derecha miden nuestro trabajo, no el de la institución. El
            piloto de profundidad son tres universidades observadas con más detalle; se conserva
            como profundidad y no como universo. La ruta 13 —fuentes externas de contraste—
            está sin recorrer en las once, de modo que el corpus hereda íntegro el sesgo de
            autodescripción: mide lo que las instituciones cuentan de sí mismas, y eso no se
            corrige agregando más fuentes del mismo tipo.
          </>
        }
        alternativa={
          <ul className="space-y-2">
            {universidadesOrdenadas.map((u) => {
              const c = coberturaDe(u.id);
              if (!c) return null;
              return (
                <li key={u.id} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                  <span className="text-foreground">{u.officialName}</span> ·{' '}
                  {c.routesCompleted} de {c.routesTotal} rutas · {c.sources} fuentes ·{' '}
                  {c.substantivelyVerifiedSources} contrastadas
                  {c.inPilot && ' · piloto de profundidad'}. Rutas sin recorrer:{' '}
                  {c.routesMissing.join(', ')}.
                </li>
              );
            })}
          </ul>
        }
      />

      <Notice tone="warning">
        La verificación tiene su propio sesgo, y es de segundo orden. La PUCV llega al 86 % de
        sus fuentes contrastadas y la Universidad Autónoma al 0 %, de modo que la institución
        sobre la que este informe debe ser más cuidadoso es también la mejor comprobada. Por eso
        la marca de verificación de la matriz de capacidades se dibuja aparte del estado y nunca
        lo modifica: si entrara en el estado, la desigualdad del trabajo de campo se leería como
        una diferencia entre Facultades.
      </Notice>
    </div>
  );
}

function Cifra({
  valor,
  etiqueta,
  detalle,
}: {
  valor: string;
  etiqueta: string;
  detalle: string;
}) {
  return (
    <Surface className="p-5">
      <p className="mono text-2xl leading-none text-foreground">{valor}</p>
      <p className="mt-2 text-sm leading-snug text-foreground/85">{etiqueta}</p>
      <p className="mt-1 text-[0.75rem] leading-snug text-muted-foreground">{detalle}</p>
    </Surface>
  );
}
