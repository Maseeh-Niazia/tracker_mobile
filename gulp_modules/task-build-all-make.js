'use strict';

// Dependency
var path = require( 'path' );
var gulp = require( 'gulp' );
var fs = require( 'fs-extra' );
var gutil = require( 'gulp-util' );
var webpack = require( 'webpack' );
var webpackConfig = require( './webpack.config.js' );

var vfs = require( 'vinyl-fs' );
var ftp = require( 'vinyl-ftp' );

// Privat methods
var onError = function() {
  gulp.fail = true;
};

// Get full data in format: MM.DD.YY
var getBuildFolderName = function() {
  var date = new Date(), day, month, year;
  // Get day
  day = date.getDate();
  day = ( day < 10) ? '0' + day : day;
  // Get month
  month = date.getMonth() + 1;
  month = ( month < 10) ? '0' + month : month;
  // Get year
  year = date.getFullYear().toString();
  year = year.substring( 2 );

  // Build destination folder name
  return 'build-' + [ month, day, year ].join( '.' );
};

var startTime = 0;
var endCallback = function() {};
var buildDir = './build/dest';
var buildDirDate = buildDir + '/' + getBuildFolderName();
var buildDirApps = buildDirDate + '/applications';
var buildDirTracker = buildDirDate + '/tracker';
var appsDir = './src/tracker/applications';
var appIndex = './gulp_modules/webpack.index.html';
var helpDst = './src/help';
var appsIndex = './gulp_modules/ftp.applications.html';

var TITLE = '[build]';
var ERROR = gutil.colors.red( 'error' ); 

var buildExludeRegExp = function( apps, app ) {
  var n = apps.indexOf( app ), i;
  var list = apps.slice( 0 );

  if ( n > -1 ) {
    list.splice( n, 1 );
  }

  for ( i = list.length; i--; ) {
    list[ i ] = list[ i ] + '\\\/' + '[^\\.]*\\.jpg';
  }

  return new RegExp( list.join( '|' ) );
}

var buildDestFolder = function() {
  fs.mkdir( buildDir, function( err ) {
    if ( err ) {
      console.log( err );
      process.exit( 1 );
    }

    gutil.log( '[build]', 'folder', gutil.colors.green( buildDir ), 'created' );

    fs.mkdir( buildDirDate, function( err ) {
      if ( err ) {
        console.log( err );
        process.abort();
      }

      fs.copy( appsIndex, buildDirDate + '/applications.html', function( err ) {
        if ( err ) {
          gutil.log( gutil.colors.red( TITLE, ERROR, 'create applications index file' ) );
          console.log( err );
          process.exit( 1 );
        }

        gutil.log( '[build]', 'folder', gutil.colors.green( buildDirDate ), 'created' );

        getListOfApplications();
      } );
    } );
  } );
};

var getListOfApplications = function() {
  fs.readdir( appsDir, function( err, apps ) {
    if ( err ) {
      gutil.log( gutil.colors.red( TITLE, ERROR, 'read applications folder' ) );
      console.log( err );
      process.exit( 1 );
    }

    apps.total = apps.length;
    apps.done = 0;

    // Create tracker
    fs.mkdir( buildDirTracker, function( err ) {
      if ( err ) {
        gutil.log( gutil.colors.red( TITLE, ERROR, 'create tracker folder' ) );
        console.log( err );
        process.exit( 1 );
      }

      buildTracker();
    } );

    // Create applications
    fs.mkdir( buildDirApps, function( err ) {
      if ( err ) {
        gutil.log( gutil.colors.red( TITLE, ERROR, 'create applications folder' ) );
        console.log( err );
        process.exit( 1 );
      }

      buildApp_Start( apps );
    } );
  } );
};

var buildTracker = function() {
  // Copy help
  buildTracker_copyHelp();

  // Create tracker engine
  var cfg = Object.create( webpackConfig( {
    entry: {
      'tracker': './src/tracker/engine/tracker/index'
    }
  } ) );

  // Modify some webpack config options
  cfg.plugins = cfg.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // Modify output
  cfg.output.path = path.resolve( __dirname, '.' + buildDirTracker );

  // Run webpack build
  webpack( cfg, function( err, stats ) {
    if ( err ) {
      gutil.log( TITLE, ERROR, 'build tracker engine' );
      console.log( err );
      process.exit( 1 );
    } else {

      gutil.log( TITLE, gutil.colors.green( 'tracker engine' ), 'created' );

      // Copy to root directory
      fs.copySync(path.resolve( __dirname, '.' + buildDirTracker + '/tracker.js'), './tracker.js');

    }
  } );
};

var buildTracker_copyHelp = function() {
  fs.copy( helpDst, buildDirTracker, function( err ) {
    if ( err ) {
      gutil.log( TITLE, ERROR, 'copy help' );
      console.log( err );
    }
  } );
};

var buildApp_Start = function( apps ) {
  buildApp_createDir( apps, apps[ apps.done ] );
};

var buildApp_createDir = function( apps, app ) {
  fs.mkdir( buildDirApps + '/' + app, function( err ) {
    if ( err ) {
      gutil.log( gutil.colors.red( TITLE, ERROR, 'create dir "' + buildDirApps + '/' + app + '"' ) );
      console.log( err );
    }

    buildApp_createIndex( apps, app );
  } );
};

var buildApp_createIndex = function( apps, app ) {
  var index = buildDirApps + '/' + app + '/' + app + '.html';
  
  fs.copy( appIndex, index, function( err ) {
    if ( err ) {
      gutil.log( gutil.colors.red( TITLE, ERROR, app + ' " copy index > ' + index ) );
      console.log( err );
    } else {
      fs.readFile( index, 'utf8', function( err, contents ) {
        contents = contents.replace( /tracker\.js/, '../../tracker/tracker.js' );
        contents = contents.replace( /application\.js/, app + '.js' );

        fs.writeFile( index, contents, function( err, data ) {
          if ( err ) {
            gutil.log( gutil.colors.red( TITLE, ERROR, app + ' " change index > ' + index ) );
            console.log( err );
          } else {
            buildApp_makeBuild( apps, app );
          }
        } );
      } );
    }
  } );
};

var buildApp_makeBuild = function( apps, app ) {
  var cfg = {
    entry: {},
    regExp: buildExludeRegExp( apps, app )
  };

  cfg.entry[ app ] = appsDir + '/' + app + '/index';

  cfg = Object.create( webpackConfig( cfg ) );

  cfg.output.path = path.resolve( __dirname, '.' + buildDirApps + '/' + app );

  // Modify some webpack config options
  cfg.plugins = cfg.plugins.concat(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // Run webpack build
  webpack( cfg, function( err, stats ) {
    if ( err ) {
      gutil.log( TITLE, ERROR, 'create application', gutil.colors.magenta( app ) );
      console.log( err );
    }

    buildApp_checkBuild( apps, app );
  } );
};

var buildApp_checkBuild = function( apps, app ) {
  fs.exists( buildDirApps + '/' + app + '/' + app + '.js', function( exist ) {
    if ( exist ) {
      gutil.log( TITLE, 'application', gutil.colors.green( app ), 'created' );
      buildApp_checkFinish( apps );
    } else {
      gutil.log( TITLE, gutil.colors.yellow.bold( 'warining' ), gutil.colors.green( app ), 'is NOT builded, another try' );
      buildApp_makeBuild( apps, app );
    }
  } );
};

var buildApp_checkFinish = function( apps ) {
  if ( ++apps.done !== apps.total ) {
    buildApp_Start( apps );
    return false;
  }

  gutil.log( TITLE, gutil.colors.magenta( 'all applications builded' ) );

  endCallback();
};

// Public register task method
module.exports = function() {
  gulp.task( 'build-make', function( callback ) {
    // Setup global variables
    endCallback = callback;

    // Clear and create folder 'build/dest'
    fs.exists( buildDir, function( exists ) {
      if ( exists ) {
        fs.remove( buildDir, function( err ) {
          if ( err ) {
            console.log( err );
            process.exit( 1 );
          }

          buildDestFolder();
        } )
      } else {
        buildDestFolder();
      }
    } );
  } );
};
