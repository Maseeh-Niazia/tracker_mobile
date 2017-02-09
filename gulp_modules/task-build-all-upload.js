'use strict';

// Dependency
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );

var vfs = require( 'vinyl-fs' );
var ftp = require( 'vinyl-ftp' );

// Public register task method
var buildDir = './build/dest';

var options = {
  user: '***',
  password: '***',
  parallel: 10,
  host: '***',
  port: 21 
};

module.exports = function() {
  gulp.task( 'build-upload', function() {
    var conn = ftp.create( options ); 
    
    return gulp.src( [ buildDir + '/**' ], { buffer: false } )
      .pipe( conn.dest( '/edmsst-tracker' ) );
  } );
};