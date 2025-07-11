// npm init -y
// npm install gulp sass node-sass gulp-sass gulp-concat gulp-uglify gulp-inject-views --save-dev

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const inject = require('gulp-inject-views');

const paths = {

  styles: {
    src: './src/scss/**/*.scss',
    dest: './src/css/',
  },

  scripts: {
    src: './src/js/*.js',
    dest: './dist/',
  }

};

function css() {
  return gulp
  .src(paths.styles.src)
  .pipe(sass({style: 'compressed'}).on('error', sass.logError))
  .pipe(concat('chatbot.min.css'))
  .pipe(gulp.dest(paths.styles.dest))
}

exports.css = css;

function js() {
  return gulp
  .src(paths.scripts.src)
  .pipe(concat('chatbot.min.js'))
  .pipe(inject())
  .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest))
}

exports.js = js;

function watch() {
  gulp.watch(paths.styles.src, css);
  gulp.watch(paths.scripts.src, js);
}

exports.watch = watch; //CLI use "gulp watch"