'use strict';

// Dependency
var ArrayLib = require( '../../../utils/array-lib' );
var HessianMinimize = require( './hessian-minimize' );
var LUPDecomposition = require( './lup-decomposition' );

// Private methods
var check_rmsd = function( Veq, xtmp, xx, mx ) {
  // Checks whether xtmp or xx is better, and keep the better one
  if ( isNaN( ArrayLib.sum( xx ) ) ) {
    this.rmsd = this.rmsd_tmp;
    ArrayLib.copy( xtmp, 0, xx, 0, mx );
  } else {
    this.rmsd = Veq.evaluate( xx );
    
    if ( this.rmsd <= this.rmsd_tmp ) {
      this.rmsd_tmp = this.rmsd;
      ArrayLib.copy( xx, 0, xtmp, 0, mx );
    } else {
      this.rmsd = this.rmsd_tmp;
      ArrayLib.copy( xtmp, 0, xx, 0, mx );
    }
  }
};

// Main class
var LevenbergMarquardt = function() {
  this.iterations;
  this.H;
  
  this.rmsd;
  this.rmsd_tmp;
  this.rmsd_tmp1;
  
  this.xtmp
  this.xtmp1;
  
  this.hessian = new HessianMinimize();
};

/**
 * Inputs
 *   Veq  - the function of m parameters whose minimum is sought
 *   x    - the array containing the guess to the solutions
 *   max  - the maximum iteration number
 *   tol  - the tolerance level
**/
LevenbergMarquardt.prototype.minimize = function( Veq, x, max, tol ) {
  var m = x.length, i;
  var D = new Array( m );
  var dx = new Array( m );
  var xxn = new Array( m );
  
  // Remember initial deviation
  this.rmsd_tmp = Veq.evaluate( x );
  // Remembers current deviation
  this.rmsd_tmp1 = this.rmsd_tmp;
  // xtmp remembers incoming guess
  this.xtmp = x.slice( 0 );
  // xtmp1 remembers current better guess
  this.xtmp1 = x.slice( 0 );
  
  // Step sizes for the finite differences
  for ( i = 0; i < m; i++ ) {
    dx[ i ] = ( Math.abs( x[ i ] ) + 1.0 ) / 1E5;
  }
  
  var Lambda = 0.001;
  var relerr = 9999.;
  var err = 9999.;
  var lu, t;
  
  // Use the Levenberg-Marquardt alogorithm along with the modified Hessian
  //   for an equation of several variables start with a reasonable guess.
  this.iterations = 0;
  
  while ( ( err > tol * 1.E-6 ) && ( relerr > tol * 1.E-6 ) && ( this.iterations < max ) && ( Lambda > 1E-6 ) ) {
    this.iterations++;
    
    // The Levenberg-Marquardt trick, adds Lambda to the Hessian diagonals
    // We find the modified H and D for Veq. Here Lambda is a parameter to be changed.
    // Ref: K. Madsen, H. B. Nielsen, O. Tngleff, Methods for Non-Linear
    
    this.H = this.hessian.getHessian( Veq, x, D, dx );
    
    for ( i = 0; i < m; i++ ) {
      this.H[ i ][ i ] = this.H[ i ][ i ] + Lambda;
    }
    
    // Use the LUPDecomposition's solve method
    lu = new LUPDecomposition( this.H );
    
    // The corrections
    xxn = lu.solve( D );
    // New guesses
    for ( i = 0; i < m; i++ ) {
      xxn[ i ] = xxn[ i ] + x[ i ]; 
    }
    
    relerr = x[ 0 ] * x[ 0 ];
    t = x[ 0 ] - xxn[ 0 ];
    err = t * t;
    x[ 0 ] = xxn[ 0 ];
    
    for ( i = 1; i < m; i++ ) {
      relerr += x[ i ] * x[ i ];
      t = x[ i ] - xxn[ i ];
      err += t * t;
      // Copy to go back
      x[ i ] = xxn[ i ];        
    }
    
    // The Levenberg-Marquardt change of Lambda process
    this.rmsd = Veq.evaluate( x );
    
    // Remember better guess and decrease Lambda
    if ( this.rmsd < this.rmsd_tmp1 ) {
      this.rmsd_tmp1 = this.rmsd;
      ArrayLib.copy( x, 0, this.xtmp1, 0, m );
      Lambda = Lambda / 10.;
    } else {
    // Keep previous guess and increase Lambda
      ArrayLib.copy( this.xtmp1, 0, x, 0, m );
      Lambda = Lambda * 10.;
    }
    
    err = Math.sqrt( err );
    relerr = err / ( relerr + tol );
  }
  
  // Check if x is better, else keep old one
  check_rmsd.call( this, Veq, this.xtmp, x, m );
  
  return err;
};

module.exports = LevenbergMarquardt;