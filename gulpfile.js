'use strict';
const gulp       = require('gulp'),
      gutil      = require('gulp-util'),
      bower      = require('bower'),
      concat     = require('gulp-concat'),
      jade       = require('gulp-jade'),
      babel      = require('gulp-babel'),
      sourcemaps = require('gulp-sourcemaps'),
      sass       = require('gulp-sass'),
      minifyCss  = require('gulp-minify-css'),
      rename     = require('gulp-rename'),
      sh         = require('shelljs');

const paths = {
  img  : ['src/img/**/*'],
  jade : ['src/**/*.jade'],
  js   : ['src/js/**/*.js'],
  sass : ['src/scss/**/*.scss']
};

gulp.task('lib', function() {
  return gulp.src('lib/**/*')
    .pipe(gulp.dest('www/lib'))
});

// TODO: Replace with ImageMagick
gulp.task('img', function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('www/img'))
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }).on('error', console.error))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('www/js'));
});

gulp.task('jade', function () {
  gulp.src(paths.jade)
    .pipe(jade({
      //locals: YOUR_LOCALS
    }).on('error', console.error))
    .pipe(gulp.dest('www'))
});

gulp.task('default', ['sass', 'js', 'jade', 'lib', 'img']);

gulp.task('sass', function(done) {
  gulp.src('src/scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('www/css/'))
    .on('end', done);
});

gulp.task('watch', ['default'], function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.img, ['img']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
