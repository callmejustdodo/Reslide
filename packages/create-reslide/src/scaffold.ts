import fs from 'fs-extra';
import path from 'node:path';

interface ScaffoldOptions {
  projectName: string;
  theme: string;
  installSkills: boolean;
  packageManager: string;
}

export async function scaffold(options: ScaffoldOptions) {
  const { projectName, theme, installSkills } = options;
  const root = path.resolve(process.cwd(), projectName);

  await fs.ensureDir(root);
  await fs.ensureDir(path.join(root, 'src', 'slides'));
  await fs.ensureDir(path.join(root, 'src', 'lib'));
  await fs.ensureDir(path.join(root, 'public'));

  // package.json
  await fs.writeJSON(path.join(root, 'package.json'), {
    name: projectName,
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'reslide dev',
      build: 'reslide build',
      preview: 'reslide preview',
      'export:pdf': 'reslide export pdf',
      'export:pptx': 'reslide export pptx',
    },
    dependencies: {
      '@reslide/cli': '^0.0.1',
      '@reslide/core': '^0.0.1',
      react: '^18.3.0',
      'react-dom': '^18.3.0',
    },
    devDependencies: {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.3.0',
      typescript: '^5.7.0',
      vite: '^6.0.0',
    },
  }, { spaces: 2 });

  // tsconfig.json
  await fs.writeJSON(path.join(root, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      jsx: 'react-jsx',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['src'],
  }, { spaces: 2 });

  // vite.config.ts
  await fs.writeFile(path.join(root, 'vite.config.ts'), `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reslide from '@reslide/cli/vite';

export default defineConfig({
  plugins: [react(), reslide()],
  resolve: {
    alias: { '@': '/src' },
  },
});
`);

  // reslide.config.ts
  const themeImport = theme === 'default' ? '' : `\nimport { ${theme}Theme } from '@reslide/core';`;
  const themeConfig = theme === 'default' ? '' : `\n  theme: ${theme}Theme,`;
  await fs.writeFile(path.join(root, 'reslide.config.ts'), `import { defineConfig } from '@reslide/core';${themeImport}

export default defineConfig({${themeConfig}
  transition: { type: 'fade', duration: 400 },
});
`);

  // index.html
  await fs.writeFile(path.join(root, 'index.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  // src/main.tsx
  await fs.writeFile(path.join(root, 'src', 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Deck } from '@reslide/core';
import { slides } from 'virtual:reslide/slides';
import config from 'virtual:reslide/config';

createRoot(document.getElementById('root')!).render(
  <Deck slides={slides} config={config} />,
);
`);

  // src/env.d.ts
  await fs.writeFile(path.join(root, 'src', 'env.d.ts'), `/// <reference types="@reslide/cli/client" />
`);

  // src/lib/utils.ts
  await fs.writeFile(path.join(root, 'src', 'lib', 'utils.ts'), `import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
`);

  // Starter slides
  await fs.writeFile(path.join(root, 'src', 'slides', '01-intro.tsx'), `import { SlideLayout, Title, Subtitle } from '@reslide/core';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>Welcome</Title>
      <Subtitle>Built with Reslide</Subtitle>
    </SlideLayout.Center>
  );
}
`);

  await fs.writeFile(path.join(root, 'src', 'slides', '02-content.tsx'), `import { SlideLayout, Title, Fragment, Body } from '@reslide/core';

export default function Content() {
  return (
    <SlideLayout.Default>
      <Title>Key Points</Title>
      <Fragment><Body>React components for slides</Body></Fragment>
      <Fragment><Body>File-based routing</Body></Fragment>
      <Fragment><Body>Export to PDF and PPTX</Body></Fragment>
    </SlideLayout.Default>
  );
}
`);

  await fs.writeFile(path.join(root, 'src', 'slides', '03-closing.tsx'), `import { SlideLayout, Title, Body, Notes } from '@reslide/core';

export default function Closing() {
  return (
    <SlideLayout.Center>
      <Title>Thank You!</Title>
      <Body>Questions?</Body>
      <Notes>Open the floor for Q&amp;A.</Notes>
    </SlideLayout.Center>
  );
}
`);

  // .gitignore
  await fs.writeFile(path.join(root, '.gitignore'), `node_modules/
dist/
*.tsbuildinfo
.DS_Store
`);

  // AI skills
  if (installSkills) {
    const skillsDir = path.join(root, '.claude', 'skills', 'reslide');
    await fs.ensureDir(skillsDir);
    await fs.writeFile(path.join(skillsDir, 'SKILL.md'), `---
name: reslide
description: Create presentations with Reslide React framework
metadata:
  tags: react, slides, presentations
---

# Reslide

Create presentations using React components with file-based slide routing.

## Quick Reference

- Slides go in \`src/slides/\` as TSX files
- Use \`SlideLayout.Center\`, \`SlideLayout.Default\`, etc. for layouts
- Use \`Fragment\` for step-based reveal animations
- Use \`Notes\` for speaker notes
- Run \`reslide dev\` to preview, \`reslide export pdf\` to export
`);
  }
}
