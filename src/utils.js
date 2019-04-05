/**
 * @module Utils
 */

/**
* Gets the alphanumeric part of an option selector. Also memoizes the
* arguments execute faster in other calls.
* @example
* // returns "form-pages__page"
* getOptionsSelectorAlphaChars('formPageClass')
* @param {string} key
* @return {string}
*/
export let getOptionsSelectorAlphaChars = ( function() {
    let memo = {};

    return function( key ) {
        memo[ key ] = memo[ key ] || this.options[ key ].replace( /^(.|#)/gm, "" );
        return memo[ key ];
    };
} )();
