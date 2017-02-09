'use strict';

// Constants
var SYMBOL_NUM = 65;

// Private methods
var color = function() {
  return Math.random()*255 | 0;
};

// Object constructor
var Point = function( start, end ) {
  this.name = 'Model ' + String.fromCharCode( SYMBOL_NUM++ );
  this.color = [ color(), color(), color(), 255 ];
  this.start = start;
  this.end = end;
  this.track = false;
  this.type = 'point-model';
  this.frames = [ [ 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0 ] ];
  this.params = [ 't', 'x', 'y', 'v_x', 'v_y', 'v', 'a_x', 'a_y', 'a', 'K' ];
};

module.exports = Point;
