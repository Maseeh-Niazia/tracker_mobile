'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;

// Column selector controller
var columnSelectorController = require( './column-selector' );
var makeWindowDraggable = require( '../../model-builder/controller/draggable' );

// Controller constructor
var Controller = function( model, view ) {
  var columnSelectorView = view.columnSelector
  
  makeWindowDraggable( columnSelectorView );
  columnSelectorController( model, columnSelectorView );
  
  events.on( 'FRAME_CHANGE_DATA:table:' + model.frame, function( ops ) {
    model.updateObject( ops.object, ops.data );
    view.changeObject( model );
    columnSelectorController( model, columnSelectorView );
  } );
  
  events.on( 'SHOW_DATA_PARAMETERS:table:' + model.frame, function( ops ) {
    columnSelectorView.show( ops.frameName );
  } );
  
  events.on( 'CHANGE_DATA_PARAMETERS:table:' + model.frame, function( ops ) {
    if ( ops.isChecked ) {
      model.addColumn( ops.column );
      view.addColumn( model, ops.column );
    }
    else {
      view.removeColumn( model, ops.column );
      model.removeColumn( ops.column );
    }
  } );
  
  events.on( 'VIDEO_CHANGE_FRAME', function( frame ) {
    if ( frame >= model.start ) {
      view.highlightRow( model.getHighlightIndex( frame ) );
    }
    else {
      view.highlightRow();
    }
  } );
  
  events.on( 'FRAME_UPDATE_DATA', function( ops ) {
    if ( model.object === ops.object ) {
      // Force update view
      view.changeObject( model );
      columnSelectorController( model, columnSelectorView );
      view.highlightRow( model.getHighlightIndex( ops.frame ) );
    }
  } );
  
  events.on( 'UPDATE_DATA_ALL', function( ops ) {
    view.changeObject( model );
    columnSelectorController( model, columnSelectorView );
    view.highlightRow( model.getHighlightIndex( ops.frame ) );
  } );
};

module.exports = Controller;