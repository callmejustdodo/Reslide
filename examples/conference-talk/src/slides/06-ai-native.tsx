import { SlideLayout, Title, Body, Code, Fragment, Notes } from '@reslide/core';

export default function AiNative() {
  return (
    <SlideLayout.Default>
      <Title>AI-Native Workflow</Title>
      <Fragment>
        <Body>Claude Code understands Reslide via agentskills.io skills:</Body>
      </Fragment>
      <Fragment animation="fadeIn">
        <Code language="text">{`You: "Create a 5-slide pitch deck for a task management app"

Claude: Creates 5 .tsx files with proper layouts, fragments,
        speaker notes, and theming — ready to present.`}</Code>
      </Fragment>
      <Notes>
        The skills system teaches Claude Code our component API,
        so it generates correct slide code on the first try.
      </Notes>
    </SlideLayout.Default>
  );
}
