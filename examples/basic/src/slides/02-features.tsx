import { Fragment } from '@reslide/core';
import { SlideLayout } from '@/components/slide-layout';
import { Title } from '@/components/title';
import { Body } from '@/components/body';

export default function Features() {
  return (
    <SlideLayout.Default>
      <Title>Key Features</Title>
      <Fragment><Body>File-based slide routing — each file is a slide</Body></Fragment>
      <Fragment><Body>Built on shadcn/ui + Tailwind CSS</Body></Fragment>
      <Fragment><Body>Export to Web, PDF, and PowerPoint</Body></Fragment>
      <Fragment><Body>AI-native with Claude Code skills</Body></Fragment>
    </SlideLayout.Default>
  );
}
