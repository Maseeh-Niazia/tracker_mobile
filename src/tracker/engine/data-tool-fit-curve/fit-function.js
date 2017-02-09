'use strict';

// Dependency
var Parser = require( '../math-parser/index' );
var ArrayLib = require( '../../utils/array-lib' );
var LUPDecomposition = require( './numeric/lup-decomposition' );

// Private methods
var computeCoefficients = function( systemConstants, systemMatrix ) {
  var n = systemConstants.length, i, j;
  
  for ( i = 0; i < n; i++ ) {
    for ( j = i + 1; j < n; j++ ) {
      systemMatrix[ i ][ j ] = systemMatrix[ j ][ i ];
    }
  }
  
  var lupSystem = new LUPDecomposition( systemMatrix );
  var components = lupSystem.inverseMatrixComponents();
  
  LUPDecomposition.symmetrizeComponents( components );
  var coefficients = lupSystem.solve( systemConstants );
  coefficients = coefficients.reverse();
  
  for ( i = coefficients.length; i--; ) {
    this.setParameterValue( i, coefficients[ i ] );
  }
};

var getParams = function( list ) {
  var params = {}, i;
  
  for ( i = list.length; i--; ) {
    params[ list[ i ].name ] = list[ i ].value;
  }
  
  return params;
};

// Main class
var FitFunction = function( fit, label_x ) {
  this.isKnownPolynomial = fit.isKnownPolynomial;
  this.degree = fit.degree;
  
  this.parameters = fit.parameters;
  this.exp = Parser.parse( fit.expression );
  this.params = getParams( this.parameters );
  this.label_x = label_x;
  this.params[ label_x ] = 0;
};

FitFunction.prototype.evaluate = function( x ) {
  this.params[ this.label_x ] = x;
  return this.exp.evaluate( this.params );
};

FitFunction.prototype.getParameterCount = function() {
  return this.parameters.length;
};

FitFunction.prototype.setParameterValue = function( n, value ) {
  var p = this.parameters[ n ];
  this.params[ p.name ] = value;
  p.value = value;
};

FitFunction.prototype.getParameterValue = function( n ) {
  return this.parameters[ n ].value;
};

FitFunction.prototype.fitData = function( xd, yd ) {
  var ncoef = this.degree + 1;
  
  // Return if data array too short
  if ( xd.length < ncoef ) {
    return false;
  }
  
  var systemMatrix = ArrayLib.matrix( ncoef );
  var systemConstants = new Array( ncoef );
  var  i, iL, j, jL, k, xp1, xp2;
  
  // Clear old matrix data
  for( i = 0, iL = systemConstants.length; i < iL; i++ ) {
    systemConstants[ i ] = 0;
    
    for( j = 0, jL = systemConstants.length; j < jL; j++ ) {
      systemMatrix[ i ][ j ] = 0;
    }
  }
  
  // Fill matrix with new data
  for( i = 0, iL = xd.length; i < iL; i++ ) {
    xp1 = 1;
    
    for( j = 0, jL = systemConstants.length; j < jL; j++ ) {
      systemConstants[ j ] += xp1 * yd[ i ];
      xp2 = xp1;
      
      for( k = 0; k <= j; k++ ) {
        systemMatrix[ j ][ k ] += xp2;
        xp2 *= xd[ i ];
      }
      
      xp1 *= xd[ i ];
    }
  }
  
  // Compute coefficients
  computeCoefficients.call( this, systemConstants, systemMatrix );
};

module.exports = FitFunction;