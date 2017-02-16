'use strict';

// Interface
var buildEquation = require( './interface/equation' );

// Private methods
var getFreeParameterName = function() {
  var names = this.parameters.map( function( p) {
    return p.name;
  } );
  
  var num = 1;
  
  while( names.indexOf( 'param' + num ) > -1 ) {
    num += 1;
  }
  
  return 'param' + num;
};

var isParamNameExists = function( name ) {
  var names = this.parameters.map( function( p ) {
    return p.name;
  } );
  
  return names.indexOf( name ) > -1;
};

// Main Fit class
var Fit = function( x, y, name ) {
  this.isKnownPolynomial = false;
  this.isUserDefined = true;
  this.name = name;
  this.degree = NaN;
  
  this.x = x;
  this.y = y;
  
  this.parameters = [];
  
  this.expression = '';
  this.equation = buildEquation( this.y + ' = ' + this.expression );
};

Fit.prototype.addParameter = function() {
  var name = getFreeParameterName.call( this );
  var p = { name: name, value: 0 };
  this.parameters.push( p );
  return p;
};

Fit.prototype.delParameter = function( p ) {
  var num = this.parameters.indexOf( p );
  
  if ( num > -1 ) {
    this.parameters.splice( num, 1 );
  }
};

Fit.prototype.isParameterNameValid = function( name ) {
  var isTextValid = (/^[a-zA-Z]([a-zA-Z0-9_]*)?$/).test( name );
  var isNameExisted = isParamNameExists.call( this, name );
  return isTextValid && !isNameExisted && name !== this.name;
};

Fit.prototype.isParameterExpressionValid = function( value ) {
  return !isNaN( Number( value ) );
};

Fit.prototype.setExpression = function( value ) {
  this.expression = value;
  this.equation = buildEquation( this.y + ' = ' + this.expression );
};

Fit.prototype.hasExpression = function() {
  return !!this.expression;
};

Fit.prototype.update = function( x ) {
  var regexp = new RegExp( this.x, 'g' );
  
  this.expression = this.expression.replace( regexp, x );
  this.equation = buildEquation( this.equation.replace( regexp, x ) );

  return this;
};

module.exports = Fit;