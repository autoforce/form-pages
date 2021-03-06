import "./form-pages.scss";
import { getOptionsSelectorAlphaChars } from "./utils.js";

/**
* @typedef {('horizontal'|'vertical')} PaginationDirection
*/

/**
 * @typedef {('next'|'prev'|'none')} Direction
 */

/**
 * @typedef {Object} FormPagesOptions
 * All properties which the suffix is "Class" can be an array, which will be
 * joined and cleaned before being added to the elements.
 * The value of `this` on all callbacks is the jQuery element you applied the plugin to.
 * @property {string} activePageClass=".form-pages__page--active" The active page selector.
 * @property {string} adaptiveContainerHeight=true Tells if the form container height must be adaptive to the active page.
 * @property {string} formPageClass=".form-pages__page" The selector which will separate the form pages.
 * @property {string} formPagesContainerAdaptiveHeightClass=".form-pages__page-container--adaptive-height" The selector for the pages container when adaptiveContainerHeight is set to true.
 * @property {string} nextButtonClass=".form-pages__next-button" The selector for the "next" button.
 * @property {string} prevButtonClass=".form-pages__prev-button" The selector for the "previous" button.
 * @property {string} submitButtonClass=".form-pages__submit-button" The selector for the form submit button.
 * @property {PaginationDirection} paginationDirection="horizontal" The direction that the form will move.
 * @property {function?} onInitialized Callback for when plugin finishes loading.
 * @property {function?} onMovedPage Callback for when page moves.
 * @property {function?} onNextPage Callback for when the form goes to the next page.
 * @property {function?} onPrevPage Callback for when the form goes to the previous page.
 * @property {function?} onSubmitForm Callback for when the form gets submitted.
 * @property {function?} onRecalculateContainerHeight Callback for when the form's container height is recalculated. Triggered **only** when `adaptiveContainerHeight` is true.
 * @property {function?} shouldMoveForwards Callback to validate if the form should move forwards. Useful for validation.
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
    NEXT_PAGE: `next.page.${EVENT_NAMESPACE_PREFIX}`,
    PREV_PAGE: `prev.page.${EVENT_NAMESPACE_PREFIX}`,
    INITIALIZED: `initialized.${EVENT_NAMESPACE_PREFIX}`,
    PAGE_MOVED: `moved.${EVENT_NAMESPACE_PREFIX}`,
    UPDATE_ADAPTIVE_CONTAINER_HEIGHT: `recalculate-height.${EVENT_NAMESPACE_PREFIX}`
  },
  PaginationDirection = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical"
  },
  CALLBACKS = [
    {
      name: "onNextPage",
      associatedEvent: Events.NEXT_PAGE
    },
    {
      name: "onPrevPage",
      associatedEvent: Events.PREV_PAGE
    },
    {
      name: "onInitialized",
      associatedEvent: Events.INITIALIZED
    },
    {
      name: "onMovedPage",
      associatedEvent: Events.PAGE_MOVED
    },
    {
      name: "onRecalculateContainerHeight",
      associatedEvent: Events.UPDATE_ADAPTIVE_CONTAINER_HEIGHT
    }
  ];


/** @type {FormPagesOptions} */
let defaults = {
  activePageClass: ".form-pages__page--active",
  adaptiveContainerHeight: true,
  formPageClass: ".form-pages__page",
  formPagesContainerClass: ".form-pages__page-container",
  formPagesContainerAdaptiveHeightClass: "form-pages__page-container--adaptive-height",
  nextButtonClass: ".form-pages__next-button",
  paginationDirection: PaginationDirection.HORIZONTAL,
  prevButtonClass: ".form-pages__prev-button",
  submitButtonClass: ".form-pages__submit-button",
  onInitialized() { },
  onNextPage() { },
  onPrevPage() { },
  shouldMoveForwards() {
    return true;
  },
  onMovedPage() { },
  onRecalculateContainerHeight() { }
};

/**
 * @class
 * @description Creates the FormPages component.
 * @property {jQuery} $element The form which the plugin is constructed upon.
 * @property {FormPagesOptions} options
 * @property {jQuery} $formPagesContainer The container of the pages
 * @property {jQuery} $pages The available pages
 * @property {number} currentPage The current page index, starting on zero.
 * @param {jQuery!} element The main form element.
 * @param {FormPagesOptions?} options
 */
function FormPages( element, options ) {
  this.$element = $( element );
  this.options = $.extend( {}, defaults, options );

  this.$formPagesContainer = $( "<div></div>" );
  this.$pages = null;

  // Control variables
  this.currentPageIndexIndex = 0;

  this._defaults = defaults;
  this._name = PLUGIN_NAME;

  this.getOptionsSelectorAlphaChars = getOptionsSelectorAlphaChars.bind( this );

  init.call( this );
}

/**
 * Initializes the plugin.
 */
function init() {
  const self = this;

  this.$pages = this.$element.find( this.options.formPageClass );

  // Adding the form pages container class to the $formPagesContainer.
  this.$formPagesContainer.addClass(
    this.getOptionsSelectorAlphaChars( "formPagesContainerClass" ) );

  // Step 1: Add the correspondent classes
  // Removing the active classes from the pages as a way to prevent wrongly
  // presented pages, then we add the active page class to the first page.
  this.$pages
    .removeClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) )
    .first()
    .addClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) );

  // Step 2: Move the pages to the container
  this.$pages.appendTo( this.$formPagesContainer );
  this.$element.append( this.$formPagesContainer );

  // Step 3: Configuring the default triggers.
  function configureDefaultTriggers() {

    // Proxying the configured event callbacks
    $.each( CALLBACKS, function( i, callback ) {
      const callbackFn = self.options[ callback.name ];
      if ( !callbackFn ) {
        return;
      }

      let eventData = { currentPage: self.currentPageIndexIndex };

      // Some special eventData treatment for some events.
      if ( callback.associatedEvent === Events.INITIALIZED ||
        callback.associatedEvent === Events.PAGE_MOVED ) {
        eventData = { instance: self };
      }

      // Adding the default configured callbacks to the events
      self.options[ callback.name ] = callbackFn.bind( self.$element,
        eventData );

      callback.associatedEvent && self.on( callback.associatedEvent,
        self.options[ callback.name ] );
    } );

    self.options.shouldMoveForwards = self.options.shouldMoveForwards.bind( self );

    // If valid, we always move on next or previous events.
    self.on( Events.PREV_PAGE, function() {
      self.goToPrevPage();
    } );

    self.on( Events.NEXT_PAGE, function() {
      self.goToNextPage();
    } );

    self.on( Events.UPDATE_ADAPTIVE_CONTAINER_HEIGHT, updateAdaptiveContainerHeight.bind( self ) );

    self.on( "click", function( e ) {
      const $currentTarget = $( e.currentTarget );

      // We should prevent default when clicked on "next" or "prev" buttons.
      // to avoid sending the form.
      // We manually check if the form can move forwards or backwards so
      // that we avoid triggering the event when the movement is out of
      // boundaries.
      console.group( "Responding to the 'click' navigation buttons:" );
      if ( $currentTarget.is( self.options.prevButtonClass ) ) {
        console.log( "Previous button clicked" );
        e.preventDefault();
        console.log( `self.canMoveBackwards(): ${self.canMoveBackwards()}` );
        self.canMoveBackwards() && self.trigger( Events.PREV_PAGE );
      } else if ( $currentTarget.is( self.options.nextButtonClass ) ) {
        console.log( "Next button clicked" );
        e.preventDefault();
        console.log( `self.canMoveForwards(): ${self.canMoveForwards()}` );
        console.log( `self.options.shouldMoveForwards(): ${self.options.shouldMoveForwards()}` );
        self.canMoveForwards() &&
          self.options.shouldMoveForwards() &&
          self.trigger( Events.NEXT_PAGE );
      }
      console.groupEnd();
    }, `${self.options.prevButtonClass}, ${self.options.nextButtonClass}` );
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

  if ( self.options.adaptiveContainerHeight ) {
    console.log( `Should have adaptive height: ${self.options.adaptiveContainerHeight}` );
    self.$formPagesContainer
      .addClass( self.options.formPagesContainerAdaptiveHeightClass )
      .height( self.getCurrentPageElement().height() );
    self.on( Events.PAGE_MOVED, adaptContainerHeightOnChangePage.bind( self ) );
  }

  self.options.onInitialized.call( this, this );

  // Configuring window resize trigger to recalculate the pages translation
  $( window ).on( "resize", function() {
    self.translateToPage( self.currentPageIndexIndex );
  } );
}

/**
 * Adapts the container height when page changed.
 */
function adaptContainerHeightOnChangePage() {
  console.group( "adaptContainerHeightOnChangePage" );
  console.log( "this.getCurrentPageElement():", this.getCurrentPageElement() );
  this.trigger( Events.UPDATE_ADAPTIVE_CONTAINER_HEIGHT );
  console.groupEnd();
};

/**
 * If the `adaptiveContainerHeight` is set to true, this function recalculates
 * the height of the container.
 */
function updateAdaptiveContainerHeight() {
  if ( !this.options.adaptiveContainerHeight ) {
    return;
  }

  this.$formPagesContainer.css( "height", this.getCurrentPageElement().height() );
};

/**
 * Makes a proxy and calls events to the main `$element` object, passing the
 * current page as event data.
 * @param {string} eventName
 * @param {object} params Params passed to the jQuery trigger function to be attached as event data.
 */
FormPages.prototype.trigger = function( eventName, params = {} ) {
  this.$element.trigger( eventName, $.extend( {}, params,
    {
      currentPage: this.currentPageIndexIndex,
      formPagesContainer: this.$formPagesContainer,
      currentPageElement: this.getCurrentPageElement()
    } ) );
};

/**
 * Configures events to the plugin
 * @param {string} eventName
 * @param {function} cb Event callback
 * @param {string} filter
 * See {@tutorial event-handling}
 */
FormPages.prototype.on = function( eventName, cb, filter = null ) {
  this.$element.on( eventName, filter, {
    currentPage: this.currentPageIndexIndex,
    formPagesContainer: this.$formPagesContainer,
    currentPageElement: this.getCurrentPageElement()
  }, cb );
};

/**
 * Checks if the pages can move forwards.
 * @return {boolean}
 */
FormPages.prototype.canMoveForwards = function() {
  return this.currentPageIndexIndex + 1 < this.getTotalPages();
};

/**
 * Checks if the pages can move backwards.
 * @return {boolean}
 */
FormPages.prototype.canMoveBackwards = function() {
  return this.currentPageIndexIndex - 1 >= 0;
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
 * @param {number} page the page index - 1
 * @return {number} The current page or the page the component moved to.
 */
FormPages.prototype.goTo = function( page ) {
  console.group( `goTo(${page})` );

  /** @type {Direction} */
  let movingDirection = "next";

  // Page must be bigger than zero and less than the total pages
  if ( !( page < 0 || page > this.getTotalPages() ) ) {
    movingDirection = page > this.currentPageIndexIndex ? "next" : "prev";
    this.currentPageIndexIndex = page;
    console.log( `page: ${page}` );
    console.log( `this.currentPageIndexIndex: ${this.currentPageIndexIndex}` );
  } else {
    movingDirection = "none";
  }

  if ( movingDirection === "none" ) {
    return this.currentPageIndexIndex;
  }

  console.log( `movingDirection: ${movingDirection}` );

  // Animating the pages
  const $activePage = this.$formPagesContainer.find( this.options.activePageClass );

  $activePage
    .removeClass( this.getOptionsSelectorAlphaChars( "activePageClass" ) );
  this.translateToPage( page );

  console.groupEnd();

  // Triggering PAGE_MOVED event.
  this.trigger( Events.PAGE_MOVED );

  return this.currentPageIndexIndex;
};

/**
 * Translates the page to show the active one. Useful when page resizes.
 * @param {number} page
 * @todo make the translation works on Y axis.
 * @private
 */
FormPages.prototype.translateToPage = function( page ) {
  console.group( `translateToPage(${page})` );
  console.log( `currentPage: ${this.currentPageIndexIndex}` );

  // $nextPageToBeShown can be the previous page also. "next" in this case does
  // not imply direction or position.
  let $nextPageToBeShown = this.$formPagesContainer
    .find( this.options.formPageClass ).eq( page ),
    translationX =
      `${this.getPageDimensions().width * ( this.currentPageIndexIndex )}`;

  console.log( "$nextPageToBeShown: ", $nextPageToBeShown );

  if ( page > this.currentPageIndexIndex - 1 ) {
    console.log( "this.currentPageIndexIndex > page: ", this.currentPageIndexIndex > page );
    translationX = `-${translationX}`;
  }

  $nextPageToBeShown.addClass(
    this.getOptionsSelectorAlphaChars( "activePageClass" ) );
  this.$formPagesContainer.css( "transform",
    `translateX(${translationX}px)` );
  console.groupEnd();
};

/**
 * Tries to move the form to the next page and returns the current page.
 * @return {number} The page the component moved to or the current page.
 */
FormPages.prototype.goToNextPage = function() {
  console.group( "goToNextPage()" );
  console.log( "shouldMoveForwards() ", this.options.shouldMoveForwards() );
  console.log( "this.currentPageIndexIndex: " + this.currentPageIndexIndex );
  console.groupEnd();
  return this.options.shouldMoveForwards() ?
    this.goTo( this.currentPageIndexIndex + 1 ) :
    this.currentPageIndexIndex;
};

/**
 * Tries to move the form to the previous page and returns the current page.
 * @return {number} The page the component moved to or the current page.
 */
FormPages.prototype.goToPrevPage = function() {
  console.group( "goToNextPage()" );
  console.log( "shouldMoveForwards() ", this.options.shouldMoveForwards() );
  console.log( "this.currentPageIndexIndex: " + this.currentPageIndexIndex );
  console.groupEnd();
  return this.goTo( this.currentPageIndexIndex - 1 );
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
    $pageEl = this.$element.find( this.options.formPageClass )
      .eq( pageNumber - 1 );
  result.width = $pageEl.outerWidth();
  result.height = $pageEl.outerHeight();

  return result;
};

/**
 * Gets the active page as jQuery object.
 *
 * @returns {jQuery|null}
 */
FormPages.prototype.getCurrentPageElement = function() {
  return this.$element.find( this.options.formPageClass ).eq( this.currentPageIndexIndex );
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
