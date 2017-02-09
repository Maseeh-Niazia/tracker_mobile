'use strict';

var VAR_A = 0;
var VAR_B = 0;
var VAR_C = 0;

var buildEquation = require( './interface/equation' );

var Fit = function( x, y ) {
  this.isKnownPolynomial = true;
  this.isUserDefined = false;
  this.name = 'Parabola';
  this.degree = 2;
  
  this.parameters = [
    { name: 'a', value: VAR_A },
    { name: 'b', value: VAR_B },
    { name: 'c', value: VAR_C }
  ];
  
  this.expression = 'a*' + x + '^2 + b*' + x + ' + c';
  this.equation = buildEquation( y + ' = ' + this.expression );
};

module.exports = Fit;