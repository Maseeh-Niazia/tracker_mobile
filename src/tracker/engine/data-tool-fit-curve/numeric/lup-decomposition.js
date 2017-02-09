'use strict';

var ArrayLib = require( '../../../utils/array-lib' );

// Private methods
/**
 * @param c double[]
 * @return double[]
**/
var forwardSubstitution = function( c ) {
  var n = this.rows.length, i, j;
  var answer = new Array( n );
  
  for( i = 0; i < n; i++ ) {
    answer[ i ] = c[ this.permutation[ i ] ];
    
    for( j = 0; j <= i - 1; j++ ) {
      answer[ i ] -= this.rows[ i ][ j ] * answer[ j ];
    }
  }
  
  return answer;
};

/**
 * @param xTilde double[]
 * @return double[]
**/
var backwardSubstitution = function( xTilde ) {
  var n = this.rows.length, i, j;
  var answer = new Array( n );
  
  for( i = n - 1; i >= 0; i-- ) {
    answer[ i ] = xTilde[ i ];
    
    for( j = i + 1; j < n; j++ ) {
      answer[ i ] -= this.rows[ i ][ j ] * answer[ j ];
    }
    
    answer[ i ] /= this.rows[ i ][ i ];
  }
  
  return answer;
};

/**
 * @param k int
 * @return int
**/
var largestPivot = function( k ) {
  var maximum = Math.abs( this.rows[ k ][ k ] );
  var index = k, abs, i, n = this.rows.length;

  for ( i = k + 1; i < n; i++ ) {
    abs = Math.abs( this.rows[ i ][ k ] );
    
    if ( abs > maximum ) {
      maximum = abs;
      index = i;
    }
  }
  
  return index;
};

/**
 * @param k int
**/
var pivot = function( k ) {
  var inversePivot = 1 / this.rows[ k ][ k ];
  var n = this.rows.length;
  var k1 = k + 1, i, j;
  
  for ( i = k1; i < n; i++ ) {
    this.rows[ i ][ k ] *= inversePivot;
    
    for ( j = k1; j < n; j++ ) {
      this.rows[ i ][ j ] -= this.rows[ i ][ k ] * this.rows[ k ][ j ];
    }
  }
};

/**
 * @param i int
 * @param k int
**/
var swapRows = function( i, k ) {
  if ( i !== k ) {
    var temp, j;
    
    for( j = 0; j < this.rows.length; j++ ) {
      temp = this.rows[ i ][ j ];
      this.rows[ i ][ j ] = this.rows[ k ][ j ];
      this.rows[ k ][ j ] = temp;
    }
    
    var nTemp = this.permutation[ i ];
    this.permutation[ i ] = this.permutation[ k ];
    this.permutation[ k ] = nTemp;
    
    this.parity = -1 * this.parity;
  }
};

var decompose = function() {
  var n = this.rows.length, i;
  
  this.permutation = new Array( n );
  
  for ( i = 0; i < n; i++ ) {
    this.permutation[ i ] = i;
  }
  
  this.parity = 1;
  
  try {
    for( i = 0; i < n; i++ ) {
      swapRows.call( this, i, largestPivot.call( this, i) );
      pivot.call( this, i );
    }
  } catch( err ) {
    this.parity = 0;
  }
};

/**
 * @return boolean, true if decomposition was done already
**/
var decomposed = function() {
  if ( ( this.parity === 1 ) && ( this.permutation === null ) ) {
    decompose.call( this );
  }
  
  return this.parity !== 0;
};

/**
 * @param components double[][], components obtained from constructor methods.
**/
var initialize = function( components ) {
  // Make copy of components
  var n = components.length, i;
  this.rows = ArrayLib.matrix( n );
  
  // Loop over the rows
  for( i = 0; i < n; i++ ) {
    this.rows[ i ] = components[ i ].slice( 0 );
  }
  
  // Reset permutation
  this.permutation = null;
  this.parity = 1;
};

// Main class
/**
 * components - Matrix n * n
**/
var LUPDecomposition = function( components ) {
  // Matrix n * n
  this.rows;
  
  // Permutation
  this.permutation = null;

  //Permutation's parity
  this.parity = 1;
  
  // Initiate decomposition
  initialize.call( this, components );
};

/**
 * @param c double[]
 * @return double[]
**/
LUPDecomposition.prototype.solve = function( c ) {
  return decomposed.call( this ) ? backwardSubstitution.call( this, forwardSubstitution.call( this, c ) ) : null;
};

/**
 * Calculates the inverse matrix components.
 *
 * @return the matrix inverse or null if the inverse does not exist
**/

LUPDecomposition.prototype.inverseMatrixComponents = function() {
  if ( !decomposed.call( this ) ) {
    return null;
  }
  var n = this.rows.length, i, j;
  var inverseMatrix = ArrayLib.matrix( n );
  var column = new Array( n );
  
  for ( i = 0; i < n; i++ ) {
    for ( j = 0; j < n; j++ ) {
      column[ j ] = 0;
    }
    
    column[ i ] = 1;
    column = this.solve( column );
    
    for ( j = 0; j < n; j++ ) {
      if ( isNaN( column[ j ] ) ) {
        return null;
      }
      
      inverseMatrix[ j ][ i ] = column[ j ];
    }
  }
  
  return inverseMatrix;
};

/**
 * Make sure the supplied matrix components are those of
 *   a symmetric matrix
 * 
 * @param components double
**/

LUPDecomposition.symmetrizeComponents = function( components ) {
  var n = components.length, i, j;
  
  for ( i = 0; i < n; i++ ) {
    for ( j = i + 1; j < n; j++ ) {
      components[ i ][ j ] += components[ j ][ i ];
      components[ i ][ j ] *= 0.5;
      components[ j ][ i ] = components[ i ][ j ];
    }
  }
};

module.exports = LUPDecomposition;