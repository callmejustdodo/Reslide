import { SlideLayout, Title, Subtitle, Body, Fragment, Notes } from '@reslide/core';

export default function Closing() {
  return (
    <SlideLayout.Center>
      <Title>Get Started Today</Title>
      <Fragment animation="fadeIn">
        <Subtitle>npx create-reslide my-talk</Subtitle>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>github.com/reslide/reslide</Body>
      </Fragment>
      <Notes>
        Thank you for listening! The project is open source.
        Contributions welcome. Happy to take questions.
      </Notes>
    </SlideLayout.Center>
  );
}
