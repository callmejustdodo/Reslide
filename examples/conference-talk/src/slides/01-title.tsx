import { SlideLayout, Title, Subtitle, Notes } from '@reslide/core';

export default function TitleSlide() {
  return (
    <SlideLayout.Center>
      <Title>Building Presentations with React</Title>
      <Subtitle>A deep dive into Reslide</Subtitle>
      <Notes>
        Welcome everyone. Today I want to show you a new way to build
        presentations using React components instead of drag-and-drop tools.
      </Notes>
    </SlideLayout.Center>
  );
}

export const meta = {
  transition: { type: 'fade' as const, duration: 600 },
};
