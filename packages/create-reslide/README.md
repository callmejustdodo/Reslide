# create-reslide

Scaffold a new Reslide presentation project.

## Usage

```bash
npx create-reslide my-presentation
```

## Interactive Prompts

The CLI asks for:

1. **Project name** — directory name for your project
2. **Theme** — default, dark, or minimal
3. **AI Skills** — install Claude Code skills for AI-assisted slide creation
4. **Package manager** — npm, pnpm, or yarn

## What It Creates

```
my-presentation/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── reslide.config.ts
├── tailwind.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── lib/utils.ts
│   └── slides/
│       ├── 01-intro.tsx
│       ├── 02-content.tsx
│       └── 03-closing.tsx
└── .claude/                    # If AI skills selected
    └── skills/reslide/
```

## After Scaffolding

```bash
cd my-presentation
npm install
npm run dev
```

Open `http://localhost:5173` to see your presentation.

## License

MIT
