'use strict';

// Constants
var PRECISION = 8;
var TRASE_PTS_PER_STEP = 10;
var ITERATIONS_PER_STEP = 100;

// Dependency
var Frame = require( '../../property/frame' );

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

var getXYForces = function( variables, state ) {
  var data = this.state.forceFunctions;
  var forces = {}, rec, exp, i;

  variables.x = state[ 0 ];
  variables.vx = state[ 1 ];
  variables.y = state[ 2 ];
  variables.vy = state[ 3 ];
  variables.t = state[ 4 ];

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

var getRate = function( variables, state, rate ) {
  var f = getXYForces.call( this, variables, state );

  // vx = dx / dt
  rate[ 0 ] = state[ 1 ];
  // ax = dvx / dt
  rate[ 1 ] = variables.m ? f.fx / variables.m : 0;
  // vy = dy / dt
  rate[ 2 ] = state[ 3 ];
  // ay = dvy / dt
  rate[ 3 ] = variables.m ? f.fy / variables.m : 0;
  // dt / dt
  rate[ 4 ] = 1;
};

var solverStep = function( ctx ) {
  var i;
  var variables = ctx.variables;
  var stepSize = ctx.stepSize;
  var numEqn = ctx.numEqn;
  var state = ctx.state;
  var rate1 = ctx.rate1;
  var rate2 = ctx.rate2;
  var rate3 = ctx.rate3;
  var rate4 = ctx.rate4;
  var estimated_state = ctx.estimated_state;

  // 1
  getRate.call( this, variables, state, rate1 );

  for ( i = 0; i < numEqn; i++ ) {
    estimated_state[ i ] = state[ i ] + stepSize * rate1[ i ] / 2;
  }

  // 2
  getRate.call( this, variables, estimated_state, rate2 );

  for ( i = 0; i < numEqn; i++ ) {
    estimated_state[ i ] = state[ i ] + stepSize * rate2[ i ] / 2;
  }

  // 3
  getRate.call( this, variables, estimated_state, rate3 );

  for ( i = 0; i < numEqn; i++ ) {
    estimated_state[ i ] = state[ i ] + stepSize * rate3[ i ];
  }

  // 4
  getRate.call( this, variables, estimated_state, rate4 );

  for ( i = 0; i < numEqn; i++ ) {
    state[ i ] = state[ i ] + stepSize * ( rate1[ i ] + 2 * rate2[ i ] + 2 * rate3[ i ] + rate4[ i ] ) / 6;
  }
};

var updateFrame_Coords = function( n, variables, state ) {
  var frameCurr = this.frames[ n ];

  // t
  frameCurr.t = Number( this.dt * ( n - this.start ).toPrecision( PRECISION ) );

  // x & y
  frameCurr.x = state[ 0 ];
  frameCurr.y = state[ 2 ];
};

var updateFrame_Velocity = function( n, variables, state ) {
  var framePrev = this.frames[ n - 1 ];
  var frameCurr = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];

  // vx & vy & v & K
  if ( framePrev && frameNext ) {
    if ( !isNaN( framePrev.x ) && !isNaN( frameNext.x ) ) {
      frameCurr.v_x  = ( frameNext.x - framePrev.x ) / ( 2 * this.dt );
    }

    if ( !isNaN( framePrev.y ) && !isNaN( frameNext.y ) ) {
      frameCurr.v_y  = ( frameNext.y - framePrev.y ) / ( 2 * this.dt );
    }

    if ( !isNaN( frameCurr.v_x ) && !isNaN( frameCurr.v_y ) ) {
      frameCurr.v = vectorLength( frameCurr.v_x , frameCurr.v_y );
    }

    if ( !isNaN( frameCurr.v ) ) {
      frameCurr.K = variables.m * frameCurr.v * frameCurr.v / 2;
    }
  }
};

var updateFrame_Acceleration = function( n, variables, state ) {
  var framePrev2 = this.frames[ n - 2 ];
  var framePrev = this.frames[ n - 1 ];
  var frameCurr = this.frames[ n ];
  var frameNext = this.frames[ n + 1 ];
  var frameNext2 = this.frames[ n + 2 ]; 

  // ax & ay & a
  if ( framePrev2 && framePrev && frameCurr && frameNext && frameNext2 ) {
    if ( !isNaN( frameCurr.v_x ) ) {
      frameCurr.a_x  = variables.fx / variables.m;
    }

    if ( !isNaN( frameCurr.v_y ) ) {
      frameCurr.a_y  = variables.fy / variables.m;
    }

    if ( !isNaN( frameCurr.a_x ) && !isNaN( frameCurr.a_y ) ) {
      frameCurr.a = vectorLength( frameCurr.a_x , frameCurr.a_y );
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

  // Update mass
  this.mass = variables.m;

  // Clear all frames for new data
  clearAllFrames.call( this );

  // Iterations size
  var framesLength = this.end + 1;
  var count = TRASE_PTS_PER_STEP * ITERATIONS_PER_STEP;

  // Difference in frames if initial t <> 0
  var df = Math.round( variables.t / this.dt );
  var start = this.start + df;

  // No data if start frame out of end bounds
  if ( df > framesLength ) {
    return;
  }

  // Correct initial time
  var t0 = Number( ( df * this.dt ).toPrecision( PRECISION ) );
  
  // Get initial state [ x, vx, y, vy, t ]
  var state = [
    variables.x,
    variables.vx,
    variables.y,
    variables.vy,
    0
  ];

  // Calculate step size for iterations
  var numEqn = state.length;
  var dt = this.dt / TRASE_PTS_PER_STEP;
  var stepSize = dt / ITERATIONS_PER_STEP;

  // Initiate solver rates
  var rate1 = new Array( numEqn );
  var rate2 = new Array( numEqn );
  var rate3 = new Array( numEqn );
  var rate4 = new Array( numEqn );
  var estimated_state = new Array( numEqn );

  // Initial frame
  this.frames[ start ] = new Frame( [], {} );
  this.frames[ start ].t = t0;
  this.frames[ start ].x = variables.x;
  this.frames[ start ].y = variables.y;
  this.frames[ start ].v_x = NaN;
  this.frames[ start ].v_y = NaN;
  this.frames[ start ].a_x = NaN;
  this.frames[ start ].a_y = NaN;

  calcRealPosition.call( this, this.frames[ start ] );

  // Context for solver
  var ctx = {
    variables       : variables,
    stepSize        : stepSize,
    numEqn          : numEqn,
    state           : state,
    rate1           : rate1,
    rate2           : rate2,
    rate3           : rate3,
    rate4           : rate4,
    estimated_state : estimated_state
  };

  // Run iterations for all frames
  for ( var f = 0; f < framesLength; f++ ) {
    if ( f < start + 1 ) {
      if ( f !== start ) {
        this.frames[ f ] = null;
      }
      continue;
    }
    
    for ( var s = 0; s < count; s++ ) {
      solverStep.call( this, ctx );
    }

    this.frames[ f ] = new Frame( [], {} );

    updateFrame_Coords.call( this, f, variables, state );
    updateFrame_Velocity.call( this, f - 1, variables, state );
    updateFrame_Acceleration.call( this, f - 2, variables, state );

    calcRealPosition.call( this, this.frames[ f ] );
  }
};