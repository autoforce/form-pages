const path = require('path');

/**
 * Gets a fixture.
 * @param {string} file
 * @returns {string} The fixture path
 */
export function fixture(file) {
  return path.resolve(__dirname, `fixtures/${file}`);
}

/**
 * Gets a lib resource to use on tests.
 * @param {string} file
 * @returns {string} The resource path
 */
export function libResource(file, distResource = true) {
  return path.resolve(__dirname,
    `${distResource ? '../dist/' : '../src'}${file}`);
}