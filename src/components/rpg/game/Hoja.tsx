/**
 * Pantalla de una sola columna dentro de la cabina.
 *
 * Dos zonas: cuerpo desplazable y barra de acciones. El scroll, cuando hace
 * falta, es del cuerpo y de nadie más; la acción principal vive fuera de él, de
 * modo que nunca hay que recorrer un texto para encontrar el botón que lo
 * cierra.
 *
 * Vive en su propio módulo para que las pantallas que lo usan no tengan que
 * importar `GameShell`, que a su vez las importa a ellas.
 */
export function Hoja({
  children,
  acciones,
}: {
  children: React.ReactNode;
  acciones?: React.ReactNode;
}) {
  return (
    <div className="audaces-hoja">
      <div className="audaces-hoja-cuerpo">{children}</div>
      {acciones && <div className="audaces-acciones">{acciones}</div>}
    </div>
  );
}
