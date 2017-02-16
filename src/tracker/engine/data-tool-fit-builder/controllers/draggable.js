'use strict';
// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;

// Private methods
var makeWindowDraggable = function( view ) {
  var position = { x: 0, y: 0 };
  var isDraggable = false;
  var xMin = 0, xMax;
  var yMin = 0, yMax;
  var bboxO, posO, p;
  
  var updateView = function( pos ) {
    view.node.style.left = pos.x + 'px';
    view.node.style.top = pos.y + 'px';
  };
  
  var getPosition = function( evt ) {
    p = events.user.position( evt );
    p.x = position.x + p.x - posO.x;
    p.y = position.y + p.y - posO.y;
    
    p.x = Math.min( xMax, Math.max( xMin, p.x ) );
    p.y = Math.min( yMax, Math.max( yMin, p.y ) );
    
    return p;
  };
  
  var start = function( evt ) {
    bboxO = view.holder.getBoundingClientRect();
    posO = events.user.position( evt );
        
    yMax = bboxO.height - view.height;
    xMax = bboxO.width - view.width;
    
    isDraggable = true;
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var move = function( evt ) {
    if ( !isDraggable ) {
      return false;
    }
    
    updateView( getPosition( evt ) );
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var end = function( evt ) {
    if ( !isDraggable ) {
      return false;
    }
    
    position = p;
    isDraggable = false;
  };
  
  // Bind events
  view.header.addEventListener( MOUSEDOWN, start, false );
  window.addEventListener( MOUSEMOVE, move, false );
  window.addEventListener( MOUSEUP, end, false );
  
  // Place in the middle
  bboxO = view.holder.getBoundingClientRect();
  position.x = bboxO.width / 2 - view.width / 2;
  position.y = bboxO.height / 2 - view.height / 2;
  updateView( position );
};

module.exports = makeWindowDraggable;