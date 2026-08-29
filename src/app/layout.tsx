import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Newsreader, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { ThemeProvider, themeInitScript } from '@/components/theme/ThemeProvider';
import { EvaProvider } from '@/components/eva/EvaProvider';
import { EvaGuide } from '@/components/eva/EvaGuide';
import { Ambience } from '@/components/common/Ambience';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { disclaimer, site } from '@/data/site';

/**
 * Tres familias con tres oficios distintos:
 *  - serif para títulos y prosa larga (registro editorial y académico);
 *  - grotesk para interfaz;
 *  - mono para metadatos, códigos y trazabilidad.
 * La mezcla es lo que separa «archivo constitucional» de «landing de producto».
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.subject} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Eduardo Aldunate Lizana',
    'Derecho constitucional',
    'interpretación jurídica',
    'lenguaje y Derecho',
    'inteligencia artificial y Derecho',
    'enseñanza del Derecho',
    'PUCV',
  ],
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.subject} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.subject} — ${site.tagline}`,
    description: site.description,
  },
  // Prototipo no oficial: mientras no haya autorización institucional, no se
  // busca posicionamiento. Un prototipo indexado se cita como si fuera fuente.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#050810' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CL"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Fija el tema antes del primer pintado. Sin esto, el modo claro
            parpadea en oscuro al cargar. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <EvaProvider>
            <a href="#contenido" className="skip-link">
              Saltar al contenido
            </a>

            <Ambience />

            {/* Franja de prototipo. Primera línea del documento, sin excepción. */}
            <div className="no-print border-b border-border/60 bg-muted/50">
              <p className="mono mx-auto max-w-6xl px-5 py-1.5 text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground sm:px-8">
                {disclaimer.short}
              </p>
            </div>

            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </main>
              <SiteFooter />
            </div>

            <EvaGuide />
          </EvaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
