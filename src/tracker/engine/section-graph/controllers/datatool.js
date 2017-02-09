'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var DOUBLE_CLICK = 350;

// Main controller for data tool show
module.exports = function( model, view ) {
  var lastClick = Date.now();
  
  var click = function ( evt ) {
    var thisClick = Date.now();
    
    if ( thisClick - lastClick <= DOUBLE_CLICK ) {
      events.fire( 'DATA_TOOL:show', model );
    }
    
    lastClick = thisClick;
  };
  
  view.chart.grid_paper.addEventListener( MOUSEUP, click, false );
};