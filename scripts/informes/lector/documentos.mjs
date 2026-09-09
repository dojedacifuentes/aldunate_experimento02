/**
 * Qué documentos llevan capa de lectura en pantalla.
 *
 * Vive aparte del constructor para que lo lean los dos que lo necesitan: el
 * propio constructor y la prueba que comprueba que lo publicado la lleva.
 *
 * **Sólo entra aquí lo que se está publicando.** Las versiones históricas no
 * se reconstruyen: una versión publicada no se sobrescribe (§8 de CLAUDE.md),
 * y volver a generar la v0.7.0 con la capa de hoy cambiaría un archivo que
 * alguien pudo citar. Se quedan como se publicaron.
 */
export const DOCUMENTOS = [
  {
    fuente:
      'content/reports/01_ia_escuelas_derecho_chile/entregas/v3.2.0/informe-01-v3.2.0.html',
    destino: 'public/descargas/informe-01-v3.2.0/informe-01-v3.2.0.html',
    marca: 'Informe 01',
    título:
      'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
    sub: 'v3.2.0 · corte 06-09-2026',
    pie: 'Prototipo académico experimental.<br>No es un sitio oficial de la PUCV.',
  },
  {
    /* El complemento no cambia de contenido en esta versión —la declaración de
       intereses y el perfil de la institución apartada se conservan intactos—,
       pero viaja con ella: cada entrega lleva sus dos documentos juntos, y un
       complemento que apunta a una versión del informe que ya no es la vigente
       obliga al lector a cruzar dos carpetas. */
    fuente:
      'content/reports/01_ia_escuelas_derecho_chile/entregas/v3.2.0/complemento-pucv-v1.2.html',
    destino: 'public/descargas/informe-01-v3.2.0/complemento-pucv-v1.2.html',
    marca: 'Informe 01 · complemento',
    título: 'La PUCV como caso de proyección, no como caso comparado',
    sub: 'v1.2 · corte 06-09-2026',
    pie: 'Documento complementario. No sustituye al Informe 01.<br>No es un sitio oficial de la PUCV.',
  },
];
