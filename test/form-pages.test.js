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

test( 'it configures user-chosen `formPagesContainerClass`', withPage,
  async (t, page) => {
    const result = await page.evaluate( selector => {
      const $el = $( selector );
      const formPagesContainerClass = '.my-form-container';
      $el.formPages( {
        formPagesContainerClass,
      } );
      return $el.find( formPagesContainerClass ).length > 0;
    }, pageableFormSelector );

    t.is( result, true );
  } );

test( 'it moves to the next page', withPage, async (t, page) => {
  const activePageIndex = await page.evaluate( selector => {
    const $el = $( selector );
    $el.formPages();
    $el.trigger( 'next.fp.page' );
    return $el.find( $el.data( 'plugin_formPages' ).options.activePageClass )
      .index();
  }, pageableFormSelector );

  t.is( activePageIndex, 1 );
} );

test( 'it moves to the prev page', withPage, async (t, page) => {
  const activePageIndex = await page.evaluate( selector => {
    const $el = $( selector );
    $el.formPages();
    $el.trigger( 'next.fp.page' );
    $el.trigger( 'prev.fp.page' );
    return $el.find( $el.data( 'plugin_formPages' ).options.activePageClass )
      .index();
  }, pageableFormSelector );

  t.is( activePageIndex, 0 );
} );

test( 'it initializes the component', withPage, async (t, page) => {
  const initializedPlugin = await page.evaluate( selector => {
    const $el = $( selector );
    $el.formPages();
    return $el.data( 'plugin_formPages' ) !== undefined;
  }, pageableFormSelector );

  t.is( initializedPlugin, true );
} );

test( 'it creates the correct number of pages', withPage, async (t, page) => {
  const totalPages = await page.evaluate( selector => {
    const $el = $( selector );
    $el.formPages();
    return $el.find(
      $el.data( 'plugin_formPages' )._defaults.formPageClass
    ).length;
  }, pageableFormSelector );
  t.is( totalPages, 2 );
} );

test( 'it moves all the pages to the container', withPage, async (t, page) => {
  const totalMovedPages = await page.evaluate( selector => {
    const $el = $( selector );
    $el.formPages();

    return $el.find(
      $el.data( 'plugin_formPages' )._defaults.formPagesContainerClass
    ).find(
      $el.data( 'plugin_formPages' )._defaults.formPageClass
    ).length;
  }, pageableFormSelector );

  t.is( totalMovedPages, 2 );
} );

test( "it calls the callback when 'previous' button is clicked", withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate( selector => {
      let callbackCalled = false;
      const $el = $( selector );
      $el.formPages( {
        onPrevPage: function() {
          callbackCalled = true;
        },
      } );
      $el.find( '.form-pages__next-button' ).first().trigger( 'click' );
      $el.find( '.form-pages__prev-button' ).first().trigger( 'click' );
      return callbackCalled;
    }, pageableFormSelector );

    t.is( callbackCalled, true );
  } );

test( "it calls the callback when 'next' button is clicked", withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate( selector => {
      let callbackCalled = false;
      const $el = $( selector );
      $el.formPages( {
        onNextPage: function() {
          callbackCalled = true;
        },
      } );
      $el.find( '.form-pages__next-button' ).first().trigger( 'click' );
      return callbackCalled;
    }, pageableFormSelector );

    t.is( callbackCalled, true );
  } );

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

      $el.trigger('next.fp.page');
      $el.trigger('next.fp.page');
      $el.trigger('next.fp.page');
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

      $el.trigger('prev.fp.page');
      return prevCallbackCalledOutOfBounds;
    }, pageableFormSelector);

    t.is(prevCallbackCalledOutOfBounds, false);
  });