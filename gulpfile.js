const gulp = require("gulp");
const concat = require("gulp-concat-css");
const plumber = require("gulp-plumber");
const del = require("del");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const mediaquery = require("postcss-combine-media-query");
const cssnano = require("cssnano");
const htmlMinify = require("html-minifier");

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true,
  };
  return gulp
    .src("./src/**/*.html")
    .pipe(plumber())
    .on("data", function (file) {
      const buferFile = Buffer.from(
        htmlMinify.minify(file.contents.toString(), options)
      );
      return (file.contents = buferFile);
    })
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src("./src/**/*.css")
    .pipe(plumber())
    .pipe(concat("bundle.css"))
    .pipe(postcss(plugins))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp
    .src("./src/fonts/**/*.{woff2,woff,ttf}")
    .pipe(gulp.dest("dist/fonts"))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp
    .src("./src/images/**/*.{jpg,png,gif,ico,webp,avif}")
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.reload({ stream: true }));
}

function svg() {
  return gulp
    .src("./src/svg/**/*.svg")
    .pipe(gulp.dest("dist/svg"))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp
    .src("./src/scripts/**/*.js")
    .pipe(gulp.dest("dist/scripts"))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del("dist");
}

const build = gulp.series(
  clean,
  gulp.parallel(html, css, fonts, images, svg, scripts)
);

function watchFiles() {
  gulp.watch(["./src/**/*.html"], html);
  gulp.watch(["./src/**/*.css"], css);
  gulp.watch(["./src/fonts/**/*.{woff2,woff,ttf}"], fonts);
  gulp.watch(["./src/images/**/*.{jpg,png,gif,ico,webp,avif}"], images);
  gulp.watch(["./src/svg/**/*.svg"], svg);
  gulp.watch(["./src/scripts/**/*.js"], scripts);
}
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.fonts = fonts;
exports.images = images;
exports.svg = svg;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
