'use strict';

// Dependency model
var Frame = require( './property/frame' );
var SuperPoint = require( './interface/super' );

// Private methods
var calcRealPosition = function( frame ) {
  frame.position = this.matrix.getUserPoint( frame.x, frame.y );
};

var calc_TotalMass = function( points ) {
  var mass = 0;
  
  for ( var i = points.length; i--; ) {
    mass += points[ i ].mass;
  }
  
  return mass;
};

var calc_StartFrame = function( points ) {
  var start = 0, i;
  
  for ( i = points.length; i--; ) {
    start = Math.max( start, points[ i ].start );
  }
  
  return start;
};

var calc_MaxFrames = function( points ) {
  var max = Infinity, i;
  
  for ( i = points.length; i--; ) {
    max = Math.min( max, points[ i ].frames.length );
  }
  
  return max;
};

var calcFullValue = function( v1, v2 ) {
  return Math.sqrt( v1 * v1 + v2 * v2 );
};

var reCalcModel = function() {
  var end = this.start + calc_MaxFrames( this.sources );
  var points = this.sources;
  var start = this.start;
  var mass = this.mass;
  
  var hasMass = mass !== 0;
  var cc = 1 / points.length;
  
  var frame, p, f, n, c;
  
  for ( var i = start; i < end; i++ ) {
    n = i - start;
    
    if ( !this.frames[ n ] ) {
      frame = this.frames[ n ] = new Frame( [], {} );
    }
    
    frame.x = 0;
    frame.y = 0;
    
    for ( var j = points.length; j--; ) {
      p = points[ j ];
      f = i - p.start;
      c = hasMass ? p.mass / mass : cc;
      
      frame.x += c * p.frames[ f ].x;
      frame.y += c * p.frames[ f ].y;
      frame.t = p.frames[ f ].t;
    }
    
    calcRealPosition.call( this, frame );
    
    calc_VelocityValues.call( this, n - 1 );
    calc_AccelerationValues.call( this, n - 2 );
  }
};

var calc_VelocityValues = function( n ) {
  var framePrev = this.frames[ n - 1 ];
  var frameThis = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];
  
  if ( framePrev && frameThis && frameNext ) {
    frameThis.v_x = ( frameNext.x - framePrev.x ) / ( 2 * this.dt );
    frameThis.v_y = ( frameNext.y - framePrev.y ) / ( 2 * this.dt );
    frameThis.v = calcFullValue( frameThis.v_x, frameThis.v_y );
    
    frameThis.p = this.mass * frameThis.v;
    frameThis.p_x = this.mass * frameThis.v_x;
    frameThis.p_y = this.mass * frameThis.v_y;
    frameThis.K = this.mass * frameThis.v * frameThis.v / 2;
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
    frameThis.a = calcFullValue( frameThis.a_x, frameThis.a_y );
  }
};

var hexToRGBA = function( hex ) {
  return [
    parseInt( hex.substr( 1, 2 ), 16 ),
    parseInt( hex.substr( 3, 2 ), 16 ),
    parseInt( hex.substr( 5, 2 ), 16 ),
    255
  ];
};

// Object constructor
var Point = function( name, points, matrix, dt, color ) {
  this.dt = dt;
  this.sources = points;
  this.isCenterOfMass = true;
  
  var mass = calc_TotalMass( points );
  var start = calc_StartFrame( points );
  
  SuperPoint.call( this, {
    name: name,
    start: start,
    mass: mass,
    params: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ],
    color: hexToRGBA( color ),
    frames: [],
    track: false
  }, matrix );
  
  reCalcModel.call( this );
};

Point.prototype.axisChangeOrigin = SuperPoint.prototype.axisChangeOrigin;

module.exports = Point;
