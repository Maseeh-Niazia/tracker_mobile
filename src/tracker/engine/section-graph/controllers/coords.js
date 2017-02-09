'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;

module.exports = function( model, view, ignorePoints ) {
  view.coordsHide();
  
  var showCoords = false;
  var label = {
    x: model.axisX,
    y: model.axisY
  };
  var bboxChart, bbox;
  
  var inside = function( p ) {
    return p.x >= bbox.left && p.x <= bbox.right && p.y >= bbox.top && p.y <= bbox.bottom;
  };
  
  var coords = function( p ) {
    p.x -= bboxChart.left;
    p.y -= bboxChart.top;
    return p;
  };
  
  var start = function( evt ) {
    bboxChart = view.chart.svg._node.getBoundingClientRect();
    bbox = view.chart.grid_paper.getBoundingClientRect();
    view.coordsShow();
    
    var p = events.user.position( evt );
    
    if ( inside( p ) ) {
      view.coordsUpdate( label, coords( p ) );
    }
    
    showCoords = true;
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var move = function( evt ) {
    if ( !showCoords) {
      return false;
    }
    
    var p = events.user.position( evt );
    
    if ( inside( p ) ) {
      view.coordsUpdate( label, coords( p ) );
    } else {
      view.coordsHide();
    }
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var end = function( evt ) {
    if ( !showCoords) {
      return false;
    }
    
    view.coordsHide();
    showCoords = false;
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  if ( ignorePoints ) {
    var points = view.chart.grid_paper.nextSibling;
    points.setAttribute( 'pointer-events', 'none' );
  }
  
  window.addEventListener( MOUSEUP, end, false );
  window.addEventListener( MOUSEMOVE, move, false );
  view.chart.grid_paper.addEventListener( MOUSEDOWN, start, false );
};