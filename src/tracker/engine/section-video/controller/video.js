'use strict';

// Dependency utils
var events = require( '../../../utils/events' );
var browser = require( '../../../utils/browser' );

// Tools controllers
var axesController = require( './axis' );
var tapeController = require( './tape' );
var protractorController = require( './protractor' );
var placePointController = require( './place-point' );
var menuDisplayStateController = require( './display-state' );

// Animation frame controller
var animationFrameController = require( './timer' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;

// Controller constructor
var Controller = function( model, view ) {
  
  // Play on video
  view.bttnPlayStart.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.play();
    view.updateButtons( model );
  }, false );
  
  // Play off video
  view.bttnPlayPause.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.stop();
    view.updateButtons( model );
  }, false );
  
  // Set frame 0
  view.bttnPlayBack.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.gotoAndStop( 0 );
    //events.fire( 'VIDEO_CHANGE_FRAME:update-point-model', model.frameCurrent );
    view.update( model );
    events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
  }, false );
  
  // Play rate change
  view.bttnPlayRatePrev.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.changePlayRate( -1 );
    view.updatePlayRate( model );
  }, false );
  
  view.bttnPlayRateNext.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.changePlayRate( +1 );
    view.updatePlayRate( model );
  }, false );
  
  // Looping flag
  view.bttnPlayLoop.addEventListener( MOUSEUP, function( evt ) {
    if ( this.disabled ) {
      return false;
    };
    model.toogleLoop();
    view.updateLoopButton( model );
  }, false );
  
  // Skip frames
  view.bttnSkipPrev.addEventListener( MOUSEUP, function( ops ) {
    if ( this.disabled ) {
      return false;
    };
    model.stop();
    model.changeFrame( -1 );
    //events.fire( 'VIDEO_CHANGE_FRAME:update-point-model', model.frameCurrent );
    view.update( model );
    events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
  }, false );
  
  view.bttnSkipNext.addEventListener( MOUSEUP, function( ops ) {
    if ( this.disabled ) {
      return false;
    };
    model.stop();
    model.changeFrame( +1 );
    //events.fire( 'VIDEO_CHANGE_FRAME:update-point-model', model.frameCurrent );
    view.update( model );
    events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
  }, false );
  
  // Seek-bar changes
  view.seekBar.addEventListener( CHANGE, function( evt ) {
    var frame = parseInt( this.value, 10 );
    model.goto( frame );
    //events.fire( 'VIDEO_CHANGE_FRAME:update-point-model', model.frameCurrent );
    view.update( model );
    events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
  }, false );
  
  // Video tools holder controller
  var updateVideoToolsHolder = view.updateVideoToolsHolder.bind( view );
  
  events.on( 'VIDEO_SIZE_UPDATED', updateVideoToolsHolder );
  //events.on( 'APP_VIEW_WAS_RENDERED', updateVideoToolsHolder );
  window.addEventListener( 'resize', updateVideoToolsHolder, false );
  
  // Initiate tools controllers
  axesController( model, view );
  tapeController( model, model.tape, view.tape );
  protractorController( model, model.protractor, view.protractor );
  
  // Change display state
  menuDisplayStateController( model, view );
  
  // Animation frame
  animationFrameController( model, view );
  
  // Initiate shift button
  placePointController.init( view, model );
  
  // Current track, and changes
  events.on( 'CURRENT_TRACK_CHANGED', function ( name ) {
    model.setCurrentTrack( name );
    placePointController.update( view, model );
  } );
  
  events.on( 'VIDEO_CHANGE_FRAME', function() {
    placePointController.update( view, model );
  } );
  
  events.on( 'VIDEO_CHANGE_FRAME:from-graph-point', function( frame ) {
    model.gotoAndStop( frame );
    view.update( model );
    events.fire( 'VIDEO_CHANGE_FRAME', frame );
  } )
  
  events.on( 'OBJECT_CHANGE_VISIBILITY', function() {
    view.updateObjects( model );
  } );
  
  events.on( 'NEW_OBJECT_CREATED', function( object ) {
    view.addNewCreatedObject( object );
  } );
  
  events.on( 'POINT_UPDATE:color', function( ops ) {
    view.updatePointColor( ops.object );
  } );

  // Initiate video section 
  view.draw();
  view.update( model );
  events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
};

module.exports = Controller;