import { PDFDocument } from 'pdf-lib';

export interface PdfExportOptions {
  /** URL of the built Reslide app (e.g. http://localhost:4173) */
  url: string;
  /** Output file path */
  output: string;
  /** Include fragment steps as separate pages */
  includeSteps?: boolean;
  /** Slide dimensions */
  width?: number;
  height?: number;
}

export async function exportPdf(options: PdfExportOptions): Promise<void> {
  const { url, output, includeSteps = false, width = 1920, height = 1080 } = options;

  // Dynamic import to keep playwright as peer dep
  const { chromium } = await import('playwright');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  // Navigate with export mode
  await page.goto(`${url}?export=true`);
  await page.waitForFunction(() => window.__reslide?.isReady() === true, null, { timeout: 10000 });

  const totalSlides = await page.evaluate(() => window.__reslide!.totalSlides);

  const pdfDoc = await PDFDocument.create();

  for (let s = 0; s < totalSlides; s++) {
    await page.evaluate((slide) => window.__reslide!.goTo(slide, 0), s);
    await page.waitForTimeout(150);

    const screenshot = await page.screenshot({ type: 'png' });
    const image = await pdfDoc.embedPng(screenshot);
    const pdfPage = pdfDoc.addPage([width, height]);
    pdfPage.drawImage(image, { x: 0, y: 0, width, height });
  }

  const pdfBytes = await pdfDoc.save();

  const fs = await import('node:fs/promises');
  await fs.writeFile(output, pdfBytes);

  await browser.close();
}
