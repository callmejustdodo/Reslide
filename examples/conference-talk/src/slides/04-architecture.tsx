import { SlideLayout, Title, Body, Columns, Fragment, Notes } from '@reslide/core';

export default function Architecture() {
  return (
    <SlideLayout.Default>
      <Title>Architecture</Title>
      <Columns>
        <div>
          <Fragment animation="flyIn" direction="left">
            <Body style={{ fontWeight: 'bold' }}>Core</Body>
            <Body>React components</Body>
            <Body>Context system</Body>
            <Body>Theme engine</Body>
          </Fragment>
        </div>
        <div>
          <Fragment animation="flyIn" direction="right">
            <Body style={{ fontWeight: 'bold' }}>CLI</Body>
            <Body>Vite plugin</Body>
            <Body>Dev server</Body>
            <Body>Export pipeline</Body>
          </Fragment>
        </div>
      </Columns>
      <Notes>
        The architecture is split into core (runtime) and CLI (tooling).
        This separation lets us ship a small runtime bundle.
      </Notes>
    </SlideLayout.Default>
  );
}
