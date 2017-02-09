'use strict';

// Dependency model
var Record = require( '../state/record' );

// Interface
var addRecord = function( name ) {
  return function() {
    var index = 1, record;

    while( !isNotUsed( this, name + index ) ) {
      index += 1;
    }

    record = new Record( name + index, '', true );

    this.push( record );

    return record;
  }
};

var removeRecord = function( record ) {
  var ind = this.indexOf( record );

  if ( ind > -1 ) {
    this.splice( ind, 1 );
  }
};

var isNotUsed = function( list, name ) {
  var used = false, i;

  for ( i = list.length; i--; ) {
    if ( list[ i ].name === name ) {
      used = true;
      break;
    }
  }

  return !used;
};

var collectUsedVariables = function( arr, list ) {
  for ( var i = list.length; i--; ) {
    arr.push( list[ i ].name );
  }
};

var removeTimeFromVariables = function( arr ) {
  if ( arr.indexOf( 't' ) > -1 ) {
    arr.splice( arr.indexOf( 't' ), 1 );
  }
};

var isNameNotUsed = function( value ) {
  return isNotUsed( this.parameters, value )
    &&
         isNotUsed( this.initialValues, value )
    &&
         isNotUsed( this.forceFunctions, value );
};

var getInitialNamesAsRegExp = function() {
  var list = [];

  collectUsedVariables( list, this.initialValues );

  return list;
};

var isExpressionValid = function( name, exp ) {
  // Check that expression has only existed variables
  var vars = exp.getListOfVariables();
  var used = [], valid = true;

  // Expression can't have variable as name
  if ( vars.indexOf( name ) > -1 ) {
    return false;
  }

  // Get all expression's names
  collectUsedVariables( used, this.parameters );
  collectUsedVariables( used, this.initialValues );
  collectUsedVariables( used, this.forceFunctions );

  // Special check for initial vaues
  // Only static values permitted
  if ( getInitialNamesAsRegExp.call( this ).indexOf( name ) > -1 ) {
    if ( vars.length > 0 ) {
      valid = false;
      return valid;
    }
  }

  for ( var i = vars.length; i--; ) {
    if ( used.indexOf( vars[ i ] ) < 0 ) {
      valid = false;
      break;
    }
  }

  return valid;
};

var isStateValid = function( list ) {
  var isValid = true;

  for ( var i = list.length; i--; ) {
    isValid = isValid && list[ i ].isValid;
  }

  return isValid;
};

var isModelStateValid = function() {
  return isStateValid( this.parameters )
      && isStateValid( this.initialValues )
      && isStateValid( this.forceFunctions );
};

module.exports = {
  addRecord: addRecord,
  removeRecord: removeRecord,
  isNameNotUsed: isNameNotUsed,
  isExpressionValid: isExpressionValid,
  isModelStateValid: isModelStateValid
};
