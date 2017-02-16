'use strict';

// Dependency
var fs = require( 'fs' );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var sequence = require( 'gulp-sequence' );
var params = require( './gulp_modules/gulp-params' );

// Build common options
var ops = {
  project: './src/tracker',
  src: params.src,
  entry: {
    'tracker'     : [ './src/tracker/engine/tracker/index' ],
    'application' : [ params.src ]
  },
  params: params
};

// Register sub tasks
require( './gulp_modules/task-clean' )( ops );
require( './gulp_modules/task-index' )( ops );
require( './gulp_modules/task-build' )( ops );
require( './gulp_modules/task-eslint' )( ops );
require( './gulp_modules/task-server' )( ops );
require( './gulp_modules/task-build-all-make' )();

// Task: build all
gulp.task( 'build', function( cb ) {
  sequence( 'clean', 'build-make', cb );
});

// Task: default web dev hot server
gulp.task( 'default:check', function( cb ) {
  if ( !ops.src ) {
    gutil.log( gutil.colors.red( 'Error:'), 'task', gutil.colors.green( 'default' ), 'need application link' );
    process.exit( 1 );
  }
  cb();
});

gulp.task( 'default', function( cb ) {
  sequence( 'default:check', 'clean', 'index', 'server', cb );
});
