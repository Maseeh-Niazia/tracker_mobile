'use strict';

var fs = require( 'fs' );
var gutil = require( 'gulp-util' );
var argv = process.argv.slice( 2 );

// Get list of all applications
var applicationsALL = fs.readdirSync( './src/tracker/applications' );

// Build exclude regexp
var buildExludeRegExp = function( app ) {
  var list = applicationsALL ? applicationsALL.slice( 0 ) : [];
  var regExp = null, i, n;

  if ( list.length ) {
    n = list.indexOf( app );

    if ( n > -1 ) {
      list.splice( n, 1 );
    }

    for ( i = list.length; i--; ) {
      list[ i ] = list[ i ] + '\\\/' + '[^\\.]*\\.jpg';
    }

    regExp = new RegExp( list.join( '|' ) );
  }
  
  return regExp;
};

// Check application link
var applicationSRC = null;
var applicationNUM = Math.max( argv.indexOf( '-a' ), argv.indexOf( '-app' ) );  

if ( applicationNUM > -1 ) {
  var name = argv[ applicationNUM + 1 ];
  applicationSRC = './' + name + 'index.js';

  if ( !fs.existsSync( applicationSRC ) ) {
    gutil.log( '# Error: ', 'Application' , gutil.colors.red( name ), 'not found' );
    console.log( '.' + applicationSRC + 'index.js' );
    process.abort();
  }
}

// Public properties
module.exports = {
  src: applicationSRC,
  exclude: buildExludeRegExp,
  applications: applicationsALL
};