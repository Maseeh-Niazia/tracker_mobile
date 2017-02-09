'use strict';

// Dependency
var fs = require( 'fs' );
var gutil = require( 'gulp-util' );

// Constants
var _ROOT = '../';
var _APPS = 'src/tracker/applications/';
var _NAME = process.argv.slice( 2 )[ 0 ];
var _FOLDER = _APPS + _NAME;
var _TARGET = _FOLDER + '/objects';

// Private methods
var errorNameModel = function() {
  gutil.log( gutil.colors.red( 'Error:' ), gutil.colors.white( 'no model name entered.' ) );
};

var folderNotExists = function( folder ) {
  gutil.log( gutil.colors.red( 'Error:' ), gutil.colors.white( 'Folder' ), gutil.colors.yellow( folder ), gutil.colors.white( 'does not exist.' ) );
};

var foundFiles = function( n ) {
  gutil.log( gutil.colors.green( 'Found' ), gutil.colors.yellow( n ), gutil.colors.green( 'files:' ) );
};

var fileNotCorrectType = function( file ) {
  gutil.log( gutil.colors.white( '> File' ), gutil.colors.yellow( file ), gutil.colors.red( 'is not txt file.' ) );
};

var fileWasConverted = function( file, newFile ) {
  gutil.log( gutil.colors.white( '> File' ), gutil.colors.yellow( file ), gutil.colors.green( 'converted to' ), gutil.colors.yellow( newFile ) );
};

var getFileLines = function( data ) {
  data = data.replace( /\r/g, '' );
  data = data.replace( /,/g, '.' );
  return data.split( '\n' );
};

var getDataParams = function( str ) {
  str = '\'' + str + '\'';
  str = str.replace( /\|/g, '\'|\'' );
  str = str.replace( /\{|\}/g, '' );
  
  return str.split( '|' );
};

var createFileData = function( lines ) {
  var params = getDataParams( lines[ 1 ]  );
  var result = '\'use strict\';\n';
  result += '\n';
  result += 'module.exports = {\n';
  result += '  name: \'' + lines[ 0 ] + '\',\n';
  result += '  type: \'point\',\n';
  result += '  color: [ , , , ],\n';
  result += '  params: [ ' + params.join( ', ' ) + ' ],\n';
  result += '  start: 0,\n';
  result += '  track: false,\n';
  result += '  frames: [\n';
  for ( var i = 2, l = lines.length; i < l; i++ ) {
    if ( lines[ i ] ) {
      result += '    [ ' + lines[ i ].replace( /\|/g, ', ' ) + ' ],\n';
    }
  }
  result += '  ]\n';
  result += '};';
  return result;
};

var buildPath = function( file ) {
  return _TARGET + '/' + file;
};

var converFile = function( file ) {
  fs.readFile( buildPath( file ), 'utf8', function( err, data ) {
    if ( err ) {
      console.log( err );
    } else {
      var lines = getFileLines( data );
      var newFile = lines[ 0 ] + '.js';
      var newFileData = createFileData( lines );
      fs.writeFile( buildPath( newFile ), newFileData,'utf8', function ( err ) {
        if ( err ) {
          console.log( err );
        } else {
          fileWasConverted( file, newFile );
        }
      } );
    }
  } );
};

var convertDataFiles = function() {
  fs.readdir( _TARGET, function( err, files ) {
    if ( err ) {
      console.log( err );
    }
    
    foundFiles( files.length );
    
    for ( var i = 0, l = files.length; i < l; i++ ) {
      if ( files[ i ].match( /\.txt$/ ) ) {
        converFile( files[ i ] );
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
        convertDataFiles();
      } else {
        folderNotExists( _TARGET );
      }
    } );
  } else {
    folderNotExists( _FOLDER );
  }
} );
