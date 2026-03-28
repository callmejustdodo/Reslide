import { Notes } from '@reslide/core';
import { SlideLayout } from '@/components/slide-layout';
import { Title } from '@/components/title';
import { Subtitle } from '@/components/subtitle';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>Welcome to Reslide</Title>
      <Subtitle>Presentations as React Components</Subtitle>
      <Notes>Introduce Reslide — a modern framework for building slides with React.</Notes>
    </SlideLayout.Center>
  );
}
