import { SlideLayout, Title, Body, Code } from '@reslide/core';

export default function HowItWorks() {
  return (
    <SlideLayout.Default>
      <Title>How It Works</Title>
      <Body>Create a slide by exporting a React component:</Body>
      <Code language="tsx">{`export default function MySlide() {
  return (
    <SlideLayout.Center>
      <Title>Hello World</Title>
    </SlideLayout.Center>
  );
}`}</Code>
    </SlideLayout.Default>
  );
}
