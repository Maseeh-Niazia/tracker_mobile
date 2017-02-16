'use strict';

// Constants
var DYNAMIC = 'DYNAMIC';
var ANALYTIC = 'ANALYTIC';

// Dependency model
var State = {};
var reCalc = {};
var functions = {};
var SuperPoint = require( './interface/super' );

State[ DYNAMIC ] = require( './state/state-dynamic' );
State[ ANALYTIC ] = require( './state/state-analytic' );

reCalc[ DYNAMIC ] = require( './interface/recalc/dynamic' );
reCalc[ ANALYTIC ] = require( './interface/recalc/analytic' );

functions[ DYNAMIC ] = 'Force Functions';
functions[ ANALYTIC ] = 'Position Functions';

// Object constructor
var Point = function( model, matrix, dt, frameStart, type ) {
  this.dt = dt;
  this.isModel = true;
  this.end = model.end;
  this.modelType = type || Point.DYNAMIC;
  this.reCalcModel = reCalc[ this.modelType ];
  this.functionsName = functions[ this.modelType ];
  this.state = new State[ this.modelType ]( model );
  
  this.videoFrameStart = frameStart;

  SuperPoint.call( this, model, matrix );
};

Point.DYNAMIC = DYNAMIC;
Point.ANALYTIC = ANALYTIC;

Point.prototype.axisChangeOrigin = SuperPoint.prototype.axisChangeOrigin;

module.exports = Point;
