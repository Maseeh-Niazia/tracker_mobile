'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;

// Private methods
var bindTooglePoint = function( point, view ) {
  point.node.addEventListener( MOUSEUP, function() {
    // Toggle point
    point.toggle();
    
    // Update button "Create"
    view.bttnCreateUpdate();
  }, false );
};

// Public methods
var pointSelectController = function( view, model ) {
  for ( var i = view.points.length; i--; ) {
    bindTooglePoint( view.points[ i ], view );
  }
};

module.exports = pointSelectController;