import test from 'ava';
import withPage from './helpers/withPage';
import { fixture, libResource } from './helpers/utils';
const pageableFormSelector = '.pageable-form';
const basicFilePath = `file://${fixture('basic.html')}`;
const baseLibFile = libResource('form-pages.js');
const baseLibStyle = libResource('form-pages.css');

test.beforeEach(t => {
  t.context.data = {
    basicFilePath,
    baseLibFile,
    baseLibStyle,
  };
});

test(
  'it correctly sets the container height when `adaptiveHeight` is true',
  withPage, async (t, page) => {
    const containerHeightMatchesActivePage = await page.evaluate(selector => {
      let containerHeightMatchesActivePage = false;
      const $el = $(selector);
      $el.formPages({
        onMovedPage() {
          const instance = $el.data('plugin_formPages');
          containerHeightMatchesActivePage =
                        instance.$formPagesContainer.height() ===
                        instance.getCurrentPageElement().height();
        },
      });

      $el.data('plugin_formPages').trigger('next.page.fp');

      return containerHeightMatchesActivePage;
    }, pageableFormSelector);

    t.is(containerHeightMatchesActivePage, true);
  });