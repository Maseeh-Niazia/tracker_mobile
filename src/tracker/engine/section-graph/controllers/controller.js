'use strict';

// Dependency utils
var events = require( '../../../utils/events' );
var Graph = require( '../../math-graph/index' );

// Constants
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Dependency controllers
var bindChangeFrame = require( './frame' );
var bindChangeAxes = require( './axes' );
var bindShowCoords = require( './coords' );
var bindDataTool = require( './datatool' );

// Private methods
var updateEventListeners = function( model, view ) {
  bindChangeFrame( model, view );
  bindChangeAxes( model, view );
  bindShowCoords( model, view );
  bindDataTool( model, view );
};

// Controller constructor
var Controller = function( model, view ) {
  events.on( 'FRAME_CHANGE_DATA:graph:' + model.frame, function( ops ) {
    model.updateObject( ops.object, ops.data );
    view.createChart( model );
    view.updateSelectBoxes( model );

    updateEventListeners( model, view );
  } );

  view.createChart( model );

  // Show coords functionality
  bindShowCoords( model, view );

  // Resize
  window.addEventListener( 'resize', function() {
    view.chartUpdate( model );

    setTimeout( function() {
      view.chartUpdate( model );
      updateEventListeners( model, view );
    }, 15);

  }, false );

  events.on( 'VIDEO_CHANGE_FRAME', function( frame ) {
    view.highlightPoint( model.getHighlightIndex( frame ) );
  } );

  events.on( 'DATA_TOOL:closed', function() {
    view.chartUpdate( model );
    updateEventListeners( model, view );
  } );

  // On data updated
  events.on( 'FRAME_UPDATE_DATA', function( ops ) {
    if ( model.object === ops.object ) {
      model.updateDataSet();
      view.chartUpdate( model, true );
      view.updateAxisButton( model );
      updateEventListeners( model, view );
      view.highlightPoint( model.getHighlightIndex( ops.frame ) );
    }
  } );

  events.on( 'UPDATE_DATA_ALL', function( ops ) {
    model.updateDataSet();
    view.chartUpdate( model, true );
    view.updateAxisButton( model );
    updateEventListeners( model, view );
    view.highlightPoint( model.getHighlightIndex( ops.frame ) );
  } );

  events.on( 'POINT_UPDATE:color', function( ops ) {
    if ( model.object === ops.object ) {
      view.updatePointColor( ops.object.color.value );
    }
  } );

  updateEventListeners( model, view );

  // On change graph axis
  events.on( 'GRAPH_CHANGE_AXIS:' + model.frame, function() {
    bindChangeFrame( model, view );
    bindDataTool( model, view )
  } );

  // Hide all opened options (menu)
  var hideAllMenus = function( evt ) {
    view.hideVariableOptions( view.AXIS.axisX );
    view.hideVariableOptions( view.AXIS.axisY );
  };

  window.addEventListener( MOUSEUP, hideAllMenus, false );
  window.addEventListener( MOUSEDOWN, hideAllMenus, false );
};

module.exports = Controller;
