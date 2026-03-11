import { SlideLayout, Title, Body, Fragment } from '@reslide/core';

export default function FlyInDemo() {
  return (
    <SlideLayout.Default>
      <Title>Fly In Animation</Title>
      <Fragment animation="flyIn" direction="left">
        <Body>Flies in from the left</Body>
      </Fragment>
      <Fragment animation="flyIn" direction="right">
        <Body>Flies in from the right</Body>
      </Fragment>
      <Fragment animation="flyIn" direction="up">
        <Body>Flies in from the top</Body>
      </Fragment>
      <Fragment animation="flyIn" direction="down">
        <Body>Flies in from the bottom</Body>
      </Fragment>
    </SlideLayout.Default>
  );
}
