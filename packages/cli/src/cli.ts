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

cli.help();
cli.version('0.0.1');

cli.parse();
