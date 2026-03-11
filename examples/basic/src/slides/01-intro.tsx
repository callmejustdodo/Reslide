import { SlideLayout, Title, Subtitle, Notes } from '@reslide/core';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>Welcome to Reslide</Title>
      <Subtitle>Presentations as React Components</Subtitle>
      <Notes>Introduce Reslide — a modern framework for building slides with React.</Notes>
    </SlideLayout.Center>
  );
}
