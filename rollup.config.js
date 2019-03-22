import { uglify } from "rollup-plugin-uglify";

let config = {};

switch (process.env.NODE_ENV) {
  case "development":
    config = {
      input: "./src/form-pages.js",
      output: {
        file: "./dist/form-pages.js",
        format: "iife"
      }
    };
    break;
  default:
    // Production
    config = {
      input: "./src/form-pages.js",
      output: {
        file: "./dist/form-pages.min.js",
        format: "iife"
      },
      plugins: [uglify()]
    };
    break;
}

export default config;
