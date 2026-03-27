import { SlideLayout, Title, Subtitle, Notes } from '@reslide/core';

export default function Closing() {
  return (
    <SlideLayout.Center>
      <Title>Get Started</Title>
      <Subtitle>npx create-reslide my-presentation</Subtitle>
      <Notes>Share the repo link and invite questions from the audience.</Notes>
    </SlideLayout.Center>
  );
}
