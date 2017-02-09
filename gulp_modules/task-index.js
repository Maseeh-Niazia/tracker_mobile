'use strict';

// Dependency
var gulp = require( 'gulp' );
var rename = require( 'gulp-rename' );

// Public register task method
module.exports = function() {
  gulp.task( 'index', function() {
    gulp.src( './gulp_modules/webpack.index.html' )
      .pipe( rename( 'index.html' ) )
      .pipe( gulp.dest( './build/' ) );
  } );
};