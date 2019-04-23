const path = require('path');
const basicFilePath = `file://${fixture('basic.html')}`;
const baseLibFile = libResource('form-pages.js');
const baseLibStyle = libResource('form-pages.css');

/**
 * Gets a fixture.
 * @param {string} file
 * @returns {string} The fixture path
 */
export function fixture(file) {
  return path.resolve(__dirname, `../fixtures/${file}`);
}

/**
 * Gets a lib resource to use on tests.
 * @param {string} file
 * @returns {string} The resource path
 */
export function libResource(file, distResource = true) {
  return path.resolve(__dirname,
    `${distResource ? '../../dist/' : '../../src'}${file}`);
}

/**
 * Configures the default environment to the tests
 */
export function configureDefaultEnvironment(test) {
  test.context.data = {
    basicFilePath,
    baseLibFile,
    baseLibStyle,
  };
}