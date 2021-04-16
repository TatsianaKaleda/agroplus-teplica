"use strict";


/* GULP */
const { src, dest } = require("gulp");
const gulp = require("gulp");


/* HTML */
const panini = require("panini"); //deleted


/* CASS */
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const removeComments = require("gulp-strip-css-comments");


/* JS */
const plumber = require("gulp-plumber");
const include = require("gulp-include");
const babel = require("gulp-babel");
const minify = require("gulp-babel-minify");


/* Life server */
const browserSync = require("browser-sync").create();
const del = require("del");


/* Helpers */
const rename = require("gulp-rename");
const notify = require("gulp-notify");


/* Path */
const srcPath = "src/";
const distPath = "dist/";

const path = {
     build: {
          html:    "index.html",
          js:      distPath + "/js",
          css:     distPath + "/css"
     },
     src: {
          html:    "index.html",
          js:      srcPath + "js/*.js",
          css:     srcPath + "sass/style.scss"
     },
     watch: {
          html:    "index.html",
          js:      srcPath + "js/**/*.js",
          css:     srcPath + "sass/**/*.scss"
     },
     clean: "./" + distPath
}


/* Tasks */
function serve() {
     browserSync.init({
          server: {
               baseDir: "./"
          },
          port: 3000
     });
}

function html(cb) {
     return src(path.src.html, { base: "./" })
          .pipe(browserSync.reload({ stream: true }));
}

function css(cb) {
     return src(path.src.css, { base: srcPath + "sass/" })
          .pipe(plumber({
               errorHandler: function(err) {
                    notify.onError({
                         title:    "SCSS Error",
                         message:  "Error <%= error.message %>"
                    })(err);
                    this.emit('end');
               }
          }))
          .pipe(sass({
               includePaths: './node_modules/'
          }))
          .pipe(autoprefixer({
               cascade: true,
               overrideBrowserslist:  ["last 8 versions"]
          }))
          .pipe(cssnano({
               zindex: false,
               discardComments: {
                    removeAll: true
               }
          }))
          .pipe(removeComments())
          .pipe(rename({
               suffix: ".min",
               extname: ".css"
          }))
          .pipe(dest(path.build.css))
          .pipe(browserSync.reload({ stream: true }));

     cb();
}

function js(cb) {
     return src(path.src.js, { base: srcPath + "js/" })
          .pipe(plumber({
               errorHandler: function(err) {
                    notify.onError({
                         title:    "JS Error",
                         message:  "Error <%= error.message %>"
                    })(err);
                    this.emit('end');
               }
          }))
          .pipe(include())
          .pipe(babel({
               presets: ['@babel/preset-env']
          }))
          .pipe(minify({
               mangle: {
                 keepClassName: true
               }
          }))
          .pipe(rename({
               suffix: ".min",
               extname: ".js"
          }))
          .pipe(dest(path.build.js))
          .pipe(browserSync.reload({ stream: true }));

     cb();
}

function clean(cb) {
     return del(path.clean);

     cb();
}

function watchFiles() {
     gulp.watch([path.watch.html],    html);
     gulp.watch([path.watch.css],     css);
     gulp.watch([path.watch.js],      js);
}

const build = gulp.series(clean, gulp.parallel(html, css, js));
const watch = gulp.parallel(build, watchFiles, serve);


/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;