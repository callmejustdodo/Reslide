import { SlideLayout, Title, Body, Fragment, Notes } from '@reslide/core';

export default function Problem() {
  return (
    <SlideLayout.Default>
      <Title>The Problem</Title>
      <Fragment animation="fadeIn">
        <Body>Traditional slide tools are not developer-friendly</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>No version control — binary files don't diff well</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>No code reuse — copy-paste between decks</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>No programmatic control — static content only</Body>
      </Fragment>
      <Notes>
        How many of you have tried to collaborate on a PowerPoint in git?
        It doesn't work. We need something better.
      </Notes>
    </SlideLayout.Default>
  );
}
