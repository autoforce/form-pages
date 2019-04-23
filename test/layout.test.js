import test from 'ava';
import withPage from './helpers/withPage';
import { configureDefaultEnvironment } from './helpers/utils';
const pageableFormSelector = '.pageable-form';

test.beforeEach(configureDefaultEnvironment);

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