'use strict';

var VAR_A = 0;
var VAR_B = 0;

var buildEquation = require( './interface/equation' );

var Fit = function( x, y ) {
  this.isKnownPolynomial = true;
  this.isUserDefined = false;
  this.name = 'Line';
  this.degree = 1;
  
  this.parameters = [
    { name: 'a', value: VAR_A },
    { name: 'b', value: VAR_B }
  ];
  
  this.expression = 'a*' + x + ' + b';
  this.equation = buildEquation( y + ' = ' + this.expression );
};

module.exports = Fit;