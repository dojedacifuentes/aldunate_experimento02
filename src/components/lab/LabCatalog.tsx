'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

import { Badge, Surface } from '@/components/common/ui';
import { labCategories, statusMeta } from '@/data/lab';
import type { LabCategory, LabTool, ToolStatus } from '@/types';
import { cn, formatDateCompact } from '@/lib/utils';

/**
 * Catálogo filtrable del laboratorio.
 *
 * Los filtros solo ofrecen categorías que tienen al menos una ficha: un menú
 * lleno de opciones que devuelven cero resultados es una promesa incumplida
 * repetida diez veces.
 */
export function LabCatalog({ tools }: { tools: LabTool[] }) {
  const [category, setCategory] = useState<LabCategory | 'todas'>('todas');
  const [status, setStatus] = useState<ToolStatus | 'todos'>('todos');

  const availableCategories = useMemo(
    () => labCategories.filter((c) => tools.some((t) => t.category === c.id)),
    [tools],
  );

  const availableStatuses = useMemo(
    () =>
      (Object.keys(statusMeta) as ToolStatus[]).filter((s) =>
        tools.some((t) => t.status === s),
      ),
    [tools],
  );

  const filtered = useMemo(
    () =>
      tools.filter(
        (t) =>
          (category === 'todas' || t.category === category) &&
          (status === 'todos' || t.status === status),
      ),
    [tools, category, status],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <FilterGroup label="Categoría">
          <Chip active={category === 'todas'} onClick={() => setCategory('todas')}>
            Todas
          </Chip>
          {availableCategories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="Estado">
          <Chip active={status === 'todos'} onClick={() => setStatus('todos')}>
            Todos
          </Chip>
          {availableStatuses.map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
              {statusMeta[s].label}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      <p aria-live="polite" className="mono text-[0.75rem] text-muted-foreground">
        {filtered.length} de {tools.length}{' '}
        {tools.length === 1 ? 'ficha' : 'fichas'}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          Ninguna ficha coincide con esa combinación.
        </p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {filtered.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="meta mr-1 w-full sm:w-auto">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-[0.8125rem] transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

/**
 * Ficha de herramienta. Entradas, salidas y —sobre todo— límites. La sección
 * de límites no se pliega ni se abrevia: es la parte que evita que un prototipo
 * se use como si fuera un producto.
 */
function ToolCard({ tool }: { tool: LabTool }) {
  const meta = statusMeta[tool.status];
  const categoryLabel =
    labCategories.find((c) => c.id === tool.category)?.label ?? tool.category;

  return (
    <Surface interactive className="flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge tone={meta.tone} dot>
          {meta.label}
        </Badge>
        <span className="mono text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
          {categoryLabel}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl text-foreground">{tool.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{tool.summary}</p>

      <dl className="mt-5 space-y-3 border-t border-border/60 pt-4 text-[0.8125rem]">
        <div>
          <dt className="meta mb-1">Entra</dt>
          <dd className="text-foreground/80">{tool.inputs.join(' · ')}</dd>
        </div>
        <div>
          <dt className="meta mb-1">Sale</dt>
          <dd className="text-foreground/80">{tool.outputs.join(' · ')}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md border-l-2 border-l-warning bg-warning/[0.06] px-3.5 py-3">
        <p className="meta mb-1.5 text-warning">No hace</p>
        <ul className="space-y-1 text-[0.8125rem] leading-relaxed text-foreground/75">
          {tool.limitations.map((lim) => (
            <li key={lim}>· {lim}</li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="mono text-[0.6875rem] text-muted-foreground">
          madurez: {tool.maturity} · {formatDateCompact(tool.updatedAt)}
        </span>
        <span className="flex items-center gap-3">
          {tool.demoUrl && (
            <a
              href={tool.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Demo
            </a>
          )}
          {tool.repoUrl && (
            <a
              href={tool.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-primary hover:underline"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              Código
            </a>
          )}
        </span>
      </div>
    </Surface>
  );
}
