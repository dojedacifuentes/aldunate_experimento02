'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, FlaskConical, Library, User, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { primaryNav, secondaryNav } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Barra de pestañas — la navegación inferior de iOS.
 *
 * Sustituye al menú de hamburguesa en pantallas estrechas, y la sustitución es
 * el punto: las cinco secciones estaban detrás de un botón que había que abrir
 * para saber qué contenía. Una barra de pestañas las enseña todas, dice en
 * cuál estás, y pone el destino donde el pulgar ya está. Es la razón por la
 * que las *Human Interface Guidelines* la reservan para las secciones
 * principales y no para acciones.
 *
 * Cinco es también el máximo que admite el patrón, y el sitio tiene
 * exactamente cinco secciones: tres primarias y dos de apoyo. Si algún día
 * hubiera una sexta, el patrón exige agrupar, no apretar.
 *
 * **Sobrevive al modo lectura a propósito.** Ese modo retira lo que existe
 * para la pantalla —reflejos, lienzos, barras de sección—, pero esto no es
 * decoración: es la única navegación de la ruta en un teléfono, y quitarla
 * dejaría al lector encerrado en la página. Lo que sí pierde es el vidrio,
 * porque de eso se encarga `globals.css`.
 */

/**
 * El icono es presentación, no contenido, así que vive aquí y no en
 * `src/data/site.ts`: añadir un icono no debería obligar a tocar la fuente
 * editorial de la navegación.
 */
const iconos: Record<string, LucideIcon> = {
  '/informes': FileText,
  '/experimentos': FlaskConical,
  '/laboratorio': Wrench,
  '/investigacion': Library,
  '/aldunate': User,
};

export function TabBar() {
  const pathname = usePathname();

  const entradas = [...primaryNav, ...secondaryNav];

  const esActiva = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Secciones del sitio"
      /*
       * `tabbar` aporta el respiro de la barra de gestos del teléfono
       * (`env(safe-area-inset-bottom)`) y el reservado del `<body>` para que
       * el pie de página no quede debajo. Las dos cosas están en globals.css,
       * porque `env()` no se puede expresar como utilidad de Tailwind.
       */
      className="tabbar no-print glass fixed inset-x-0 bottom-0 z-30 border-x-0 border-b-0 lg:hidden"
    >
      <ul className="mx-auto flex w-full max-w-lg items-stretch">
        {entradas.map((item) => {
          const Icono = iconos[item.href] ?? FileText;
          const activa = esActiva(item.href);

          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={activa ? 'page' : undefined}
                data-press
                className={cn(
                  'ui flex h-16 flex-col items-center justify-center gap-1 px-1',
                  'transition-colors',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                  activa ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {/*
                  El icono se rellena al estar activo, que es la señal que usa
                  iOS. Se hace con opacidad de fondo y no con un icono distinto:
                  dos siluetas diferentes para el mismo destino se leen como
                  dos destinos.
                */}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                    activa && 'bg-primary/12',
                  )}
                >
                  <Icono className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                </span>
                <span className="w-full truncate text-center text-[0.625rem] font-medium leading-none">
                  {/* «Lab IA + Derecho» no cabe en un quinto de pantalla. */}
                  {item.href === '/laboratorio' ? 'Lab' : item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
