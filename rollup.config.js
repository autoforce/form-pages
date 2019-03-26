import { uglify } from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import sass from "rollup-plugin-sass";
import livereload from "rollup-plugin-livereload";
import postcss from "postcss";
import cssnano from "cssnano";

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

switch (process.env.BUILD) {
  case "development":
    if (process.env.WATCH) {
      plugins.push(serve({
        contentBase: ['demo', 'dist', 'src']
      }), livereload({
        watch: ['demo', 'dist', 'src']
      }),
      sass({
        insert: true,
        output: false
      }));
    }
    plugins.push(sass({
      insert: false,
      output: true
    }));
    config = Object.assign({}, config, { plugins });
    break;
  case "production":
    plugins.push(
      uglify(),
      sass({
        insert: false,
        output: true,
        processor: css => postcss([cssnano])
          .process(css)
          .then(result => result.css)
      })
    );
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
