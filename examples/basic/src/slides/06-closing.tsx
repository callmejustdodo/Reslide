import { Notes } from '@reslide/core';
import { SlideLayout } from '@/components/slide-layout';
import { Title } from '@/components/title';
import { Subtitle } from '@/components/subtitle';

export default function Closing() {
  return (
    <SlideLayout.Center>
      <Title>Get Started</Title>
      <Subtitle>npx create-reslide my-presentation</Subtitle>
      <Notes>Share the repo link and invite questions from the audience.</Notes>
    </SlideLayout.Center>
  );
}
