'use strict';

// Dependency model
var Record = require( './record' );
var iState = require( '../interface/state' );

// Model constructor
var State = function( model ) {
  this.parameters = [
    new Record( 'm', model.mass ? model.mass.toString().replace( /\./g, ',' ) : 0, false ),
  ];
  this.initialValues = [
    new Record( 't', 0, false ),
    new Record( 'x', 0, false ),
    new Record( 'y', 0, false ),
    new Record( 'vx', 0, false ),
    new Record( 'vy', 0, false )
  ];
  this.forceFunctions = [
    new Record( 'fx', 0, false ),
    new Record( 'fy', 0, false )
  ];

  this.parameters.addRecord = iState.addRecord( 'param' );
  this.parameters.removeRecord = iState.removeRecord;

  this.forceFunctions.addRecord = iState.addRecord( 'force' );
  this.forceFunctions.removeRecord = iState.removeRecord;
};

State.prototype.isNameNotUsed = iState.isNameNotUsed;
State.prototype.isExpressionValid = iState.isExpressionValid;
State.prototype.isModelStateValid = iState.isModelStateValid;

module.exports = State;
