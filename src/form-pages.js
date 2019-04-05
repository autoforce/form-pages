import "./form-pages.scss";
import { getOptionsSelectorAlphaChars } from "./utils.js";

/**
 * Plugin
 */

/**
* @typedef {('horizontal'|'vertical')} PaginationDirection
*/

/**
 * @typedef {('next'|'prev'|'none')} Direction
 */

/**
 * @typedef {Object} FormPagesOptions
 * @property {string} formPageClass=".form-pages__page" The selector which will separate the form pages.
 * @property {string} activePageClass=".form-pages__page--active" The active page selector.
 * @property {string} nextButtonClass=".form-pages__next-button" The selector for the "next" button.
 * @property {string} prevButtonClass=".form-pages__prev-button" The selector for the "previous" button.
 * @property {string} formPagesContainerClass=".form-pages__page-container" The selector for the pages container which holds all the pages.
 * @property {string} submitButtonClass=".form-pages__submit-button" The selector for the form submit button.
 * @property {PaginationDirection} paginationDirection="horizontal" The direction that the form will move.
 * @property {function?} onNextPage Callback to be triggered when the form goes to the next page.
 * @property {function?} onPrevPage Callback to be triggered when the form goes to the previous page.
 */

/**
 * @enum {{string: string}} EventList
 */

/**
 * @typedef Dimensions
 * @property {number} width
 * @property {number} height
 */

const PLUGIN_NAME = "formPages",
  EVENT_NAMESPACE_PREFIX = "fp",

  /**
   * @type {EventList}
   * @private
   */
  Events = {
    NEXT_PAGE: `next.${EVENT_NAMESPACE_PREFIX}.page`,
    PREV_PAGE: `prev.${EVENT_NAMESPACE_PREFIX}.page`
  },
  PaginationDirection = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical"
  },
  CALLBACKS = [
    "onNextPage",
    "onPrevPage"
  ];


/** @type {FormPagesOptions} */
let defaults = {
  formPageClass: ".form-pages__page",
  nextButtonClass: ".form-pages__next-button",
  prevButtonClass: ".form-pages__prev-button",
  submitButtonClass: ".form-pages__submit-button",
  paginationDirection: PaginationDirection.HORIZONTAL,
  activePageClass: ".form-pages__page--active",
  formPagesContainerClass: ".form-pages__page-container"
},
  $formPagesContainer = $( "<div></div>" ),
  $pages;

/**
 * @class
 * @description Creates the FormPages component.
 * @property {jQuery} $element The form which the plugin is constructed upon.
 * @property {FormPagesOptions} options
 * @property {number} totalPages The total os pages found in the container object.
 * @param {jQuery!} element The main form element.
 * @param {FormPagesOptions?} options
 */
function FormPages( element, options ) {
  this.$element = $( element );
  this.options = $.extend( {}, defaults, options );

  // Control variables
  this.currentPage = 1;

  this._defaults = defaults;
  this._name = PLUGIN_NAME;

  this.getOptionsSelectorAlphaChars = getOptionsSelectorAlphaChars.bind( this );

  this.init();
}

/**
 * Makes a proxy and calls events to the main `$element` object, passing the
 * current page as event data.
 * @param {string} eventName
 * @param {object} params Params passed to the jQuery trigger function to be attached as event data.
 */
FormPages.prototype.trigger = function( eventName, params ) {
  this.$element.trigger( eventName, $.extend( {}, params, { currentPage: this.currentPage } ) );
};

/**
 * Configures events to the plugin
 * @param {string} eventName
 * @param {function} cb Event callback
 * See {@tutorial event-handling}
 */
FormPages.prototype.on = function( eventName, cb ) {
  this.$element.on( eventName, null, { currentPage: this.currentPage }, cb );
};

/**
 * Checks if the pages can move forwards.
 * @return {boolean}
 */
FormPages.prototype.canMoveForwards = function() {
  return this.currentPage + 1 <= this.getTotalPages();
};

/**
 * Checks if the pages can move backwards.
 * @return {boolean}
 */
FormPages.prototype.canMoveBackwards = function() {
  return this.currentPage - 1 > 0;
};

/**
 * Initializes the plugin.
 * @private
 */
FormPages.prototype.init = function() {
  const self = this;

  $pages = this.$element.find( this.options.formPageClass );

  // Adding the form pages container class to the $formPagesContainer.
  $formPagesContainer.addClass(
    this.getOptionsSelectorAlphaChars( "formPagesContainerClass" ) );

  // Step 1: Add the correspondent classes
  // Removing the active classes from the pages as a way to prevent wrongly
  // presented pages, then we add the active page class to the first page.
  $pages
    .removeClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) )
    .first()
    .addClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) );

  // Step 2: Move the pages to the container
  $pages.appendTo( $formPagesContainer );
  this.$element.append( $formPagesContainer );

  // Step 3: Configuring the default triggers.
  function configureDefaultTriggers() {

    // Proxying the configured event callbacks
    $.each( CALLBACKS, function( index, callbackKey ) {
      const callback = self.options[ callbackKey ];
      if ( !callback ) {
        return;
      }
      self.options[ callbackKey ] = callback.bind( null, { currentPage: self.currentPage } );
    } );

    // Adding the default configured callbacks to the events
    self.on( Events.PREV_PAGE, self.options.onPrevPage );
    self.on( Events.NEXT_PAGE, self.options.onNextPage );

    // If valid, we always move on next or previous events.
    self.on( Events.PREV_PAGE, function( e ) {
      self.goToPrevPage();
    } );

    self.on( Events.NEXT_PAGE, function( e ) {
      self.goToNextPage();
    } );

    self.on( "click", function( e ) {
      const $target = $( e.target );

      // We should prevent default when clicked on "next" or "prev" buttons.
      // to avoid sending the form.
      // We manually check if the form can move forwards or backwards so
      // that we avoid triggering the event when the movement is out of
      // boundaries.
      if ( $target.is( self.options.prevButtonClass ) ) {
        e.preventDefault();
        self.canMoveBackwards() && self.trigger( Events.PREV_PAGE );
      } else if ( $target.is( self.options.nextButtonClass ) ) {
        e.preventDefault();
        self.canMoveForwards() && self.trigger( Events.NEXT_PAGE );
      }
    } );
  }

  function configureContainerFormClasses() {
    let classes = "form-pages--active";
    if ( self.options.paginationDirection === PaginationDirection.VERTICAL ) {
      classes += " form-pages--vertical";
    }
    self.$element.addClass( classes );
  }

  configureDefaultTriggers();
  configureContainerFormClasses();
};

/**
 * Checks the amount of the elements that matches to the
 * `this.options.formPageClass` option value.
 * @return {number}
 */
FormPages.prototype.getTotalPages = function() {
  return this.$element.find( this.options.formPageClass ).length;
};

/**
 * Tries to move the form to a specific page.
 * This also validates if the move is allowed (not out of bounds).
 * In case the component can't move to the desired page, it returns the
 * current page.
 * @return {number}
 */
FormPages.prototype.goTo = function( page ) {

  /** @type {Direction} */
  let movingDirection = "next";

  // Page must be bigger than zero and less than the total pages
  if ( !( page <= 0 || page > this.getTotalPages() ) ) {
    movingDirection = page > this.currentPage ? "next" : "prev";
    this.currentPage = page;
  } else {
    movingDirection = "none";
  }

  if ( movingDirection === "none" ) {
    return this.currentPage;
  }

  // Animating the pages
  const $activePage = $formPagesContainer.find( this.options.activePageClass );

  $activePage
    .removeClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) );

  // Can be the previous page also. "next" in this case does not imply
  // direction or position.
  let $nextPageToBeShown,
    translationX =
      `${this.getPageDimensions().width * ( this.currentPage - 1 )}`;

  // Verifyting the direction
  switch ( movingDirection ) {
    case "next":
      $nextPageToBeShown = $activePage
        .next();
      translationX = `-${translationX}`;
      break;
    case "prev":
      $nextPageToBeShown = $activePage
        .prev();
      break;
  }

  $nextPageToBeShown.addClass(
    this.getOptionsSelectorAlphaChars( "activePageClass" ) );
  $formPagesContainer.css( "transform",
    `translateX(${translationX}px)` );

  return this.currentPage;
};

/**
 * Tries to move the form to the next page and returns the current page.
 * This triggers `next.fp.page` event it's a valid movement.
 * @return {number} The page the component moved to.
 */
FormPages.prototype.goToNextPage = function() {
  return this.goTo( this.currentPage + 1 );
};

/**
 * Tries to move the form to the previous page and returns the current page.
 * @description This triggers `prev.fp.page` event it's a valid movement.
 * @return {number} The page the component moved to.
 */
FormPages.prototype.goToPrevPage = function() {
  return this.goTo( this.currentPage - 1 );
};

/**
 * Gets the pages' parent's dimensions.
 * @return {Dimensions}
 */
FormPages.prototype.getParentDimensions = function() {
  return {
    width: this.$element.outerWidth(),
    height: this.$element.outerHeight()
  };
};

/**
 * Gets the dimensions of the page to help adjust possible animations.
 * @param {number} pageNumber
 * @returns {Dimensions}
 */
FormPages.prototype.getPageDimensions = function( pageNumber = 1 ) {

  /** @type {Dimensions} */
  let result = {},
    $pageEl = this.$element.find( this.options.formPageClass ).eq( pageNumber - 1 );
  result.width = $pageEl.outerWidth();
  result.height = $pageEl.outerHeight();

  return result;
};

( function( $, window, document, undefined ) {

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
