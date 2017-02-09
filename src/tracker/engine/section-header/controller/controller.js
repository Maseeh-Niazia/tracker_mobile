'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;

// Private methods
var initToggleButtons = function( model, view ) {
  for ( var i = view.toggleButtons.length; i--; ) {
    initToggleButton( view.toggleButtons[ i ] );
  }
};

var initToggleButton = function( bttn ) {
  bttn.node.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'STATE_CHANGE:' + bttn.name, bttn.toggle() );
  }, false );
};

var bindChangeTrack = function( view, bttn, model ) {
  bttn.node.addEventListener( MOUSEUP, function( evt ) {
    view.setCurrentTrack( model, bttn.name );
    events.fire( 'CURRENT_TRACK_CHANGED', bttn.name );
  }, false );
};

var initTrackMenuButtons = function( view, model ) {
  // Initiate to show track menu
  view.bttnCurrentTrack.node.addEventListener( MOUSEUP, function( evt ) {
    view.showTrackMenu( model.objects.find( view.currentTrackName ) );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Initiate change object visibility
  view.currentTrackMenuButtons.visible.addEventListener( MOUSEUP, function( evt ) {
    var object = model.objects.find( view.currentTrackName );

    view.hideTrackMenu();

    object.hidden = !object.hidden;

    events.fire( 'OBJECT_CHANGE_VISIBILITY', object );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Initiate open modeler for object
  view.currentTrackMenuButtons.define.addEventListener( MOUSEUP, function( evt ) {
    var object = model.objects.find( view.currentTrackName );

    if ( object.isModel ) {
      events.fire( 'MODEL_BUILDER:show', view.bttnCurrentTrack.name );
    }

    evt.preventDefault();
    evt.stopPropagation();
  }, false );
};

// Controller constructor
var Controller = function( view, model ) {
  // Show curretn track menu
  view.bttnSelectTrackMenu.addEventListener( MOUSEUP, function( evt ) {
    view.showTrackOptions();

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  view.bttnHelp.addEventListener(MOUSEUP, function (evt) {
    events.fire('HELP:show');
  }, false);

  // Hide all opened options (menu)
  window.addEventListener( MOUSEUP, function( evt ) {
    view.hideTrackOptions();
    view.hideTrackMenu();
  }, false );

  // Change track object
  for ( var i = view.bttnsOptionTrack.length; i--; ) {
    bindChangeTrack( view, view.bttnsOptionTrack[ i ], model );
  }

  if ( view.bttnCurrentTrack && view.bttnCurrentTrack.name ) {
    events.fire( 'CURRENT_TRACK_CHANGED', view.bttnCurrentTrack.name );
  }

  events.on( 'CURRENT_TRACK_CHANGE:force', function( name ) {
    view.setCurrentTrack( model, name );
  } );

  // Initiate toogle buttons
  initToggleButtons( model, view );

  // Initiate create center of mass button
  view.bttnCreateCenterOfMass.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'CENTER_OF_MASS_BUILDER:show' );
  }, false );

  // Fire model builder
  if ( view.bttnCurrentTrack !== null ) {
    initTrackMenuButtons( view, model );
  }

  // Create model particle buttons
  view.bttnCreateModelDynamic.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'PARTICLE_MODEL_DYNAMIC:create' );
  }, false );

  view.bttnCreateModelAnalytic.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'PARTICLE_MODEL_ANALYTIC:create' );
  }, false );

  // New object created
  events.on( 'NEW_OBJECT_CREATED', function( object ) {
    var bttn = view.addNewCreatedObject( object );

    bindChangeTrack( view, bttn, model );
  } );

  events.on( 'POINT_UPDATE:color', function( ops ) {
    view.updatePointColor( ops.object );
  } );
};

module.exports = Controller;
