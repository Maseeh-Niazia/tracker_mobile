'use strict';

// Dependency
var gulp = require( 'gulp' );
var clean = require( 'gulp-clean' );
var fs = require( 'fs-extra' );

// Public register task method
module.exports = function( ops ) {
  gulp.task( 'clean', function() {
    gulp.src( './build/*' , { read: false } )
      .pipe( clean() );
    fs.removeSync('./build/help/*');
  } );
};
