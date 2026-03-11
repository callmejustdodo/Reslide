import { SlideLayout, Title, Body, Fragment } from '@reslide/core';

export default function AppearDemo() {
  return (
    <SlideLayout.Default>
      <Title>Appear Animation</Title>
      <Fragment animation="appear">
        <Body>This appears instantly on step 1</Body>
      </Fragment>
      <Fragment animation="appear">
        <Body>This appears instantly on step 2</Body>
      </Fragment>
      <Fragment animation="appear">
        <Body>This appears instantly on step 3</Body>
      </Fragment>
    </SlideLayout.Default>
  );
}
