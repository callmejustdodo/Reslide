import { SlideLayout, Title, Subtitle } from '@reslide/core';

export const meta = {
  transition: { type: 'zoom' as const, duration: 500 },
};

export default function TitleSlide() {
  return (
    <SlideLayout.Center>
      <Title>Animations in Reslide</Title>
      <Subtitle>Fragments, transitions, and step-based reveals</Subtitle>
    </SlideLayout.Center>
  );
}
