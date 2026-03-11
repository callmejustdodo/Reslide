import path from 'node:path';
import pc from 'picocolors';

interface ExportOptions {
  output?: string;
  includeSteps?: boolean;
  includeNotes?: boolean;
  port?: number;
}

async function buildAndServe(port: number) {
  const { build, preview } = await import('vite');
  const react = (await import('@vitejs/plugin-react')).default;
  const { default: reslide } = await import('../vite/plugin.js');

  await build({
    plugins: [react(), reslide()],
    logLevel: 'warn',
  });

  const server = await preview({
    plugins: [react(), reslide()],
    preview: { port, strictPort: true },
  });

  const address = server.resolvedUrls?.local?.[0] ?? `http://localhost:${port}`;
  return { server, url: address };
}

export async function exportPdf(options: ExportOptions) {
  const port = options.port ?? 4567;
  console.log(pc.cyan('Building for export...'));

  const { server, url } = await buildAndServe(port);

  try {
    console.log(pc.cyan('Exporting PDF...'));
    const { exportPdf } = await import('@reslide/export-pdf');
    const output = options.output ?? 'slides.pdf';
    await exportPdf({
      url,
      output: path.resolve(output),
      includeSteps: options.includeSteps,
    });
    console.log(pc.green(`PDF exported to ${output}`));
  } finally {
    // Close preview server
    await server.close();
  }
}

export async function exportPptx(options: ExportOptions) {
  const port = options.port ?? 4567;
  console.log(pc.cyan('Building for export...'));

  const { server, url } = await buildAndServe(port);

  try {
    console.log(pc.cyan('Exporting PPTX...'));
    const { exportPptx } = await import('@reslide/export-pptx');
    const output = options.output ?? 'slides.pptx';
    await exportPptx({
      url,
      output: path.resolve(output),
      includeNotes: options.includeNotes ?? true,
      includeSteps: options.includeSteps,
    });
    console.log(pc.green(`PPTX exported to ${output}`));
  } finally {
    await server.close();
  }
}

export async function exportAll(options: ExportOptions) {
  const port = options.port ?? 4567;
  console.log(pc.cyan('Building for export...'));

  const { server, url } = await buildAndServe(port);

  try {
    console.log(pc.cyan('Exporting PDF...'));
    const { exportPdf } = await import('@reslide/export-pdf');
    await exportPdf({
      url,
      output: path.resolve(options.output ?? 'slides.pdf'),
      includeSteps: options.includeSteps,
    });
    console.log(pc.green('PDF exported'));

    console.log(pc.cyan('Exporting PPTX...'));
    const { exportPptx } = await import('@reslide/export-pptx');
    await exportPptx({
      url,
      output: path.resolve('slides.pptx'),
      includeNotes: options.includeNotes ?? true,
      includeSteps: options.includeSteps,
    });
    console.log(pc.green('PPTX exported'));
  } finally {
    await server.close();
  }
}
