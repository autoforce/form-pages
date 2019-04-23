import test from 'ava';
import withPage from './helpers/withPage';
import { configureDefaultEnvironment } from './helpers/utils';
const pageableFormSelector = '.pageable-form';

test.beforeEach(configureDefaultEnvironment);

test('it initializes the component', withPage, async (t, page) => {
  const initializedPlugin = await page.evaluate(selector => {
    const $el = $(selector);
    $el.formPages();
    return $el.data('plugin_formPages') !== undefined;
  }, pageableFormSelector);

  t.is(initializedPlugin, true);
});

test('it creates the correct number of pages', withPage, async (t, page) => {
  const totalPages = await page.evaluate(selector => {
    const $el = $(selector);
    $el.formPages();
    return $el.find(
      $el.data('plugin_formPages')._defaults.formPageClass
    ).length;
  }, pageableFormSelector);
  t.is(totalPages, 2);
});

test('it moves all the pages to the container', withPage, async (t, page) => {
  const totalMovedPages = await page.evaluate(selector => {
    const $el = $(selector);
    $el.formPages();

    return $el.find(
      $el.data('plugin_formPages')._defaults.formPagesContainerClass
    ).find(
      $el.data('plugin_formPages')._defaults.formPageClass
    ).length;
  }, pageableFormSelector);

  t.is(totalMovedPages, 2);
});