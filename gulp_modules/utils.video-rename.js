'use strict';

// Dependency
var fs = require( 'fs' );
var gutil = require( 'gulp-util' );

// Constants
var _ROOT = '../';
var _APPS = 'src/tracker/applications/';
var _NAME = process.argv.slice( 2 )[ 0 ];
var _FOLDER = _APPS + _NAME;
var _TARGET = _FOLDER + '/video';

var _N = 2; // power of number of files, default value

// Private methods
var getTotalPower = function( n ) {
  var total = 0;
  while( n >= 1 ) {
    n = n / 10;
    total += 1;
  }
  return total;
};

var errorNameModel = function() {
  gutil.log( gutil.colors.red( 'Error:' ), gutil.colors.white( 'no model name entered.' ) );
};

var folderNotExists = function( folder ) {
  gutil.log( gutil.colors.red( 'Error:' ), gutil.colors.white( 'Folder' ), gutil.colors.yellow( folder ), gutil.colors.white( 'does not exist.' ) );
};

var foundFiles = function( n ) {
  _N = getTotalPower( n );
  gutil.log( gutil.colors.green( 'Found' ), gutil.colors.yellow( n ), gutil.colors.green( 'files:' ) );
};

var fileNotCorrectType = function( file ) {
  gutil.log( gutil.colors.white( '> File' ), gutil.colors.yellow( file ), gutil.colors.red( 'is not jpg image file.' ) );
};

var fileWasRenamed = function( file, newFile ) {
  gutil.log( gutil.colors.white( '> File' ), gutil.colors.yellow( file ), gutil.colors.green( 'renamed to' ), gutil.colors.yellow( newFile ) );
};

var buildPath = function( file ) {
  return _TARGET + '/' + file;
};

var getPostFix = function( n ) {
  n = n.toString();
  for ( var i = _N - n.length; i--; ) {
    n = '0' + n;
  }
  return n;
};

var renameFile = function( file, n ) {
  var newFile = 'frame-' + getPostFix( n ) + '.jpg';
  
  fs.rename( buildPath( file ), buildPath( newFile ), function( err ) {
    if ( err ) {
      console.log( err );
    } else {
      fileWasRenamed( file, newFile );
    }
  } );
};

var renameFiles = function() {
  fs.readdir( _TARGET, function( err, files ) {
    if ( err ) {
      console.log( err );
    }
    
    foundFiles( files.length );
    
    for ( var i = 0, l = files.length; i < l; i++ ) {
      if ( files[ i ].match( /\.jpg$/ ) ) {
        renameFile( files[ i ], i );
      } else {
        fileNotCorrectType( files[ i ] );
      }
    }
  } );
};

// Main entry point
if ( !_NAME ) {
  errorNameModel();
  process.abort();
}

fs.exists( _FOLDER, function( existed ) {
  if ( existed ) {
    fs.exists( _TARGET, function( existed ) {
      if ( existed ) {
        renameFiles();
      } else {
        folderNotExists( _TARGET );
      }
    } );
  } else {
    folderNotExists( _FOLDER );
  }
} );
