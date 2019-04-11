import test from 'ava';
import withPage from './helpers/withPage';
import { fixture, libResource } from './helpers/utils';
const pageableFormSelector = '.pageable-form';
const basicFilePath = `file://${fixture( 'basic.html' )}`;
const baseLibFile = libResource( 'form-pages.js' );
const baseLibStyle = libResource( 'form-pages.css' );

test.beforeEach(t => {
  t.context.data = {
    basicFilePath,
    baseLibFile,
    baseLibStyle,
  };
});

test('it does not move to next page when out of bounds', withPage,
  async (t, page) => {
    const nextCallbackCalledOutOfBounds = await page.evaluate(selector => {
      let nextCallbackCalledOutOfBounds = false;
      const $el = $(selector);
      $el.formPages({
        onNextPage(e) {
          nextCallbackCalledOutOfBounds = e.data.currentPage > $el
            .data('plugin_formPages').getTotalPages();
        },
      });

      $el.trigger('next.page.fp');
      $el.trigger('next.page.fp');
      $el.trigger('next.page.fp');
      return nextCallbackCalledOutOfBounds;
    }, pageableFormSelector);

    t.is(nextCallbackCalledOutOfBounds, false);
  });

test('it does not move to previous page when out of bounds', withPage,
  async (t, page) => {
    const prevCallbackCalledOutOfBounds = await page.evaluate(selector => {
      let prevCallbackCalledOutOfBounds = false;
      const $el = $(selector);
      $el.formPages({
        onPrevPage(e) {
          prevCallbackCalledOutOfBounds = e.data.currentPage < 1;
        },
      });

      $el.trigger('prev.page.fp');
      return prevCallbackCalledOutOfBounds;
    }, pageableFormSelector);

    t.is(prevCallbackCalledOutOfBounds, false);
  });