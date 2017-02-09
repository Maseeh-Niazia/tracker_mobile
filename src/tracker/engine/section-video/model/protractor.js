'use strict';

// Constants
var ARC_RADIUS = 25;
var MIN_LINE_LENGTH = 16;
var ARC_TITLE_LENGTH = 20;

// Private methods
var calcLineLength = function( p ) {
  var x = p.x - this.posM.x;
  var y = p.y - this.posM.y;
  return Math.sqrt( x * x + y * y );
};

var calcArcX = function( len, p ) {
  return this.arcRad * ( p.x - this.posM.x ) / len + this.posM.x;
};

var calcArcY = function( len, p ) {
  return this.arcRad * ( p.y - this.posM.y ) / len + this.posM.y;
};

var reCalcModel = function() {
  calcArcAngle.call( this );
  calcArcPoints.call( this );
  calcArcTitle.call( this );
};

var calcArcAngle = function() {
  var vL = {
    x: this.posL.x - this.posM.x,
    y: this.posL.y - this.posM.y
  };
  var vR = {
    x: this.posR.x - this.posM.x,
    y: this.posR.y - this.posM.y
  };
  
  var aL = Math.toDegrees( Math.atan2( vL.y, vL.x ) );
  var aR = Math.toDegrees( Math.atan2( vR.y, vR.x ) );
  
  if ( aL < 0 ) {
    aL += 360;
  }
  if ( aR < 0 ) {
    aR += 360;
  }
  
  if ( aR > aL ) {
    this.ang = aR - aL;  
  } else {
    this.ang = 360 + aR - aL;
  }
};

var calcArcPoints = function() {
  var lenL = calcLineLength.call( this, this.posL );
  var lenR = calcLineLength.call( this, this.posR )
  
  this.arcL = {
    x: calcArcX.call( this, lenL, this.posL ),
    y: calcArcY.call( this, lenL, this.posL )
  };
  this.arcR = {
    x: calcArcX.call( this, lenR, this.posR ),
    y: calcArcY.call( this, lenR, this.posR )
  };
  
  this.arcD = this.ang > 180 ? 0 : 1;
};

var calcArcTitle = function() {
  var lenL = calcLineLength.call( this, this.posL );
  var lenR = calcLineLength.call( this, this.posR );
  
  var eL = {
    x: ( this.posL.x - this.posM.x ) / lenL,
    y: ( this.posL.y - this.posM.y ) / lenL
  };
  var eR = {
    x: ( this.posR.x - this.posM.x ) / lenR,
    y: ( this.posR.y - this.posM.y ) / lenR
  };
  
  var v = {
    x: -1 * ( eL.x + eR.x ),
    y: -1 * ( eL.y + eR.y )
  };
  
  var len = Math.sqrt( v.x * v.x + v.y * v.y );
  
  this.arcT = {
    x: this.posM.x + ARC_TITLE_LENGTH * v.x / len,
    y: this.posM.y + ARC_TITLE_LENGTH * v.y / len
  };
};

// Protractor model constructor
var Protractor = function( model ) {
  this.visible = model.visible;
  this.color = model.color;
  this.ang = 0;
  
  this.posO = {
    x: 0, 
    y: 0
  };
  
  this.posL = {
    x: model.points[ 0 ].x,
    y: model.points[ 0 ].y
  };
  this.posM = {
    x: model.points[ 1 ].x,
    y: model.points[ 1 ].y
  };
  this.posR = {
    x: model.points[ 2 ].x,
    y: model.points[ 2 ].y
  };
  
  this.arcL = {
    x: 0,
    y: 0
  };
  this.arcR = {
    x: 0,
    y: 0
  };
  this.arcT = {
    x: 0,
    y: 0
  };
  
  this.arcD = 0;
  
  this.arcRad = ARC_RADIUS;
  
  reCalcModel.call( this );
};

Protractor.prototype.update = function( pos ) {
  var dx = pos.x - this.posO.x;
  var dy = pos.y - this.posO.y;
  
  this.posL.x += dx;
  this.posL.y += dy;
  this.posR.x += dx;
  this.posR.y += dy;
  this.posM.x += dx;
  this.posM.y += dy;
  
  this.posO = pos;
  
  reCalcModel.call( this );
};

Protractor.prototype.move_l = function( pos ) {
  this.posL.x = pos.x;
  this.posL.y = pos.y;
  reCalcModel.call( this );
};

Protractor.prototype.move_r = function( pos ) {
  this.posR.x = pos.x;
  this.posR.y = pos.y;
  reCalcModel.call( this );
};

Protractor.prototype.move_m = function( pos ) {
  this.posM.x = pos.x;
  this.posM.y = pos.y;
  reCalcModel.call( this );
};

module.exports = Protractor