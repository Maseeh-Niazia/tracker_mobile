'use strict';

// Private methods
var generateMatrix = function() {
  var rad = Math.toRadians( -1 * this.ang );
  var cos = Math.cos( rad );
  var sin = Math.sin( rad );
  
  return [
    [ this.sX * cos, +1 * this.sY * sin ],
    [ this.sX * sin, -1 * this.sY * cos ]
  ];
};

var invertMatrix = function( m ) {
  var d = m[ 0 ][ 0 ] * m[ 1 ][ 1 ] - m[ 0 ][ 1 ] * m[ 1 ][ 0 ];
  
  if ( d === 0 ) {
    return null;
  } 
  
  return [
    [ m[ 1 ][ 1 ] / d, -1 * m[ 0 ][ 1 ] / d ],
    [ -1 * m[ 1 ][ 0 ] / d, m[ 0 ][ 0 ] / d ],
  ];
};

// Matrix constructor
var Matrix = function( model ) {
  this.x0 = model.xorigin;
  this.y0 = model.yorigin;
  this.ang = model.angle;
  this.sX = model.xscale;
  this.sY = model.yscale;
  
  this.m = generateMatrix.call( this );
};

Matrix.prototype.getUserPoint = function( x, y ) {
  return {
    x: this.x0 + x * this.m[ 0 ][ 0 ] + y * this.m[ 0 ][ 1 ],
    y: this.y0 + x * this.m[ 1 ][ 0 ] + y * this.m[ 1 ][ 1 ]
  };
};

Matrix.prototype.getModelPoint = function( x, y ) {
  var m = invertMatrix( this.m );
  
  x = x - this.x0;
  y = y - this.y0;
  
  if ( m === null ) {
    
  } else {
    return {
      x: m[ 0 ][ 0 ] * x +  m[ 0 ][ 1 ] * y,
      y: m[ 1 ][ 0 ] * x +  m[ 1 ][ 1 ] * y
    }
  };
};

Matrix.prototype.getModelVector = function( dx, dy ) {
  var m = invertMatrix( this.m );
  
  if ( m === null ) {
    
  } else {
    return {
      dx: m[ 0 ][ 0 ] * dx +  m[ 0 ][ 1 ] * dy,
      dy: m[ 1 ][ 0 ] * dx +  m[ 1 ][ 1 ] * dy
    }
  };
};

module.exports = Matrix;