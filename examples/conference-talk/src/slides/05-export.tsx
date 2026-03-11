import { SlideLayout, Title, Body, Code, Fragment } from '@reslide/core';

export default function Export() {
  return (
    <SlideLayout.Default>
      <Title>Triple Export</Title>
      <Fragment animation="fadeIn">
        <Code language="bash">{`# Export to PDF
reslide export pdf

# Export to PowerPoint
reslide export pptx

# Export both formats
reslide export all`}</Code>
      </Fragment>
      <Fragment animation="fadeIn">
        <Body>
          Powered by Playwright — pixel-perfect screenshots assembled into
          PDF (pdf-lib) or PPTX (pptxgenjs) with speaker notes preserved.
        </Body>
      </Fragment>
    </SlideLayout.Default>
  );
}
