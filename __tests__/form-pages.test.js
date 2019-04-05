const puppeteer = require("puppeteer"),
    path = require('path'),
    basicFilePath = `file://${path.resolve(__dirname, 'fixtures/basic.html')}`,
    baseLibFile = path.resolve(__dirname, '../dist/form-pages.js'),
    baseLibStyle = path.resolve(__dirname, '../dist/form-pages.css'),
    pageableFormSelector = '.pageable-form';

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(basicFilePath);
    await page.addScriptTag({ url: baseLibFile });
    await page.addStyleTag({ url: baseLibStyle });
})

afterEach(async () => {
    await browser.close();
});

describe('Component initialization', () => {
    it("it initializes the component", async () => {
        expect.assertions(1);
        const initializedPlugin = await page.evaluate(selector => {
            const $el = $(selector);
            $el.formPages();
            return $el.data('plugin_formPages') !== undefined;
        }, pageableFormSelector);

        expect(initializedPlugin).toBe(true);
    });
})

describe("Callbacks calls", () => {
    it("it calls the callback when 'previous' button is clicked", async () => {
        expect.assertions(1);
        const callbackCalled = await page.evaluate(selector => {
            let callbackCalled = false;
            const $el = $(selector);
            $el.formPages({
                onPrevPage: function () {
                    callbackCalled = true;
                }
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
                onNextPage: function () {
                    callbackCalled = true;
                }
            });
            $el.find('.form-pages__next-button').first().trigger('click');
            return callbackCalled;
        }, pageableFormSelector);

        expect(callbackCalled).toBe(true);
    });
});
