/**
 * @typedef {Object} FormPagesOptions
 * @property {string} formPageSelector The selector which will separate the form pages
 * @property {string} activePageSelector The active page selector
 * @property {string} nextButtonSelector The selector for the "next" button
 * @property {string} prevButtonSelector The selector for the "previour" button
 * @property {string} submitButtonSelector The selector for the form submit button
 * @property {function} onNextPage Callback trigerred when the next page button is pressed
 * @property {function} onPrevPage Callback trigerred when the previous page button is pressed
 */

/**
 * @typedef FormPages
 * @property {jQuery} $element
 * @property {FormPagesOptions} options
 * @property {number} totalPages
 * @property {FormPagesOptions} _defaults
 * @property {string} _name
 */

 /**
  * @typedef EventList
  */

( function( $, window, document, undefined ) {

  /** @type {FormPagesOptions} defaults */
  let defaults = {
    formPageSelector: ".form-pages__page",
    nextButtonSelector: ".form-pages__next-button",
    prevButtonSelector: ".form-pages__prev-button",
    submitButtonSelector: ".form-pages__submit-button"
  };

  const PLUGIN_NAME = "formPages",
    EVENT_NAMESPACE_PREFIX = "fp",

    /** @type {EventList} */
    Events = {
      NEXT_PAGE: `next.${EVENT_NAMESPACE_PREFIX}.page`,
      PREV_PAGE: `prev.${EVENT_NAMESPACE_PREFIX}.page`
    };

  /**
   * Creates the FormPages component
   * @class
   * @param {jQuery} element The main form element
   * @param {FormPagesOptions} options
   * @extends FormPages
   */
  function FormPages( element, options ) {
    this.$element = $( element );
    this.options = $.extend( {}, defaults, options );

    // Control variables
    this.currentPage = 1;

    this._defaults = defaults;
    this._name = PLUGIN_NAME;

    this.init();
  }

  FormPages.prototype.trigger = function( triggerName, params ) {
    this.$element.trigger( triggerName, params );
  };

  FormPages.prototype.on = function( eventName, cb ) {
    this.$element.on( eventName, cb );
  };

  FormPages.prototype.init = function() {
    var self = this;

    // Step 1: Add the correspondent classes
    // Removing the active classes from the pages as a way to prevent wrongly
    // presented pages.
    this.$element.find( this.options.formPageSelector )
      .removeClass( this.options.activePageSelector );

    function configureDefaultTriggers() {

      // Step 2: Configure the proper events to navigate through the pages
      self.$element.on( "click", function( e ) {
        var $target = $( e.target );

        // We should prevent default when clicked on "next" or "prev" buttons to avoid sending the form
        if ( $target.is( self.options.prevButtonSelector ) ) {
          e.preventDefault();
          self.trigger( Events.PREV_PAGE, { currentPage: self.goToPrevPage() } );
        } else if ( $target.is( self.options.nextButtonSelector ) ) {
          e.preventDefault();
          self.trigger( Events.NEXT_PAGE, { currentPage: self.goToNextPage() } );
        }
      } );
    }

    configureDefaultTriggers();
  };

  /**
   * @return {number}
   */
  FormPages.prototype.getTotalPages = function() {
    return this.$element.find( this.options.formPageSelector ).length;
  };

  /**
   * Tries to move the form to a specific page
   * @return {number}
   */
  FormPages.prototype.goTo = function( page ) {

    // Page must be bigger than zero and less than the total pages
    if ( !( page  <= 0 || page > this.getTotalPages() ) ) {
      this.currentPage = page;
    }

    return this.currentPage;
  };

  /**
   * Tries to move the form to the next page and returns the current page
   * @return {number}
   */
  FormPages.prototype.goToNextPage = function() {
    return this.goTo( this.currentPage + 1 );
  };

  /**
   * Tries to move the form to the prev page and returns the current page
   * @return {number}
   */
  FormPages.prototype.goToPrevPage = function() {
    return this.goTo( this.currentPage - 1 );
  };

  /**
   * @param {FormPagesOptions} options
   */
  $.fn[ PLUGIN_NAME ] = function( options ) {
    return this.each( function() {
      if ( !$.data( this, "plugin_" + PLUGIN_NAME ) ) {
        $.data( this, "plugin_" + PLUGIN_NAME, new FormPages( this, options ) );
      }
    } );
  };
} )( jQuery, window, document );
