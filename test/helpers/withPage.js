import puppeteer from 'puppeteer';

export default async function withPage(t, run) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(t.context.data.basicFilePath);
  await page.addScriptTag( { url: t.context.data.baseLibFile } );
  await page.addStyleTag( { url: t.context.data.baseLibStyle } );
  try {
    await run(t, page);
  } finally {
    await page.close();
    await browser.close();
  }
}