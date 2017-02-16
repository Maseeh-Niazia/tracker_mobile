'use strict';

var Parser = require( '../../../../math-parser/index' );

var Record = function( name, expression, nameIsEditable ) {
  this.isValid = true;
  this.name = name || '';
  this.nameIsEditable = nameIsEditable;
  this.expression = expression || '0,0';
  this.mathExpression = expression ? this.getValidExpression( expression ) : null;
};

Record.prototype.setExpression = function( value, exp ) {
  this.mathExpression = exp;
  this.expression = value;
  return true;
};

Record.prototype.setName = function( name ) {
  this.name = name;
};

Record.prototype.isNameValid = function( value ) {
  return ( /^[a-zA-Z]([a-zA-Z0-9]*)?$/ ).test( value );
};

Record.prototype.getValidExpression = function( value ) {
  value = value.replace( /,/g, '.' );
  
  try {
    return Parser.parse( value );
  } catch( err ) {
    return null;
  }
};

module.exports = Record;