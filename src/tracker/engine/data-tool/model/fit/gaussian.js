'use strict';

var VAR_A = 1;
var VAR_B = 0;
var VAR_C = 1;

var buildEquation = require( './interface/equation' );

var Fit = function( x, y ) {
  this.isKnownPolynomial = false;
  this.isUserDefined = false;
  this.name = 'Guassian';
  this.degree = NaN;
  
  this.parameters = [
    { name: 'a', value: VAR_A },
    { name: 'b', value: VAR_B },
    { name: 'c', value: VAR_C }
  ];
  
  this.expression = 'a*exp(-(' + x + ' - b)^2 / c)';
  this.equation = buildEquation( y + ' = ' + this.expression );
};

module.exports = Fit;