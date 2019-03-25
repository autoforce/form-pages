import { uglify } from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

let config = {},
  plugins = [
    babel()
  ];

switch (process.env.BUILD) {
  case "development":
    config = {
      input: "./src/form-pages.js",
      output: {
        file: "./dist/form-pages.js",
        format: "iife"
      }
    };
    break;
  case "production":
    plugins.push(uglify());
    config = {
      input: "./src/form-pages.js",
      output: {
        file: "./dist/form-pages.min.js",
        format: "iife"
      },
      plugins
    };
    break;
}

export default config;
