'use strict';

// Dependency
var Frame = require( '../../property/frame' );

// Constants
var PRECISION = 8;

// Private methods
var buildModelVariables = function() {
  var result = {}, rec, exp, d, i;

  var data = [
    this.state.parameters,
    this.state.initialValues
  ];

  for ( d = data.length; d--; ) {
    for ( i = data[ d ].length; i--; ) {
      rec = data[ d ][ i ];
      exp = rec.mathExpression;

      if ( exp === null ) {
        result[ rec.name ] = 0;
      } else {
        result[ rec.name ] = exp.evaluate( result );
      }
    }
  }

  return result;
};

var vectorLength = function( x, y ) {
  return Math.sqrt( x * x + y * y );
};

var getXYForces = function( variables, t ) {
  var data = this.state.forceFunctions;
  var forces = {}, rec, exp, i;

  for ( i = data.length; i--; ) {
    rec = data[ i ];
    exp = rec.mathExpression;

    if ( exp === null ) {
      forces[ rec.name ] = 0;
    } else {
      forces[ rec.name ] = exp.evaluate( variables );
    }

    variables[ rec.name ] = forces[ rec.name ];
  }

  return forces;
};

var updateFrame_Coords = function( n, variables ) {
  var frameCurr = this.frames[ n ];

  // t
  frameCurr.t = variables.t;

  // x & y
  frameCurr.x = variables.x;
  frameCurr.y = variables.y;
};

var updateFrame_Velocity = function( n, variables ) {
  var framePrev = this.frames[ n - 1 ];
  var frameCurr = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];

  // vx & vy & v & K
  if ( framePrev && frameNext ) {
    if ( !isNaN( framePrev.x ) && !isNaN( frameNext.x ) ) {
      frameCurr.v_x  = ( frameNext.x - framePrev.x ) / ( 2 * this.dt );
      frameCurr.v_x = Number( frameCurr.v_x.toPrecision( PRECISION ) );
    }

    if ( !isNaN( framePrev.y ) && !isNaN( frameNext.y ) ) {
      frameCurr.v_y  = ( frameNext.y - framePrev.y ) / ( 2 * this.dt );
      frameCurr.v_y = Number( frameCurr.v_y.toPrecision( PRECISION ) );
    }

    if ( !isNaN( frameCurr.v_x ) && !isNaN( frameCurr.v_y ) ) {
      frameCurr.v = vectorLength( frameCurr.v_x , frameCurr.v_y );
      frameCurr.v = Number( frameCurr.v.toPrecision( PRECISION ) );
    }

    if ( !isNaN( frameCurr.v ) ) {
      frameCurr.K = variables.m * frameCurr.v * frameCurr.v / 2;
      frameCurr.K = Number( frameCurr.K.toPrecision( PRECISION ) ); 
    }
  }
};

var updateFrame_Acceleration = function( n, variables ) {
  var framePrev2 = this.frames[ n - 2 ];
  var framePrev = this.frames[ n - 1 ];
  var frameCurr = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];
  var frameNext2 = this.frames[ n + 2 ]; 

  // ax & ay & a
  if ( framePrev2 && framePrev && frameCurr && frameNext && frameNext2 ) {
    if ( !isNaN( frameCurr.v_x ) ) {
      frameCurr.a_x = ( 2 * framePrev2.x - framePrev.x - 2 * frameCurr.x - frameNext.x + 2 * frameNext2.x ) / ( 7 * this.dt * this.dt );
      frameCurr.a_x = Number( frameCurr.a_x.toPrecision( PRECISION ) );
    }

    if ( !isNaN( frameCurr.v_y ) ) {
      frameCurr.a_y = ( 2 * framePrev2.y - framePrev.y - 2 * frameCurr.y - frameNext.y + 2 * frameNext2.y ) / ( 7 * this.dt * this.dt );
      frameCurr.a_y = Number( frameCurr.a_y.toPrecision( PRECISION ) );
    }

    if ( !isNaN( frameCurr.a_x ) && !isNaN( frameCurr.a_y ) ) {
      frameCurr.a = vectorLength( frameCurr.a_x , frameCurr.a_y );
      frameCurr.a = Number( frameCurr.a.toPrecision( PRECISION ) );
    }
  }
};

var calcRealPosition = function( frame ) {
  frame.position = this.matrix.getUserPoint( frame.x, frame.y );
};

var clearAllFrames = function() {
  for ( var i = this.frames.length; i--; ) {
    this.frames[ i ] = null;
  }
};

// Public re-calculation method
module.exports = function() {
  // Build all static variables
  var variables = buildModelVariables.call( this );
  var forces;

  // Update mass
  this.mass = variables.m;

  // Clear all frames for new data
  clearAllFrames.call( this );

  // Iterations size
  var framesLength = this.end + 1;

  // Difference in frames if initial t <> 0
  var df = Math.round( variables.t / this.dt );
  var start = this.start + df;

  // No data if start frame out of end bounds
  if ( df > framesLength ) {
    return;
  }

  // Run iterations for all frames
  for ( var f = 0; f < framesLength; f++ ) {
    if ( f < start ) {
      this.frames[ f ] = null;
      continue;
    }

    variables.t = Number( ( this.dt * ( f - this.videoFrameStart ) ).toPrecision( PRECISION ) );

    this.frames[ f ] = new Frame( [], {} );

    forces = getXYForces.call( this, variables );

    updateFrame_Coords.call( this, f, variables );
    updateFrame_Velocity.call( this, f - 1, variables );
    updateFrame_Acceleration.call( this, f - 2, variables );

    calcRealPosition.call( this, this.frames[ f ] );
  }
};