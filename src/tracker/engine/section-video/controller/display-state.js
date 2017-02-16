'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Private methods
var initChangeState = function( model, view, state ) {
  var menu = view.displayStateMenu;
  
  menu.labels[ state ].addEventListener( MOUSEDOWN, function( evt ) {
    evt.preventDefault();
    evt.stopPropagation();
  } );
  
  menu.labels[ state ].addEventListener( MOUSEUP, function( evt ) {
    if ( model.currentDisplayState !== state ) {
      model.currentDisplayState = state;
      view.displayStateMenu.update( model );
      view.updateDisplayState( model );
    }
    
    menu.hide();
  } );
};

// Public methods
module.exports = function( model, view ) {
  // Menu
  view.currentState.addEventListener( MOUSEDOWN, function( evt ) {
    evt.preventDefault();
    evt.stopPropagation();
  } );
  
  view.currentState.addEventListener( MOUSEUP, function() {
    view.displayStateMenu.show();
  } );
  
  window.addEventListener( MOUSEDOWN, function() {
    view.displayStateMenu.hide();
  } );
  
  // States
  var states = Object.keys( view.displayStateMenu.labels );
  
  for ( var i = states.length; i--; ) {
    initChangeState( model, view, states[ i ] );
  } 
};