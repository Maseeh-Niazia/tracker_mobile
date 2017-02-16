'use strict';

// Dependency model
var Color = require( './property/color' );
var Frame = require( './property/frame' );
var SuperPoint = require( './interface/super' );

// Constants
var SHIFT = 10; // shift before arrow

// Private methods
var createFrames = function( frames ) {
  var frame, i, l;
  
  for ( i = 0, l = frames.length; i < l; i++ ) {
    frame = new Frame( frames[ i ], this.params );
    calcRealPosition.call( this, frame );
    this.frames.push( frame );
  }
};

var calcRealPosition = function( frame ) {
  var theta = Math.toRadians( frame.theta );
  var x1 = frame.x_tail;
  var y1 = frame.y_tail;
  var dx1 = frame.x;
  var dy1 = frame.y;
  
  var x2 = x1 + dx1;
  var y2 = y1 + dy1;
  
  var dx = SHIFT * Math.cos( theta );
  var dy = SHIFT * Math.sin( theta );
  
  var p1 = this.matrix.getUserPoint( x1, y1 );
  var p2 = this.matrix.getUserPoint( x2, y2 );
  
  frame.position = {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x - dx,
    y2: p2.y - dy
  };
};

// Object constructor
var Vector = function( model, matrix ) {
  this.name = model.name;
  this.type = model.type;
  this.start = model.start;
  this.track = false;
  this.color = new Color( model.color );
  this.params = model.params.slice( 0 );
  this.matrix = matrix;
  this.frames = [];
  this.hidden = model.hidden === true;
  this.bounds = model.bounds || {};
  this.precisions = model.precisions || {};
  
  createFrames.call( this, model.frames );
};

Vector.prototype.axisChangeOrigin = function( dx, dy ) {
  for ( var p, f, i = this.frames.length; i--; ) {
    f = this.frames [ i ];
    
    if ( !isNaN( f.x_tail ) && !isNaN( f.y_tail ) ) {
      f.x_tail += dx;
      f.y_tail += dy;
    }
  }
};

module.exports = Vector;
