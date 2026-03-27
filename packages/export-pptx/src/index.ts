import PptxGenJS from 'pptxgenjs';

export interface PptxExportOptions {
  /** URL of the built Reslide app (e.g. http://localhost:4173) */
  url: string;
  /** Output file path */
  output: string;
  /** Include speaker notes */
  includeNotes?: boolean;
  /** Include fragment steps as separate slides */
  includeSteps?: boolean;
  /** Slide dimensions */
  width?: number;
  height?: number;
}

export async function exportPptx(options: PptxExportOptions): Promise<void> {
  const { url, output, includeNotes = true, includeSteps = false, width = 1920, height = 1080 } = options;

  const { chromium } = await import('playwright');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  await page.goto(`${url}?export=true`);
  await page.waitForFunction(() => window.__reslide?.isReady() === true, null, { timeout: 30000 });

  const totalSlides = await page.evaluate(() => window.__reslide!.totalSlides);
  const stepsPerSlide = await page.evaluate(() => window.__reslide!.stepsPerSlide);

  const pptx = new PptxGenJS();
  // 16:9 in inches: 13.33 x 7.5
  pptx.defineLayout({ name: 'RESLIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'RESLIDE';

  for (let s = 0; s < totalSlides; s++) {
    const maxStep = includeSteps ? (stepsPerSlide[s] ?? 0) : 0;

    for (let step = 0; step <= maxStep; step++) {
      await page.evaluate(
        ({ slide, step }) => window.__reslide!.goTo(slide, step),
        { slide: s, step },
      );
      await page.waitForTimeout(200);

      const screenshot = await page.screenshot({ type: 'png' });
      const base64 = screenshot.toString('base64');

      const pptxSlide = pptx.addSlide();
      pptxSlide.addImage({
        data: `image/png;base64,${base64}`,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      });

      // Only add notes on the first step (or the only step) of each slide
      if (includeNotes && step === 0) {
        const notes = await page.evaluate((idx) => window.__reslide!.getNotes(idx), s);
        if (notes) pptxSlide.addNotes(notes);
      }
    }
  }

  await pptx.writeFile({ fileName: output });
  await browser.close();
}
