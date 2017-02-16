'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var KEYDOWN = 'keydown';
var MOUSEUP = events.user.mouseup;
var MOUSEMOVE = events.user.mousemove;
var MOUSEDOWN = events.user.mousedown;
var MOUSEOUT = events.user.mouseout;
var MOUSEOVER = events.user.mouseover;

// Private methods
var makeAxesDraggable = function( model, view ) {
  var ctx = {
    x0: model.axis.x0,
    y0: model.axis.y0,
    isSelected: false,
    isMoving: false,
    axis: view.axis,
    model: model,
    pos0: 0
  };
  
  view.axis.axisX_hit.addEventListener( MOUSEOVER, axisDragCursorSet.bind( ctx ), false );
  view.axis.axisY_hit.addEventListener( MOUSEOVER, axisDragCursorSet.bind( ctx ), false );
  view.axis.axisX_hit.addEventListener( MOUSEOUT, axisDragCursorDel.bind( ctx ), false );
  view.axis.axisY_hit.addEventListener( MOUSEOUT, axisDragCursorDel.bind( ctx ), false );
  view.axis.axisX_hit.addEventListener( MOUSEDOWN, axisDragStart.bind( ctx ), false );
  view.axis.axisY_hit.addEventListener( MOUSEDOWN, axisDragStart.bind( ctx ), false );
  document.addEventListener( KEYDOWN, arrowKeyDown.bind( ctx ), false );
  window.addEventListener( MOUSEMOVE, axisDragMove.bind( ctx ), false );
  window.addEventListener( MOUSEUP, axisDragEnd.bind( ctx ), false );
};

var axisDragCursorSet = function( evt ) {
  this.axis.axisX_hit.style.cursor = 'move';
  this.axis.axisY_hit.style.cursor = 'move';
};

var axisDragCursorDel = function( evt ) {
  this.axis.axisX_hit.style.cursor = 'default';
  this.axis.axisY_hit.style.cursor = 'default';
};

var arrowKeyDown = function( evt ) {
  if ( !this.isSelected ) {
    return false;
  }
  
  var key = event.keyCode;
  var dx = 0;
  var dy = 0;
  
  // Left
  if ( key === 37 ) {
    dx = +0.5;
  } else
  // Up
  if ( key === 38 ) {
    dy = +0.5;
  } else
  // Right
  if ( key === 39 ) {
    dx = -0.5;
  } else
  // Down
  if ( key === 40 ) {
    dy = -0.5;
  }
  
  // Update
  this.model.axis.x0 = this.x0 - dx;
  this.model.axis.y0 = this.y0 - dy;
  
  this.axis.update( this.model );
  
  this.x0 = this.model.axis.x0;
  this.y0 = this.model.axis.y0;
  
  events.fire( 'AXIS_CHANGE_ORIGIN', {
    xorigin: this.model.axis.x0,
    yorigin: this.model.axis.y0,
    frame: this.model.frameCurrent
  } );  
};

var axisDragStart = function( evt ) {
  this.isMoving = true;
  this.isSelected = true;
  
  this.axis.highlight( true );
  
  this.pos0 = events.user.position( evt );
  
  evt.preventDefault();
  evt.stopPropagation();
};

var axisDragMove = function( evt ) {
  if ( !this.isMoving ) {
    return false;
  }
  
  var pos = events.user.position( evt );
  
  this.model.axis.x0 = this.x0 - ( this.pos0.x - pos.x );
  this.model.axis.y0 = this.y0 - ( this.pos0.y - pos.y );
  
  this.axis.update( this.model );
};

var axisDragEnd = function( evt ) {
  if ( this.isMoving ) {
    this.isMoving = false;
    this.x0 = this.model.axis.x0;
    this.y0 = this.model.axis.y0;
    
    events.fire( 'AXIS_CHANGE_ORIGIN', {
      xorigin: this.model.axis.x0,
      yorigin: this.model.axis.y0,
      frame: this.model.frameCurrent
    } );
  } else {
    this.isSelected = false;
    this.axis.highlight( false );
  }
};


// Controller constructor
module.exports = function( model, view ) {
  var update = view.axis.update.bind( view.axis, model );
  
  if ( model.axis.draggable ) {
    makeAxesDraggable( model, view );
  }  
  
  events.on( 'VIDEO_SIZE_UPDATED', update );
  window.addEventListener( 'resize', update, false );
  events.on( 'STATE_CHANGE:axis', view.axis.toggle.bind( view.axis ) );
};
  