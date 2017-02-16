'use strict';

// Dependency model
var Color = require( './property/color' );
var Frame = require( './property/frame' );
var SuperPoint = require( './interface/super' );

// Private methods
var reCalcModel = function( n ) {
  calc_VelocityValues.call( this, n - 1 );
  calc_AccelerationValues.call( this, n - 2 );
};

var calc_VelocityValues = function( n ) {
  var framePrev = this.frames[ n - 1 ];
  var frameThis = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];
  
  if ( framePrev && frameThis && frameNext ) {
    frameThis.v_x = ( frameNext.x - framePrev.x ) / ( 2 * this.dt );
    frameThis.v_y = ( frameNext.y - framePrev.y ) / ( 2 * this.dt );
  }
};

var calc_AccelerationValues = function( n ) {
  var framePrev2 = this.frames[ n - 2 ];
  var framePrev = this.frames[ n - 1 ];
  var frameThis = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];
  var frameNext2 = this.frames[ n + 2 ];
  
  if ( framePrev2 && framePrev && frameThis && frameNext && frameNext2 ) {
    frameThis.a_x = ( 2 * framePrev2.x - framePrev.x - 2 * frameThis.x - frameNext.x + 2 * frameNext2.x ) / ( 7 * this.dt * this.dt );
    frameThis.a_y = ( 2 * framePrev2.y - framePrev.y - 2 * frameThis.y - frameNext.y + 2 * frameNext2.y ) / ( 7 * this.dt * this.dt );
  }
};

var calcRealPosition = function( frame ) {
  frame.position = this.matrix.getUserPoint( frame.x, frame.y );
};

// Object constructor
var Point = function( model, matrix, dt ) {
  this.dt = dt;
  this.isModelPlace = true;
  this.placeEnd = model.placeEnd;
  this.placeStart = model.placeStart;
  
  SuperPoint.call( this, model, matrix );
};

Point.prototype.updateFrameData = function( n, pos ) {
  pos = this.matrix.getModelPoint( pos.x, pos.y );
  n -= this.start
  var frame = null;
  
  if ( this.frames[ n ] ) {
    frame = this.frames[ n ];
  } else {
    frame = this.frames[ n ] = new Frame( [], {} );
  }
  
  frame.t = this.dt * ( n - this.start );
  frame.x = pos.x;
  frame.y = pos.y;
  
  calcRealPosition.call( this, frame );
  reCalcModel.call( this, n );
};

Point.prototype.axisChangeOrigin = SuperPoint.prototype.axisChangeOrigin;

module.exports = Point;
