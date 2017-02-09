'use strict';

// Dependency
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var eslint = require('gulp-eslint');
var webpack = require( 'webpack' );
var webpackConfig = require( './webpack.config.js' );

// Privat methods
var onError = function() {
  gulp.fail = true;
};

// Public register task method
module.exports = function( ops ) {
  gulp.task( 'webpack:build', function( callback ) {
    var myConfig = Object.create( webpackConfig( ops ) );
    
    // modify some webpack config options
    myConfig.devtool = 'sourcemap';
    myConfig.plugins = myConfig.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    );
 
    // run webpack
    webpack( myConfig, function( err, stats ) {
      if ( err ) {
        throw new gutil.PluginError( 'build', err );
      }
      gutil.log('[webpack:build]', stats.toString({
        colors: true
      }));
      callback();
    });
  });
};