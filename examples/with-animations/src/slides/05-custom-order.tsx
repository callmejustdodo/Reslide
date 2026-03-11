import { SlideLayout, Title, Body, Fragment, Notes } from '@reslide/core';

export default function CustomOrderDemo() {
  return (
    <SlideLayout.Default>
      <Title>Custom Fragment Order</Title>
      <Fragment order={3} animation="fadeIn">
        <Body>Third (order=3)</Body>
      </Fragment>
      <Fragment order={1} animation="fadeIn">
        <Body>First (order=1)</Body>
      </Fragment>
      <Fragment order={2} animation="fadeIn">
        <Body>Second (order=2)</Body>
      </Fragment>
      <Notes>Fragments can appear in any order using the order prop.</Notes>
    </SlideLayout.Default>
  );
}

export const meta = {
  transition: { type: 'slide-left' as const, duration: 300 },
};
