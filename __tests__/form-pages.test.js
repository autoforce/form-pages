const Nightmare = require("nightmare"),
    path = require('path'),
    basicFilePath = `file://${path.resolve(__dirname, 'fixtures/basic.html')}`,
    baseLibFile = path.resolve(__dirname, '../dist/form-pages.js'),
    baseLibStyle = path.resolve(__dirname, '../dist/form-pages.css');
let nightmare;

beforeEach(() => {
    nightmare = Nightmare({
        openDevTools: {
            mode: 'attach'
        },
        show: true
    });
})

it("it initializes the component", async () => {
    expect.assertions(1);
    const initializedPlugin = await nightmare
        .goto(basicFilePath)
        .inject('js', baseLibFile)
        .inject('css', baseLibStyle)
        .evaluate(selector => {
            const $el = $(selector);
            $el.formPages();
            return $el.data('plugin_formPages') !== undefined;
        }, '.pageable-form')
        .end();

    expect(initializedPlugin).toBe(true);
});

describe("Callbacks calls", () => {
    it("it calls the callback when 'previous' button is clicked", async () => {
        expect.assertions(1);
        const callbackCalled = await nightmare
            .goto(basicFilePath)
            .inject('js', baseLibFile)
            .inject('css', baseLibStyle)
            .evaluate(selector => {
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
            }, '.pageable-form')
            .end();

        expect(callbackCalled).toBe(true);
    });

    it("it calls the callback when 'next' button is clicked", async () => {
        expect.assertions(1);
        const callbackCalled = await nightmare
            .goto(basicFilePath)
            .inject('js', baseLibFile)
            .inject('css', baseLibStyle)
            .evaluate(selector => {
                let callbackCalled = false;
                const $el = $(selector);
                $el.formPages({
                    onNextPage: function () {
                        callbackCalled = true;
                    }
                });
                $el.find('.form-pages__next-button').first().trigger('click');
                return callbackCalled;
            }, '.pageable-form')
            .end();

        expect(callbackCalled).toBe(true);
    });
});
