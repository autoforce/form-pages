import { fixture, libResource } from './utils';
const puppeteer = require('puppeteer');
const basicFilePath = `file://${fixture('basic.html')}`;
const baseLibFile = libResource('form-pages.js');
const baseLibStyle = libResource('form-pages.css');
const pageableFormSelector = '.pageable-form';

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto(basicFilePath);
  await page.addScriptTag({ url: baseLibFile });
  await page.addStyleTag({ url: baseLibStyle });
});

afterEach(async () => {
  await browser.close();
});

describe('Plugins classes', () => {
  it('it configures user-chosen `formPagesContainerClass`', async () => {
    expect.assertions(1);
    const result = await page.evaluate(selector => {
      const $el = $(selector);
      const formPagesContainerClass = '.my-form-container';
      $el.formPages({
        formPagesContainerClass,
      });
      return $el.find(formPagesContainerClass).length > 0;
    }, pageableFormSelector);

    expect(result).toBe(true);
  });
});

describe('User interactions', () => {
  it('it moves to the next page', async () => {
    expect.assertions(1);
    const activePageIndex = await page.evaluate(selector => {
      const $el = $(selector);
      $el.formPages();
      $el.trigger('next.fp.page');
      return $el.find($el.data('plugin_formPages').options.activePageClass)
        .index();
    }, pageableFormSelector);

    expect(activePageIndex).toBe(1);
  });

  it('it moves to the prev page', async () => {
    expect.assertions(1);
    const activePageIndex = await page.evaluate(selector => {
      const $el = $(selector);
      $el.formPages();
      $el.trigger('next.fp.page');
      $el.trigger('prev.fp.page');
      return $el.find($el.data('plugin_formPages').options.activePageClass)
        .index();
    }, pageableFormSelector);

    expect(activePageIndex).toBe(0);
  });
});

describe('Component initialization', () => {
  it('it initializes the component', async () => {
    expect.assertions(1);
    const initializedPlugin = await page.evaluate(selector => {
      const $el = $(selector);
      $el.formPages();
      return $el.data('plugin_formPages') !== undefined;
    }, pageableFormSelector);

    expect(initializedPlugin).toBe(true);
  });

  it('it creates the correct number of pages', async () => {
    expect.assertions(1);
    const totalPages = await page.evaluate(selector => {
      const $el = $(selector);
      $el.formPages();
      return $el.find(
        $el.data('plugin_formPages')._defaults.formPageClass
      ).length;
    }, pageableFormSelector);
    expect(totalPages).toBe(2);
  });

  it('it moves all the pages to the container', async () => {
    expect.assertions(1);
    const totalMovedPages = await page.evaluate(selector => {
      const $el = $(selector);
      $el.formPages();

      return $el.find(
        $el.data('plugin_formPages')._defaults.formPagesContainerClass
      ).find(
        $el.data('plugin_formPages')._defaults.formPageClass
      ).length;
    }, pageableFormSelector);

    expect(totalMovedPages).toBe(2);
  });
});

describe('Callbacks calls', () => {
  it("it calls the callback when 'previous' button is clicked", async () => {
    expect.assertions(1);
    const callbackCalled = await page.evaluate(selector => {
      let callbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        onPrevPage: function() {
          callbackCalled = true;
        },
      });
      $el.find('.form-pages__next-button').first().trigger('click');
      $el.find('.form-pages__prev-button').first().trigger('click');
      return callbackCalled;
    }, pageableFormSelector);

    expect(callbackCalled).toBe(true);
  });

  it("it calls the callback when 'next' button is clicked", async () => {
    expect.assertions(1);
    const callbackCalled = await page.evaluate(selector => {
      let callbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        onNextPage: function() {
          callbackCalled = true;
        },
      });
      $el.find('.form-pages__next-button').first().trigger('click');
      return callbackCalled;
    }, pageableFormSelector);

    expect(callbackCalled).toBe(true);
  });
});
