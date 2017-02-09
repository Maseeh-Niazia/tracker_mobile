'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Private methods
var createFireChangeFrame = function( frame ) {
  return function() {
    events.fire( 'VIDEO_CHANGE_FRAME:from-graph-point', frame );
  };
};

var initChangeFrame = function( model, point, index ) {
  var frame = model.getVideoFrame( index );
  
  point.addEventListener( MOUSEUP, createFireChangeFrame( frame ), false );
};

// Public method
module.exports = function( model, view ) {
  var axisX = view[ view.AXIS.axisX ];
  var axisY = view[ view.AXIS.axisY ];
  
  // Change frame by point click
  for ( var i = 0, l = view.chart.points.length; i < l; i++ ) {
    initChangeFrame( model, view.chart.points[ i ], i );
  }
};