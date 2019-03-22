import { uglify } from "rollup-plugin-uglify";
import sass from "rollup-plugin-sass";
import babel from 'rollup-plugin-babel';

let config = {},
  plugins = [
    babel(),
    sass({
      output: "form-pages.css"
    })
  ];

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
