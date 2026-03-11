import { intro, outro, text, select, confirm, spinner, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { scaffold } from './scaffold.js';

async function main() {
  const args = process.argv.slice(2);
  const projectArg = args[0];

  intro(pc.bgCyan(pc.black(' create-reslide ')));

  const projectName = projectArg ?? await text({
    message: 'Project name:',
    placeholder: 'my-deck',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (/[^a-zA-Z0-9-_]/.test(value)) return 'Only letters, numbers, hyphens, and underscores';
      return undefined;
    },
  });

  if (isCancel(projectName)) {
    outro('Cancelled');
    process.exit(0);
  }

  const theme = await select({
    message: 'Choose a theme:',
    options: [
      { value: 'default', label: 'Default', hint: 'Clean light theme' },
      { value: 'dark', label: 'Dark', hint: 'Dark background' },
      { value: 'minimal', label: 'Minimal', hint: 'Muted, minimal style' },
    ],
  });

  if (isCancel(theme)) {
    outro('Cancelled');
    process.exit(0);
  }

  const installSkills = await confirm({
    message: 'Install AI skills for Claude Code?',
    initialValue: true,
  });

  if (isCancel(installSkills)) {
    outro('Cancelled');
    process.exit(0);
  }

  const pm = await select({
    message: 'Package manager:',
    options: [
      { value: 'pnpm', label: 'pnpm' },
      { value: 'npm', label: 'npm' },
      { value: 'yarn', label: 'yarn' },
      { value: 'bun', label: 'bun' },
    ],
  });

  if (isCancel(pm)) {
    outro('Cancelled');
    process.exit(0);
  }

  const s = spinner();
  s.start('Creating project...');

  await scaffold({
    projectName: projectName as string,
    theme: theme as string,
    installSkills: installSkills as boolean,
    packageManager: pm as string,
  });

  s.stop('Project created!');

  outro(pc.green(`Done! Next steps:

  cd ${projectName as string}
  ${pm as string} install
  ${pm as string} run dev
`));
}

main().catch(console.error);
