import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = path.resolve(process.argv[2] || process.cwd());
const sourceDir = path.join(
  projectRoot,
  'content',
  'reports',
  '01_ia_escuelas_derecho_chile',
  'canonical',
);
const outputDir = path.join(
  projectRoot,
  'public',
  'descargas',
  'informe-01-kit-canonico-v1.0.0',
);
const sourcePath = path.join(sourceDir, 'kit-canonico-v1.0.0.md');
const manifestPath = path.join(sourceDir, 'manifest.json');

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function inline(value) {
  let rendered = escapeHtml(value);
  rendered = rendered.replace(/`([^`]+)`/g, '<code>$1</code>');
  rendered = rendered.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  rendered = rendered.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  return rendered;
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const headings = [];
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      flushParagraph();
      closeList();
      if (inCode) {
        output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      flushParagraph();
      closeList();
      const headers = parseTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }
      i -= 1;
      output.push('<div class="table-wrap"><table><thead><tr>');
      headers.forEach((cell) => output.push(`<th scope="col">${inline(cell)}</th>`));
      output.push('</tr></thead><tbody>');
      rows.forEach((row) => {
        output.push('<tr>');
        row.forEach((cell) => output.push(`<td>${inline(cell)}</td>`));
        output.push('</tr>');
      });
      output.push('</tbody></table></div>');
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
      output.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      closeList();
      output.push('<hr>');
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      closeList();
      output.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }

    const unordered = line.match(/^\s*-\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const desired = ordered ? 'ol' : 'ul';
      if (listType && listType !== desired) closeList();
      if (!listType) {
        listType = desired;
        output.push(`<${listType}>`);
      }
      const item = (ordered || unordered)[1];
      const checklist = item.match(/^\[([ xX])\]\s+(.+)$/);
      if (checklist) {
        const checked = checklist[1].toLowerCase() === 'x';
        output.push(
          `<li class="check-item"><span aria-hidden="true" class="check-box">${checked ? '✓' : ''}</span>${inline(checklist[2])}</li>`,
        );
      } else {
        output.push(`<li>${inline(item)}</li>`);
      }
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      closeList();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  closeList();
  return { html: output.join('\n'), headings };
}

const markdown = await readFile(sourcePath, 'utf8');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const contentStart = markdown.indexOf('## Capa 1');
const bodyMarkdown = contentStart >= 0 ? markdown.slice(contentStart) : markdown;
const rendered = renderMarkdown(bodyMarkdown);
const toc = rendered.headings
  .filter(({ level }) => level === 2 || level === 3)
  .map(
    ({ level, text, id }) =>
      `<li class="toc-${level}"><a href="#${id}">${escapeHtml(text)}</a></li>`,
  )
  .join('\n');

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="author" content="${escapeHtml(manifest.responsible)}">
  <meta name="description" content="Protocolo canónico y experiencia de investigación inter-IA para una cohorte histórica de Facultades de Derecho chilenas.">
  <title>${escapeHtml(manifest.title)} · v${manifest.version}</title>
  <style>
    :root { --blue:#29588c; --burgundy:#8a2432; --gold:#b78c30; --ink:#191713; --muted:#685f52; --paper:#faf8f3; --card:#fff; --rule:#ddd5c6; --soft:#f1ece2; }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; color:var(--ink); background:var(--paper); font:16px/1.65 Arial, Helvetica, sans-serif; }
    a { color:var(--blue); text-underline-offset:3px; }
    a:focus-visible { outline:3px solid var(--gold); outline-offset:3px; }
    .skip { position:absolute; left:1rem; top:-4rem; background:#fff; border:2px solid var(--blue); padding:.6rem 1rem; z-index:10; }
    .skip:focus { top:1rem; }
    .topbar { background:var(--ink); color:#fff; padding:.55rem 1rem; text-align:center; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; }
    .cover { min-height:88vh; display:flex; align-items:center; border-bottom:6px solid var(--blue); background:linear-gradient(135deg,#fff 0%,#f6f1e7 72%,#e9eff6 100%); }
    .cover-inner { width:min(1040px,calc(100% - 2.5rem)); margin:auto; padding:4rem 0; }
    .kicker { color:var(--blue); font-weight:700; letter-spacing:.12em; text-transform:uppercase; font-size:.78rem; }
    h1,h2,h3,h4 { font-family:Georgia,'Times New Roman',serif; font-weight:500; line-height:1.18; color:var(--ink); }
    h1 { max-width:850px; font-size:clamp(2.5rem,6vw,4.8rem); margin:.7rem 0 1rem; }
    .subtitle { max-width:760px; color:var(--muted); font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.15rem,2.3vw,1.55rem); }
    .meta-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:1px; background:var(--rule); border:1px solid var(--rule); margin:2.5rem 0 1.5rem; }
    .meta-item { background:rgba(255,255,255,.9); padding:1rem; }
    .meta-label { display:block; color:var(--muted); font-size:.7rem; text-transform:uppercase; letter-spacing:.1em; }
    .meta-value { display:block; margin-top:.3rem; font-weight:700; }
    .notice { max-width:780px; border-left:4px solid var(--burgundy); background:#fff8f3; padding:1rem 1.25rem; }
    .downloads { display:flex; flex-wrap:wrap; gap:.6rem; margin-top:1.5rem; }
    .downloads a { display:inline-block; text-decoration:none; border:1px solid var(--blue); border-radius:6px; padding:.55rem .85rem; font-weight:700; background:#fff; }
    .downloads a:first-child { color:#fff; background:var(--blue); }
    .layout { width:min(1120px,calc(100% - 2rem)); margin:0 auto; display:grid; grid-template-columns:260px minmax(0,760px); gap:3rem; align-items:start; padding:3rem 0 6rem; }
    nav { position:sticky; top:1.5rem; max-height:calc(100vh - 3rem); overflow:auto; padding:1.2rem; background:rgba(255,255,255,.82); border:1px solid var(--rule); border-radius:8px; }
    nav h2 { font:700 .72rem/1.2 Arial,sans-serif; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:0 0 .8rem; }
    nav ol { list-style:none; margin:0; padding:0; }
    nav li { margin:.2rem 0; line-height:1.3; }
    nav a { text-decoration:none; font-size:.78rem; }
    nav .toc-3 { padding-left:.75rem; }
    main { min-width:0; }
    main h2 { margin:3.2rem 0 1rem; padding-top:.5rem; padding-bottom:.5rem; border-bottom:2px solid var(--blue); font-size:2rem; }
    main h2:first-child { margin-top:0; }
    main h3 { margin:2.2rem 0 .65rem; font-size:1.38rem; }
    main h4 { margin:1.6rem 0 .5rem; font-size:1.12rem; color:var(--burgundy); }
    main p, main li { max-width:72ch; }
    main ul, main ol { padding-left:1.35rem; }
    main li { margin:.35rem 0; }
    blockquote { margin:1.5rem 0; border-left:4px solid var(--blue); background:#eef4f9; padding:1rem 1.25rem; font-family:Georgia,'Times New Roman',serif; font-size:1.1rem; }
    code { background:var(--soft); padding:.12rem .35rem; border-radius:4px; font: .9em Consolas,'Courier New',monospace; }
    pre { overflow:auto; background:#20252b; color:#f5f7f8; padding:1rem; border-radius:7px; line-height:1.45; }
    pre code { background:transparent; color:inherit; padding:0; }
    .table-wrap { overflow-x:auto; margin:1.3rem 0; border:1px solid var(--rule); border-radius:7px; }
    table { width:100%; border-collapse:collapse; background:#fff; font-size:.89rem; }
    th,td { padding:.68rem .75rem; text-align:left; vertical-align:top; border-bottom:1px solid var(--rule); }
    th { background:#eaf0f6; color:#1f456c; }
    tr:last-child td { border-bottom:0; }
    hr { border:0; height:1px; background:var(--rule); margin:3rem 0; }
    .check-item { list-style:none; margin-left:-1.3rem; display:flex; gap:.5rem; }
    .check-box { flex:0 0 1rem; height:1rem; margin-top:.3rem; border:1px solid var(--muted); display:inline-flex; align-items:center; justify-content:center; font-size:.7rem; }
    footer { border-top:1px solid var(--rule); padding:2rem 1rem; color:var(--muted); text-align:center; font-size:.8rem; }
    @media (max-width:860px) { .layout { grid-template-columns:1fr; } nav { position:relative; top:auto; max-height:360px; } .cover { min-height:auto; } }
    @media print {
      @page { size:A4; margin:18mm 17mm 20mm; }
      body { background:#fff; font-size:10.5pt; }
      .topbar,.downloads,.skip,nav { display:none !important; }
      .cover { min-height:240mm; page-break-after:always; border-bottom:4pt solid var(--blue); }
      .cover-inner,.layout { width:100%; padding:0; margin:0; display:block; }
      main h2 { page-break-before:always; }
      main h2:first-child { page-break-before:auto; }
      h2,h3,h4 { page-break-after:avoid; }
      table,blockquote,pre { page-break-inside:avoid; }
      a { color:inherit; text-decoration:none; }
      footer { display:none; }
    }
  </style>
</head>
<body>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <div class="topbar">Prototipo académico experimental · Documento de trabajo no oficial PUCV</div>
  <header class="cover">
    <div class="cover-inner">
      <div class="kicker">Informe 01 · Sistema metodológico</div>
      <h1>${escapeHtml(manifest.title)}</h1>
      <p class="subtitle">${escapeHtml(manifest.subtitle)}</p>
      <div class="meta-grid">
        <div class="meta-item"><span class="meta-label">Versión</span><span class="meta-value">v${escapeHtml(manifest.version)}</span></div>
        <div class="meta-item"><span class="meta-label">Fecha de corte</span><span class="meta-value">1 de septiembre de 2026</span></div>
        <div class="meta-item"><span class="meta-label">Publicado</span><span class="meta-value">2 de septiembre de 2026</span></div>
        <div class="meta-item"><span class="meta-label">Cohorte</span><span class="meta-value">11 instituciones</span></div>
        <div class="meta-item"><span class="meta-label">Estado</span><span class="meta-value">Protocolo operativo</span></div>
      </div>
      <p class="notice"><strong>Alcance.</strong> Este kit no contiene resultados sobre universidades. Define cómo producirlos, verificarlos, comunicarlos y actualizarlos sin perder continuidad.</p>
      <div class="downloads" aria-label="Descargas alternativas">
        <a href="kit-canonico-v1.0.0.pdf">PDF</a>
        <a href="kit-canonico-v1.0.0.docx">Word</a>
        <a href="kit-canonico-v1.0.0.md">Markdown</a>
        <a href="../informe-01-kit-canonico-v1.0.0.zip">Paquete ZIP</a>
      </div>
    </div>
  </header>
  <div class="layout">
    <nav aria-label="Índice del documento">
      <h2>Contenido</h2>
      <ol>${toc}</ol>
    </nav>
    <main id="contenido">${rendered.html}</main>
  </div>
  <footer>
    ${escapeHtml(manifest.title)} · v${escapeHtml(manifest.version)} · ${escapeHtml(manifest.responsible)} · Documento de trabajo no oficial
  </footer>
</body>
</html>`;

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'kit-canonico-v1.0.0.html'), html, 'utf8');
const wordToc = `<section class="document-toc"><h2>Contenido</h2><ol>${toc}</ol></section>`;
const wordHtml = html
  .replace(/<a class="skip"[\s\S]*?<\/a>/, '')
  .replace(/<div class="topbar">[\s\S]*?<\/div>/, '')
  .replace(/<div class="downloads"[\s\S]*?<\/div>/, '')
  .replace(/<nav aria-label="Índice del documento">[\s\S]*?<\/nav>/, '')
  .replace('<main id="contenido">', `${wordToc}<main id="contenido">`)
  .replace(
    '</head>',
    '<style>.layout{display:block;width:100%;padding:0}.document-toc{page-break-after:always}.document-toc ol{columns:2;column-gap:2rem}.document-toc li{break-inside:avoid;margin:.35rem 0}.document-toc a{text-decoration:none}</style></head>',
  );
await writeFile(path.join(outputDir, 'kit-canonico-v1.0.0-word.html'), wordHtml, 'utf8');
await copyFile(sourcePath, path.join(outputDir, 'kit-canonico-v1.0.0.md'));
await copyFile(manifestPath, path.join(outputDir, 'manifest.json'));

const templateSource = path.join(sourceDir, 'templates');
const templateOutput = path.join(outputDir, 'plantillas');
await mkdir(templateOutput, { recursive: true });
for (const filename of await readdir(templateSource)) {
  const source = path.join(templateSource, filename);
  if ((await stat(source)).isFile()) await copyFile(source, path.join(templateOutput, filename));
}

const generatedFiles = [
  'kit-canonico-v1.0.0.html',
  'kit-canonico-v1.0.0.md',
  'manifest.json',
];
const checksums = [];
for (const filename of generatedFiles) {
  const bytes = await readFile(path.join(outputDir, filename));
  checksums.push(`${createHash('sha256').update(bytes).digest('hex')}  ${filename}`);
}
await writeFile(path.join(outputDir, 'checksums-source.sha256'), `${checksums.join('\n')}\n`, 'utf8');

console.log(`Rendered canonical kit to ${outputDir}`);
