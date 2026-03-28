import { SlideLayout } from '@/components/slide-layout';
import { Title } from '@/components/title';
import { Body } from '@/components/body';
import { Code } from '@/components/code';

export default function Theming() {
  return (
    <SlideLayout.Default>
      <Title>Theming</Title>
      <Body>Customize colors, fonts, and more with createTheme:</Body>
      <Code language="ts">{`import { defineConfig, createTheme } from '@reslide/core';

export default defineConfig({
  theme: createTheme({
    colors: { primary: '#e11d48', background: '#0a0a0a' },
    fonts: { heading: "'Cal Sans', sans-serif" },
  }),
});`}</Code>
    </SlideLayout.Default>
  );
}
