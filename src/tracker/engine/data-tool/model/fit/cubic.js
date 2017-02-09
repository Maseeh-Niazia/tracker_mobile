'use strict';

var VAR_A = 0;
var VAR_B = 0;
var VAR_C = 0;
var VAR_D = 0;

var buildEquation = require( './interface/equation' );

var Fit = function( x, y ) {
  this.isKnownPolynomial = true;
  this.isUserDefined = false;
  this.name = 'Cubic';
  this.degree = 3;
  
  this.parameters = [
    { name: 'a', value: VAR_A },
    { name: 'b', value: VAR_B },
    { name: 'c', value: VAR_C },
    { name: 'd', value: VAR_D }
  ];
  
  this.expression = 'a*' + x + '^3 + b*' + x + '^2 + c*' + x + ' + d';
  this.equation = buildEquation( y + ' = ' + this.expression );
};

module.exports = Fit;