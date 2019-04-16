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

test('it calls the callback when plugin gets initialized', withPage,
  async (t, page) => {
    const callbackCalled = await page.evaluate( selector => {
      let callbackCalled = false;
      const $el = $( selector );
      $el.formPages( {
        onInitialized: function() {
          callbackCalled = true;
        },
      } );
      return callbackCalled;
    }, pageableFormSelector );

    t.is( callbackCalled, true );
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