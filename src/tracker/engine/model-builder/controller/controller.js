'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;

// Dependency controller
var initTable = require( './table' );
var makeWindowDraggable = require( './draggable' );

// Controller constructor
var Controller = function( view, object ) {
  // Close behaviour
  view.bttnSaveAndClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();
    
    events.fire( 'MODEL_BUILDER:closed' );
    
    evt.preventDefault();
    evt.stopPropagation();    
  }, false );
  
  events.on( 'MODEL_BUILDER:hide', function( evt ) {
    view.hide();   
  } );
  
  view.bttnColor.node.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'COLOR_PICKER:show', {
      bttn: view.bttnColor,
      object: object
    } );
    
    evt.preventDefault();
    evt.stopPropagation();    
  }, false );

  // Drag & drop, place in the middle
  makeWindowDraggable( view );
  
  // Initiate parameters panel
  initTable( view, object, 'parameters' );
  initTable( view, object, 'initialValues' );
  initTable( view, object, 'forceFunctions' );
};

module.exports = Controller;