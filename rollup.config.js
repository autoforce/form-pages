import { uglify } from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

let plugins = [
    babel({
      exclude: "node_modules/**",
      externalHelpers: true
    })
  ],
  config = {
    input: "./src/form-pages.js",
    output: {
      file: "./dist/form-pages.js",
      format: "iife"
    },
    plugins
  };

// Default config object to development
config = Object.assign({}, config, { plugins });

switch (process.env.BUILD) {
  case "production":
    plugins.push(uglify());
    config = Object.assign({}, config, {
      input: "./src/form-pages.js",
      output: {
        file: "./dist/form-pages.min.js",
        format: "iife"
      },
      plugins
    });
    break;
}

export default config;
