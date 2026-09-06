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
      'content/reports/01_ia_escuelas_derecho_chile/entregas/v2.0.0/informe-01-v2.0.0.html',
    destino: 'public/descargas/informe-01-v2.0.0/informe-01-v2.0.0.html',
    marca: 'Informe 01',
    título:
      'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
    sub: 'v2.0.0 · corte 06-09-2026',
    pie: 'Prototipo académico experimental.<br>No es un sitio oficial de la PUCV.',
  },
  {
    fuente:
      'content/reports/01_ia_escuelas_derecho_chile/entregas/v2.0.0/complemento-pucv-v1.0.html',
    destino: 'public/descargas/informe-01-v2.0.0/complemento-pucv-v1.0.html',
    marca: 'Informe 01 · complemento',
    título: 'La PUCV como caso de proyección, no como caso comparado',
    sub: 'v1.0 · corte 06-09-2026',
    pie: 'Documento complementario. No sustituye al Informe 01.<br>No es un sitio oficial de la PUCV.',
  },
];
