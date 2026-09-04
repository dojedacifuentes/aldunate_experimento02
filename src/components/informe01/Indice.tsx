import { Section } from '@/components/common/ui';

/**
 * Índice del Informe 01 en la web.
 *
 * El documento descargable deriva el suyo recorriendo sus propios encabezados,
 * porque allí el documento es un array de bloques y puede inspeccionarse. La web
 * es un árbol de componentes montado en varios archivos y no admite esa lectura,
 * de modo que aquí la lista se declara. Es la única duplicación de la cadena, y
 * la vigila una prueba: cada ancla de esta lista tiene que existir en la página.
 *
 * El orden es el del documento y no el de importancia. Un índice ordenado por
 * relevancia deja de ser un mapa y pasa a ser una opinión.
 */
export const INFORME_01_INDICE: readonly {
  readonly id: string;
  readonly label: string;
  readonly anexo?: boolean;
}[] = [
  { id: 'resumen', label: 'Resumen ejecutivo' },
  { id: 'hallazgos', label: 'Los siete hallazgos principales' },
  { id: 'introduccion', label: '1 · Introducción' },
  { id: 'objetivos', label: '2 · Objetivos' },
  { id: 'metodologia-relato', label: '3 · Metodología' },
  { id: 'panorama', label: 'Panorama del conjunto' },
  { id: 'cobertura', label: 'Cobertura de la investigación' },
  { id: 'capacidades', label: 'Capacidades institucionales comparadas' },
  { id: 'control', label: 'La comprobación que impide leer mal lo anterior' },
  { id: 'discusion', label: '4 · Discusión' },
  { id: 'pucv', label: '5 · La PUCV en contexto' },
  { id: 'conclusiones', label: '6 · Conclusiones' },
  { id: 'implicancias', label: '6 bis · Implicancias para la PUCV' },
  { id: 'limitaciones', label: '7 · Limitaciones' },
  { id: 'agenda', label: '8 · Agenda de investigación' },
  { id: 'metodologia', label: 'Nota metodológica', anexo: true },
  { id: 'anexos', label: 'Anexos y registro de fuentes', anexo: true },
  { id: 'fuentes', label: 'Registro completo de fuentes', anexo: true },
];

export function Informe01Indice() {
  const cuerpo = INFORME_01_INDICE.filter((e) => !e.anexo);
  const anexos = INFORME_01_INDICE.filter((e) => e.anexo);

  return (
    <Section id="indice" eyebrow="Índice" title="Qué hay en este informe">
      <nav aria-label="Índice del informe">
        {/*
          Dos columnas en pantalla ancha. Dieciocho entradas en una sola obligan
          a desplazarse para ver el mapa entero, que es lo que el índice existe
          para evitar.
        */}
        <ol className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {cuerpo.map((e, i) => (
            <li key={e.id} className="flex gap-3">
              <span className="mono pt-0.5 text-[0.6875rem] text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <a
                href={`#${e.id}`}
                className="text-sm leading-snug text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ol>

        <p className="meta mt-8 border-t border-border pt-5 text-primary">Anexos</p>
        <ol className="mt-3 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {anexos.map((e, i) => (
            <li key={e.id} className="flex gap-3">
              <span className="mono pt-0.5 text-[0.6875rem] text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <a
                href={`#${e.id}`}
                className="text-sm leading-snug text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Section>
  );
}
