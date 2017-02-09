'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;

// Dependency controller
var makeWindowDraggable = require( './draggable' );
var pointNameController = require( './point-name' );
var pointSelectController = require( './point-select' );

// Controller constructor
var Controller = function( view, model ) {
  // Create behaviour
  view.bttnCreate.addEventListener( MOUSEUP, function( evt ) {
    view.hide();
    
    events.fire( 'CENTER_OF_MASS_BUILDER:create', {
      name: view.getPointName(),
      color: view.bttnColor.color,
      points: view.getSelectedPoints()
    } );
    
    evt.preventDefault();
    evt.stopPropagation();    
  }, false );
  
  // Close behaviour
  view.bttnClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();
    
    events.fire( 'CENTER_OF_MASS_BUILDER:closed' );
    
    evt.preventDefault();
    evt.stopPropagation();    
  }, false );
  
  events.on( 'CENTER_OF_MASS_BUILDER:hide', function( evt ) {
    view.hide();   
  } );
  
  view.bttnColor.node.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'COLOR_PICKER:show', {
      bttn: view.bttnColor,
      object: { color: { value: view.bttnColor.color } }
    } );
    
    evt.preventDefault();
    evt.stopPropagation();    
  }, false );

  // Drag & drop, place in the middle
  makeWindowDraggable( view );
  
  // Point name controller
  pointNameController( view, model );
  
  // Point selection controller
  pointSelectController( view, model );
};

module.exports = Controller;