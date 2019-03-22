(function () {
  'use strict';

  /**
   * @typedef FormPagesOptions
   * @property {string} formPageSelector The selector which will separate the form pages
   * @property {string} nextButtonSelector The selector for the "next" button
   * @property {string} prevButtonSelector The selector for the "previour" button
   * @property {string} submitButtonSelector The selector for the form submit button
   */
  ( function( $, window, document, undefined$1 ) {

    /** @type {FormPagesOptions} defaults */
    var defaults = {
        formPageSelector: ".form-pages__page",
        nextButtonSelector: ".form-pages__next-button",
        prevButtonSelector: ".form-pages__prev-button",
        submitButtonSelector: ".form-pages__submit-button"
      },
      pluginName = "formPages";

    function FormPages( element, options ) {
      this.element = element;
      this.options = $.extend( {}, defaults, options );

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    FormPages.prototype.init = function() {

      // TODO Make the magic happen
    };

    $.fn[ pluginName ] = function( options ) {
      return this.each( function() {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
          $.data( this, "plugin_" + pluginName, new FormPages( this, options ) );
        }
      } );
    };
  } )( jQuery, window, document );

}());
