'use strict';

// Constants
var TITLE_LENGTH_MIN = 8;
var TITLE_LENGTH_MAX = 30;

// Private methods
var reCalcModel = function() {
  var x1, x2, y1, y2, v, len, value;
  
  v = {
    x: this.posR.x - this.posL.x,
    y: this.posR.y - this.posL.y
  };
  
  len = TITLE_LENGTH_MIN + Math.abs( Math.sin( Math.atan2( v.y, v.x ) ) * ( TITLE_LENGTH_MAX - TITLE_LENGTH_MIN ) );
  value = Math.sqrt( v.x * v.x + v.y * v.y ) / this.scale;
  value = value.toExponential( 3 );
  value = value.replace( /\+/, '');
  value = value.replace( /e0/, '');
  value = value.toUpperCase();
  
  if ( v.x === 0 && v.y === 0 ) {
    v.x = this.posR.x - len;
    v.y = this.posR.y;
  } else
  if ( v.y !== 0 ) {
    x1 = ( len ) / Math.sqrt( 1 + ( v.x * v.x ) / ( v.y * v.y ) );
    x2 = -1 * x1;
    
    y1 = -1 * x1 * v.x / v.y;
    y2 = -1 * x2 * v.x / v.y;
  } else
  if ( v.x !== 0 ) {
    y1 = ( len ) / Math.sqrt( 1 + ( v.y * v.y ) / ( v.x * v.x ) );
    y2 = -1 * y1;
    
    x1 = -1 * y1 * v.y / v.x;
    x2 = -1 * y2 * v.y / v.x;
  }
  
  if ( Math.sign( v.x ) === Math.sign( x1 ) ) {
    v = { x: x1, y: y1 };
  } else {
    v = { x: x2, y: y2 };
  }
  
  this.value = value;
  this.posT.x = v.x + ( this.posR.x + this.posL.x ) / 2;
  this.posT.y = v.y + ( this.posR.y + this.posL.y ) / 2;
};

// Model constructor
var Tape = function( model, matrix ) {
  this.visible = model.visible;
  this.color = model.color;
  this.scale = matrix.sX;
  this.value = 0;
  
  this.posO = {
    x: 0, 
    y: 0
  };
  this.posT = {
    x: 0, 
    y: 0
  };
  this.posL = {
    x: model.points[ 0 ].x,
    y: model.points[ 0 ].y
  };
  this.posR = {
    x: model.points[ 1 ].x,
    y: model.points[ 1 ].y
  };
  
  reCalcModel.call( this );
};

Tape.prototype.update = function( pos ) {
  var dx = pos.x - this.posO.x;
  var dy = pos.y - this.posO.y;
  
  this.posL.x += dx;
  this.posL.y += dy;
  this.posR.x += dx;
  this.posR.y += dy;
  
  this.posO = pos;
  
  reCalcModel.call( this );
};

Tape.prototype.move_l = function( pos ) {
  this.posL.x = pos.x;
  this.posL.y = pos.y;
  
  reCalcModel.call( this );
};

Tape.prototype.move_r = function( pos ) {
  this.posR.x = pos.x;
  this.posR.y = pos.y;
  
  reCalcModel.call( this );
};

Tape.prototype.move_m = function( pos ) {
  this.posL.x += pos.dx;
  this.posL.y += pos.dy;
  this.posR.x += pos.dx;
  this.posR.y += pos.dy;
  
  reCalcModel.call( this );
};

module.exports = Tape;