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
  const { url, output, includeNotes = true, width = 1920, height = 1080 } = options;

  const { chromium } = await import('playwright');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  await page.goto(`${url}?export=true`);
  await page.waitForFunction(() => window.__reslide?.isReady() === true, null, { timeout: 10000 });

  const totalSlides = await page.evaluate(() => window.__reslide!.totalSlides);

  const pptx = new PptxGenJS();
  // 16:9 in inches: 13.33 x 7.5
  pptx.defineLayout({ name: 'RESLIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'RESLIDE';

  for (let s = 0; s < totalSlides; s++) {
    await page.evaluate((slide) => window.__reslide!.goTo(slide, 0), s);
    await page.waitForTimeout(150);

    const screenshot = await page.screenshot({ type: 'png' });
    const base64 = screenshot.toString('base64');

    const slide = pptx.addSlide();
    slide.addImage({
      data: `image/png;base64,${base64}`,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });

    if (includeNotes) {
      const notes = await page.evaluate((idx) => window.__reslide!.getNotes(idx), s);
      if (notes) slide.addNotes(notes);
    }
  }

  await pptx.writeFile({ fileName: output });
  await browser.close();
}
