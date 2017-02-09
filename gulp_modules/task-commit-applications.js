'use strict';

// Dependency
var gulp = require( 'gulp' );
var exec = require('child_process').exec;
var appData = require( './applications-data' );

var DEFAULT_COMMIT_MESSAGE = 'update config and data'

// Private methods
var buildCommands = function( apps, msg ) {
  var commands = [], i;
  
  for ( i = apps.length; i--; ) {
    commands.push( 'sudo git add src/tracker/applications/' + apps[ i ].name + '/' );
    commands.push( 'sudo git commit -m "[EDMSST-' + apps[ i ].jira + '] perf (tracker) ' + apps[ i ].name + ': ' + msg + '"' );
  }
  
  return commands;
};

var execCommand = function( cmd, cb ) {
  exec( cmd, function ( error, stdout, stderr ) {
    var success = true;
    
    if ( error ) {
      success = false;
    }
    
    if ( stderr ) {
      success = false;
    }
    
    if ( cb && cb.call ) {
      cb( success );
    }
  } );
};

var tryExecCommands = function( commands, cb ) {
  if ( isNaN( commands.success ) ) {
    commands.success = 0;
    commands.overall = commands.length;
  }
  
  if ( commands.length === 0 ) {
    console.log('All commits DONE!');
    console.log('Overall commits made: ' + ( commands.success - commands.overall / 2) );
    cb();
    return;
  }
  
  execCommand( commands.shift(), function( success ) {
    commands.success += success ? 1 : 0;
    tryExecCommands( commands, cb );
  } );
};

// Public register task method
module.exports = function() {
  gulp.task( 'commit-applications', function( cb ) {
    var msg = process.argv.slice( 3 )[ 1 ] || DEFAULT_COMMIT_MESSAGE;
    
    tryExecCommands( buildCommands( appData, msg ), cb );
  } );
};