'use strict';

// Dependency
var gulp = require( 'gulp' );
var eslint = require('gulp-eslint');

// Privat methods
var onError = function() {
  gulp.fail = true;
};

// Public register task method
module.exports = function() {
  gulp.task( 'eslint', function() {
    return gulp.src( [ 'src/**/*.js' ] )
      .pipe( eslint() )
      .pipe( eslint.format() )
      .pipe( eslint.failOnError() )
      .on( 'error', onError );
  } );
}