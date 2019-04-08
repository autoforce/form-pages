import puppeteer from 'puppeteer';
import { fixture, libResource } from './utils';
const basicFilePath = `file://${fixture( 'basic.html' )}`;
const baseLibFile = libResource( 'form-pages.js' );
const baseLibStyle = libResource( 'form-pages.css' );

export default async function withPage(t, run) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(basicFilePath);
  await page.addScriptTag( { url: baseLibFile } );
  await page.addStyleTag( { url: baseLibStyle } );
  try {
    await run(t, page);
  } finally {
    await page.close();
    await browser.close();
  }
}