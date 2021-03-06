import test from 'ava';
import withPage from './helpers/withPage';
import { configureDefaultEnvironment } from './helpers/utils';
const pageableFormSelector = '.pageable-form';

test.beforeEach(configureDefaultEnvironment);

test('it calls the callback when plugin gets initialized', withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate(selector => {
      let callbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        onInitialized() {
          callbackCalled = true;
        },
      });
      return callbackCalled;
    }, pageableFormSelector);

    t.is(callbackCalled, true);
  });

test("it calls the callback when 'previous' button is clicked", withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate(selector => {
      let callbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        onPrevPage() {
          callbackCalled = true;
        },
      });
      $el.find('.form-pages__next-button').first().trigger('click');
      $el.find('.form-pages__prev-button').first().trigger('click');
      return callbackCalled;
    }, pageableFormSelector);

    t.is(callbackCalled, true);
  });

test("it calls the callback when 'next' button is clicked", withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate(selector => {
      let callbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        onNextPage() {
          callbackCalled = true;
        },
      });
      $el.find('.form-pages__next-button').first().trigger('click');
      return callbackCalled;
    }, pageableFormSelector);

    t.is(callbackCalled, true);
  });

test('it respects forward move based on `shouldMoveForwards`', withPage,
  async (t, page) => {
    const nextCallbackCalled = await page.evaluate(selector => {
      let nextCallbackCalled = false;
      const $el = $(selector);
      $el.formPages({
        shouldMoveForwards() {
          return false;
        },
        onNextPage() {
          nextCallbackCalled = true;
        },
      });
      $el.find('.form-pages__next-button').first().trigger('click');
      return nextCallbackCalled;
    }, pageableFormSelector);

    t.is(nextCallbackCalled, false);
  });

test('it calls the callback to update the container height', withPage,
  async (t, page) => {
    const updateContainerHeightCallbackCalled = await page.evaluate(
      selector => {
        let updateContainerHeightCallbackCalled = false;
        const $el = $(selector);
        $el.formPages({
          onRecalculateContainerHeight() {
            updateContainerHeightCallbackCalled = true;
          },
        });
        $el.find('.form-pages__next-button').first().trigger('click');
        return updateContainerHeightCallbackCalled;
      }, pageableFormSelector);

    t.is(updateContainerHeightCallbackCalled, true);
  });