'use strict';

// Dependency
var path = require( 'path' );
var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var webpack = require( 'webpack' );
var localIp = require( './local-ip' );
var webpackConfig = require( './webpack.config.js' );
var WebpackDevServer = require( 'webpack-dev-server' );

// Private methods
var hook_stream = function( stream, data, cb ) {
  // Reference default write method
  var old_write = stream.write;
  
  // Clear hook function
  var clear_hook = function() {
    stream.write = old_write;
  };
  
  // New stream write with our shiny function
  stream.write = function() {
    // Old behaviour
    old_write.apply( stream, arguments );
    // Hook
    if ( arguments[ 0 ] === data ) {
      clear_hook();
      cb();
    }
  };
};

// Public register task method
module.exports = function( ops ) {
  gulp.task( 'server', function() {
    var config = Object.create( webpackConfig( ops ) );
    var entry = Object.keys( config.entry );
    
    config.plugins.push( new webpack.HotModuleReplacementPlugin() );
    config.plugins.push( new webpack.NoErrorsPlugin() );
    for ( var i = entry.length; i--; ) {
      config.entry[ entry[ i ] ].push( 'webpack/hot/dev-server' );
    }
    config.devtool = 'eval';
    config.inline = true;
    
    var server = new WebpackDevServer( webpack( config ), {
      contentBase: './build',
      publicPath: '',
      hot: true,
      debug: true,
      inline: true,
      stats: {
        colors: true
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
      ]
    } );
    
    server.listen( 9999, localIp, function( err ) {
      hook_stream( process.stdout, 'webpack: bundle is now VALID.\n', function() {
        gutil.log( '[dev-server]', gutil.colors.yellow( 'http://' + localIp + ':9999/webpack-dev-server/' ) );
      } );
      
      if ( err ) {
        console.log( err );
      }
    } );

    server.app.get( '/tracker/*', function( req, res ) {
      res.sendFile( path.join( __dirname, '../src/help', req.url.replace( /tracker\//, '' ) ) );
    } );
  } );
};