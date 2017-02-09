'use strict';

// Dependency model
var Color = require( '../property/color' );
var Frame = require( '../property/frame' );
var AxisIndex = require( '../property/axis' );

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
  frame.position = this.matrix.getUserPoint( frame.x, frame.y );
};

// Super Object constructor
var Point = function( model, matrix ) {
  this.name = model.name;
  this.type = 'point';
  this.mass = model.mass || 1;
  this.start = model.start;
  this.track = model.track;
  this.trackType = model.trackType || 'Circle';
  this.trackNumber = model.trackNumber || false;
  this.radius = model.radius;
  this.color = new Color( model.color );
  this.params = model.params.slice( 0 );
  this.matrix = matrix;
  this.frames = [];
  this.hidden = model.hidden === true;
  this.bounds = model.bounds || {};
  this.precisions = model.precisions || {};
  this.axisIndex = new AxisIndex( model.params, model.paramsAxis || [] );
  
  createFrames.call( this, model.frames );
};

Point.prototype.axisChangeOrigin = function( dx, dy ) {
  for ( var p, f, i = this.frames.length; i--; ) {
    f = this.frames [ i ];

    if ( !f ) {
      continue;
    }
    
    if ( !isNaN( f.x ) && !isNaN( f.y ) ) {
      f.x += dx;
      f.y += dy;
    }
  }
};

module.exports = Point;
