import test from 'ava';
import withPage from './helpers/withPage';
import { configureDefaultEnvironment } from './helpers/utils';
const pageableFormSelector = '.pageable-form';

test.beforeEach(configureDefaultEnvironment);

test('it does not move to next page when out of bounds', withPage,
  async (t, page) => {
    const nextCallbackCalledOutOfBounds = await page.evaluate(selector => {
      let nextCallbackCalledOutOfBounds = false;
      const $el = $(selector);
      $el.formPages({
        onNextPage(e) {
          nextCallbackCalledOutOfBounds = e.currentPageIndex > $el
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
          prevCallbackCalledOutOfBounds = e.currentPageIndex < 0;
        },
      });

      $el.trigger('prev.page.fp');
      return prevCallbackCalledOutOfBounds;
    }, pageableFormSelector);

    t.is(prevCallbackCalledOutOfBounds, false);
  });