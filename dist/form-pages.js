(function () {
  'use strict';

  /**
    * @typedef {('horizontal'|'vertical')} PaginationDirection
    */

  /**
   * @typedef {('next'|'prev')} Direction
   */

  /**
   * @typedef {Object} FormPagesOptions
   * @property {string} formPageClass The selector which will separate the form pages
   * @property {string} activePageClass The active page selector
   * @property {string} nextButtonClass The selector for the "next" button
   * @property {string} prevButtonClass The selector for the "previous" button
   * @property {string} formPagesContainerClass The selector for the pages container which holds all the pages
   * @property {string} submitButtonClass The selector for the form submit button
   * @property {PaginationDirection} paginationDirection The direction that the form will move
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
   * @typedef {{NEXT_PAGE: string}, {PREV_PAGE: string}} EventList
   */

  /**
   * @typedef {{width: number, height: number}} Dimensions
   */
  (function ($, window, document, undefined$1) {
    /** @type {FormPagesOptions} defaults */
    var defaults = {
      formPageClass: ".form-pages__page",
      nextButtonClass: ".form-pages__next-button",
      prevButtonClass: ".form-pages__prev-button",
      submitButtonClass: ".form-pages__submit-button",
      paginationDirection: "horizontal",
      activePageClass: ".form-pages__page--active",
      formPagesContainerClass: ".form-pages__page-container"
    },
        $formPagesContainer = $("<div></div>"),
        $pages;
    var PLUGIN_NAME = "formPages",
        EVENT_NAMESPACE_PREFIX = "fp",

    /** @type {EventList} */
    Events = {
      NEXT_PAGE: "next.".concat(EVENT_NAMESPACE_PREFIX, ".page"),
      PREV_PAGE: "prev.".concat(EVENT_NAMESPACE_PREFIX, ".page")
    },
        PaginationDirection = {
      HORIZONTAL: "horizontal",
      VERTICAL: "vertical"
    };
    /**
     * Gets the alphanumeric part of an option selector. Also memoizes the
     * arguments execute faster in other calls.
     * @example
     * // returns form-pages__page
     * getOptionsSelectorAlphaChars('formPageClass')
     * @param {string} key
     * @return {string}
     */

    var getOptionsSelectorAlphaChars = function () {
      var memo = {};
      return function (key) {
        memo[key] = memo[key] || this.options[key].replace(/^(.|#)/gm, "");
        return memo[key];
      };
    }();
    /**
     * Creates the FormPages component
     * @class
     * @param {jQuery} element The main form element
     * @param {FormPagesOptions} options
     * @extends FormPages
     */


    function FormPages(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, defaults, options); // Control variables

      this.currentPage = 1;
      this._defaults = defaults;
      this._name = PLUGIN_NAME;
      getOptionsSelectorAlphaChars = getOptionsSelectorAlphaChars.bind(this);
      this.init();
    }

    FormPages.prototype.trigger = function (triggerName, params) {
      this.$element.trigger(triggerName, params);
    };

    FormPages.prototype.on = function (eventName, cb) {
      this.$element.on(eventName, cb);
    };

    FormPages.prototype.init = function () {
      var self = this;
      $pages = this.$element.find(this.options.formPageClass); // Adding the form pages container class to the $formPagesContainer.

      $formPagesContainer.addClass(getOptionsSelectorAlphaChars("formPagesContainerClass")); // Step 1: Add the correspondent classes
      // Removing the active classes from the pages as a way to prevent wrongly
      // presented pages, then we add the active page class to the first page.

      $pages.removeClass(getOptionsSelectorAlphaChars("activePageClass")).first().addClass(getOptionsSelectorAlphaChars("activePageClass"));
      $pages.appendTo($formPagesContainer);
      this.$element.append($formPagesContainer); // Step 2: Move the pages to the container
      // Step 3: Configuring the default triggers.

      function configureDefaultTriggers() {
        self.on("click", function (e) {
          var $target = $(e.target); // We should prevent default when clicked on "next" or "prev" buttons to avoid sending the form

          if ($target.is(self.options.prevButtonClass)) {
            e.preventDefault();
            self.trigger(Events.PREV_PAGE, {
              currentPage: self.goToPrevPage()
            });
          } else if ($target.is(self.options.nextButtonClass)) {
            e.preventDefault();
            self.trigger(Events.NEXT_PAGE, {
              currentPage: self.goToNextPage()
            });
          }
        });
      }

      function configureContainerFormClasses() {
        var classes = "form-pages--active";

        if (self.options.paginationDirection === PaginationDirection.VERTICAL) {
          classes += " form-pages--vertical";
        }

        self.$element.addClass(classes);
      }
      /**
       * Here we analyze what dimensions really matters and set them
       */


      function configurePagesDimensions() {

        if (self.options.paginationDirection === PaginationDirection.VERTICAL) ;
      }

      configureDefaultTriggers();
      configureContainerFormClasses();
      configurePagesDimensions();
    };
    /**
     * @return {number}
     */


    FormPages.prototype.getTotalPages = function () {
      return this.$element.find(this.options.formPageClass).length;
    };
    /**
     * Tries to move the form to a specific page
     * @return {number}
     */


    FormPages.prototype.goTo = function (page) {
      /** @type {Direction} */
      var movingDirection = "next"; // Page must be bigger than zero and less than the total pages

      if (!(page <= 0 || page > this.getTotalPages())) {
        movingDirection = page > this.currentPage ? "next" : "prev";
        this.currentPage = page;
      } // Animating the pages


      var $activePage = $pages.parent().find(this.options.activePageClass);
      $activePage.removeClass(this.options.activePageClass); // Can be the previous page also. "next" in this case does not imply direction or position.

      var $nextPageToBeShown; // Verifyting the direction

      switch (movingDirection) {
        case "next":
          $nextPageToBeShown = $activePage.next();
          break;

        case "prev":
          $nextPageToBeShown = $activePage.prev();
          break;
      }

      $nextPageToBeShown.addClass(getOptionsSelectorAlphaChars("activePageClass"));
      return this.currentPage;
    };
    /**
     * Tries to move the form to the next page and returns the current page
     * @return {number}
     */


    FormPages.prototype.goToNextPage = function () {
      return this.goTo(this.currentPage + 1);
    };
    /**
     * Tries to move the form to the prev page and returns the current page
     * @return {number}
     */


    FormPages.prototype.goToPrevPage = function () {
      return this.goTo(this.currentPage - 1);
    };

    FormPages.prototype.getParentDimensions = function () {
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


    FormPages.prototype.getPageDimensions = function (pageNumber) {
      /** @type {Dimensions} */
      var result = {},
          $pageEl = this.$element.find(this.options.formPageClass).eq(pageNumber);
      result.width = $pageEl.outerWidth();
      result.height = $pageEl.outerHeight();
      return result;
    };
    /**
     * @param {FormPagesOptions} options
     */


    $.fn[PLUGIN_NAME] = function (options) {
      return this.each(function () {
        if (!$.data(this, "plugin_" + PLUGIN_NAME)) {
          $.data(this, "plugin_" + PLUGIN_NAME, new FormPages(this, options));
        }
      });
    };
  })(jQuery, window, document);

}());
