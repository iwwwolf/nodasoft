'use strict';

const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

// Load plugins

const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();



// Clean assets

function clear() {
  return src('./assets/*', {
          read: false
      })
      .pipe(clean());
}

// CSS function 

function css() {
  const source = './src/scss/main.scss';

  return src(source)
      .pipe(changed('./src/scss/*'))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
          overrideBrowserslist: ['last 2 versions'],
          cascade: false
      }))
      .pipe(rename({
          extname: '.min.css'
      }))
      .pipe(cssnano())
      .pipe(dest('./assets/css/'))
      .pipe(browsersync.stream());
}

// Watch files

function watchFiles() {
  watch('./src/scss/*', css);
}

// BrowserSync

function browserSync() {
  browsersync.init({
      server: {
          baseDir: './'
      },
      port: 3000
  });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, css);