import cac from 'cac';

const cli = cac('reslide');

cli
  .command('dev', 'Start development server')
  .option('--port <port>', 'Port number', { default: 5173 })
  .option('--host', 'Expose to network')
  .action(async (options: { port: number; host?: boolean }) => {
    const { createServer } = await import('vite');
    const react = (await import('@vitejs/plugin-react')).default;
    const { default: reslide } = await import('./vite/plugin.js');

    const server = await createServer({
      plugins: [react(), reslide()],
      server: {
        port: options.port,
        host: options.host,
      },
    });
    await server.listen();
    server.printUrls();
  });

cli
  .command('build', 'Build for production')
  .action(async () => {
    const { build } = await import('vite');
    const react = (await import('@vitejs/plugin-react')).default;
    const { default: reslide } = await import('./vite/plugin.js');

    await build({
      plugins: [react(), reslide()],
    });
  });

cli
  .command('preview', 'Preview production build')
  .option('--port <port>', 'Port number', { default: 4173 })
  .action(async (options: { port: number }) => {
    const { preview } = await import('vite');
    const react = (await import('@vitejs/plugin-react')).default;
    const { default: reslide } = await import('./vite/plugin.js');

    const server = await preview({
      plugins: [react(), reslide()],
      preview: { port: options.port },
    });
    server.printUrls();
  });

cli
  .command('export pdf', 'Export to PDF')
  .option('--output <path>', 'Output file path', { default: 'slides.pdf' })
  .option('--include-steps', 'Include fragment steps as separate pages')
  .action(async (options: { output: string; includeSteps?: boolean }) => {
    const { exportPdf } = await import('./commands/export.js');
    await exportPdf(options);
  });

cli
  .command('export pptx', 'Export to PowerPoint')
  .option('--output <path>', 'Output file path', { default: 'slides.pptx' })
  .option('--include-notes', 'Include speaker notes', { default: true })
  .option('--include-steps', 'Include fragment steps as separate slides')
  .action(async (options: { output: string; includeNotes?: boolean; includeSteps?: boolean }) => {
    const { exportPptx } = await import('./commands/export.js');
    await exportPptx(options);
  });

cli
  .command('export all', 'Export to all formats')
  .option('--include-steps', 'Include fragment steps')
  .action(async (options: { includeSteps?: boolean }) => {
    const { exportAll } = await import('./commands/export.js');
    await exportAll(options);
  });

cli.help();
cli.version('0.0.1');

cli.parse();
