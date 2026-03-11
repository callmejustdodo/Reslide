import { SlideLayout, Title, Body, Fragment } from '@reslide/core';

export default function FadeInDemo() {
  return (
    <SlideLayout.Default>
      <Title>Fade In Animation</Title>
      <Fragment animation="fadeIn">
        <Body>This fades in smoothly on step 1</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>This fades in smoothly on step 2</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>This fades in smoothly on step 3</Body>
      </Fragment>
    </SlideLayout.Default>
  );
}
