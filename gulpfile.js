const gulp = require('gulp');
const cssNano = require('gulp-cssnano');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const autoPrefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const del = require('del');

function cleanDist() {
  return del('dist');
}

function cleanTemp() {
  return del('temp');
}

function jsLibs() {
  return gulp.src(['node_modules/@babel/polyfill/dist/polyfill.min.js']).pipe(concat('lib.js')).pipe(gulp.dest('temp'));
}

function jsTranspile() {
  return gulp
    .src('app/js/*.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('temp'));
}

function jsBundle() {
  return gulp
    .src(['temp/lib.js', 'temp/main.js'])
    .pipe(concat('script.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
}

function cssTranspile() {
  return gulp
    .src('app/scss/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(cssNano())
    .pipe(
      autoPrefixer({
        cascade: false
      })
    )
    .pipe(gulp.dest('temp'));
}

function cssBundle() {
  return gulp
    .src(['temp/main.css', 'node_modules/@fortawesome/fontawesome-free/css/all.min.css'])
    .pipe(concat('style.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
}

function copyWebfonts() {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**/*').pipe(gulp.dest('dist/webfonts'));
}

function copyHtml() {
  return gulp
    .src('app/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
}

function copyAssets() {
  return gulp.src('app/assets/**/*').pipe(gulp.dest('dist/assets'));
}

const BUILD_CSS = gulp.series(cssTranspile, cssBundle, cleanTemp);
const BUILD_JS = gulp.series(jsLibs, jsTranspile, jsBundle, cleanTemp);
const BUILD_ALL = gulp.series(cleanDist, BUILD_CSS, BUILD_JS, copyHtml, copyAssets, copyWebfonts);

gulp.watch('app/scss/**/*.scss', BUILD_CSS);
gulp.watch('app/js/*.js', BUILD_JS);
gulp.watch(['app/*.html', 'app/assets/**/*'], BUILD_ALL);

exports.default = BUILD_ALL;
