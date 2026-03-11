import { SlideLayout, Title, Body, Code, Fragment } from '@reslide/core';

export default function Solution() {
  return (
    <SlideLayout.Default>
      <Title>The Solution: Slides as Code</Title>
      <Fragment>
        <Body>Each slide is a React component in its own file:</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Code language="tsx">{`// src/slides/01-intro.tsx
import { SlideLayout, Title } from '@reslide/core';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>Hello, World!</Title>
    </SlideLayout.Center>
  );
}`}</Code>
      </Fragment>
    </SlideLayout.Default>
  );
}
