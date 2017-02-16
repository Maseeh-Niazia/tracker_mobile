'use-strict';

// Dependency
var ArrayLib = require( '../../../utils/array-lib' );
var LUPDecomposition = require( './lup-decomposition' );

// Private methods;
var crudeGuess = function( Veq, x ) {
/**
 * @Author J E Hasbun 2007.
 * This is a crude method to obtain better starting guesses for the
 * multiple funtion variable minimization problem. It uses a Naive
 * Newton Raphson step for each of the variables.
 * Ref: Computational Physics by P. L. Devries (J. Wiley, 1993)
**/
  var sp, s0, sm;
  var m = x.length; // array size
  var Nc = 5;       // cycles to make
  var f = 0.35;  // moderates the step size to next crude guess
  var n = 0;        // cycle counter
  var dx = new Array( m );
  
  this.xp = new Array( m );
  this.xm = new Array( m );
  
  var i, k;
  
  for ( i = 0; i < m; i++ ) {
    dx[ i ] = ( Math.abs( x[ i ] ) + 1.0 ) / 1.E3; // step sizes for the finite derivatives
  }
  
  // Cycle through each parameter Nc times
  while ( n < Nc ) {
    n++;
    
    for ( i = 0; i < m; i++ ) {
    // The SUM will be evaluated with the parameters
    // xp, a, and xm:
      for ( k = 0; k < m; k++ ) {
        if ( k == i ) {
          this.xp[ i ] = x[ i ] + dx[ i ];
          this.xm[ i ] = x[ i ] - dx[ i ];
        } else {
          this.xp[ k ] = x[ k ];
          this.xm[ k ] = x[ k ];
        }
      }
      sp = Veq.evaluate( this.xp ); //  Evaluate the sum.
      s0 = Veq.evaluate( x );
      sm = Veq.evaluate( this.xm );
      
      // Make the crude Newton-Raphson step next
      x[ i ] = x[ i ] - f * 0.5 * dx[ i ] * ( sp - sm ) / ( sp - 2.0 * s0 + sm ) || x[ i ];
      
      // As we move towards a minimum, we should decrease
      //   step size used in calculating the derivative.
      dx[ i ] = 0.5 * dx[ i ];
    }
  }
};

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

var allocateArrays = function( m ) {
  this.H = ArrayLib.matrix( m );
  this.xp = new Array( m );
  this.xm = new Array( m );
  this.xpp = new Array( m );
  this.xpm = new Array( m );
  this.xmp = new Array( m );
  this.xmm = new Array( m );
};

var allocateArraysOthers = function( m ) {
  this.xpp = new Array( m );
  this.xpm = new Array( m );
  this.xmp = new Array( m );
  this.xmm = new Array( m );
};

var getHessian = function( Veq, x, D, dx ) {
/**
 * @Author J E Hasbun 2007.
 * Finds the Hessian of a function of several variables
 * The method is similar to the Newton method but for the derivative of a
 * general function. The idea is that to "minimize" a multivariable function
 * Veq({X}), we need the guess {Xnew}={Xold} + inverse{H} * {D}, so here we find
 * H and D for Veq. Ref: Computational Physics by P. L. Devries (J. Wiley, 1993)
 * 
 * Input:
 *   Veq - the function of m parameters whose minimum is sought
 *   x   - the parameters
 *   dx  - the size of the variations used in the derivatives
 * Uses:
 *   H   - the square matrix containing the calculated Hessian as a return
 *     the Hessian is a square matrix of 2nd order partial derivatives of
 *     of Veq with respect to the variables
 *   D   - the 1st order negative partial derivative of Veq
 *     builds the Hessian H - used in a multidimensional newton method
 *     the arrays contain:
 *   x   - the variable parameters of function Veq
 *   x   - x[1], ...,      x[i],..., x[m]
 *   xp  - x[1], ..., x[i]+dx[i],..., x[m]
 *   xm  - x[1], ..., x[i]-dx[i],..., x[m]
 *   xpp - x[1],..,x[i]+dx[i],..., x[j]+dx[j],..., x[m]
 *   xpm - x[1],..,x[i]+dx[i],..., x[j]-dx[j],..., x[m]
 *   xmp - x[1],..,x[i]-dx[i],..., x[j]+dx[j],..., x[m]
 *   xmm - x[1],..,x[i]-dx[i],..., x[j]-dx[j],..., x[m]
**/
    
  // The Hessian H is calculated by the finite difference method
  var m = x.length, i, j, k;
  
  if ( !this.xp || ( this.xp.length !== m ) ) {
    allocateArrays.call( this, m );
  }
  
  allocateArraysOthers.call( this, m );
  
  // Compute the Hessian:
  for ( i = 0; i < m; i++ ) {
    for ( j = i; j < m; j++ ) {
      if ( i === j ) {
        // reset the x's
        for ( k = 0; k < m; k++ ) {
          this.xp[ k ] = x[ k ];
          this.xm[ k ] = x[ k ];
        }
        // change the i'th one
        this.xp[ i ] = x[ i ] + dx[ i ];
        this.xm[ i ] = x[ i ] - dx[ i ];
        this.H[ i ][ i ] = ( Veq.evaluate( this.xp ) - 2.0 * Veq.evaluate( x ) + Veq.evaluate( this.xm ) ) / ( dx[ i ] * dx[ i ] );
      } else {
        // reset the x's
        for ( k = 0; k < m; k++ ) {
          this.xpp[ k ] = x[ k ];
          this.xpm[ k ] = x[ k ];
          this.xmp[ k ] = x[ k ];
          this.xmm[ k ] = x[ k ];
        }
        // change the i'th, jth ones
        this.xpp[ i ] = x[ i ] + dx[ i ];       
        this.xpp[ j ] = x[ j ] + dx[ j ];
        this.xpm[ i ] = x[ i ] + dx[ i ];
        this.xpm[ j ] = x[ j ] - dx[ j ];
        this.xmp[ i ] = x[ i ] - dx[ i ];
        this.xmp[ j ] = x[ j ] + dx[ j ];
        this.xmm[ i ] = x[ i ] - dx[ i ];
        this.xmm[ j ] = x[ j ] - dx[ j ];
        this.H[ i ][ j ] = ( ( Veq.evaluate( this.xpp ) - Veq.evaluate( this.xpm ) ) / ( 2.0 * dx[ j ] ) - ( Veq.evaluate( this.xmp ) - Veq.evaluate( this.xmm ) ) / ( 2.0 * dx[ j ] ) ) / ( 2.0 * dx[ i ] );
        this.H[ j ][ i ] = this.H[ i ][ j ];
      }
    }
  }
  
  // Note the D function is the negative of the partial derivative
  for ( i = 0; i < m; i++ ) {
    // reset the x's
    for ( k = 0; k < m; k++ ) {
      this.xp[ k ] = x[ k ];
      this.xm[ k ] = x[ k ];
    }
    
    // change the i'th one
    this.xp[ i ] = x[ i ] + dx[ i ];        
    this.xm[ i ] = x[ i ] - dx[ i ];
    D[ i ] = -1 * ( Veq.evaluate( this.xp ) - Veq.evaluate( this.xm ) ) / ( 2.0 * dx[ i ] );
  }
  
  return this.H;
};

// Main class
var HessianMinimize = function() {
  this.iterations;
  this.H;
  this.xp;
  this.xm;
  this.xpp;
  this.xpm;
  this.xmp;
  this.xmm;
  this.rmsd_tmp;
  this.rmsd;
  this.xtmp;
};

HessianMinimize.prototype.minimize = function( Veq, x, max, tol ) {
  var m = x.length;
  var xxn = new Array( m );
  var D = new Array( m );
  var dx = new Array( m );
  var i;
  
  this.xtmp = x.slice( 0 );
  this.rmsd_tmp = Veq.evaluate( x );
  this.rmsd = 0;
  this.H = ArrayLib.matrix( m );
  
  // Obtain a crude guess
  crudeGuess.call( this, Veq, x );
  
  //Check if x is better, else keep old one
  check_rmsd.call( this, Veq, this.xtmp, x, m );
  
  for ( i = 0; i < m; i++ ) {
    dx[ i ] = ( Math.abs( x[ i ] ) + 1.0 ) / 1E5; //step sizes for the finite differences
  }
  
  var relerr = 9999.;
  var err = 9999.;
  var t;
  
  // Use the Hessian method for an equation of several variables
  // start with a good guess.
  this.iterations = 0;
  
  while ( ( err > tol * 1.E-6 ) && ( relerr > tol * 1.E-6 ) && ( this.iterations < max ) ) {
    this.iterations++;
    
    // Use the LUPDecomposition's solve method
    var lu = new LUPDecomposition( this.getHessian( Veq, x, D, dx ) );
    
    // The corrections
    xxn = lu.solve( D );
    
    // New guesses
    for (  i = 0; i < m; i++ ) {
      xxn[ i ] = xxn[ i ] + x[ i ];
    }
    
    t = x[ 0 ] - xxn[ 0 ];
    err = t * t;
    
    relerr = x[ 0 ] * x[ 0 ];
    x[ 0 ] = xxn[ 0 ];
    
    for ( i = 1; i < m; i++ ) {
      t = x[ i ] - xxn[ i ];
      err += t * t;
      
      relerr += x[ i ] * x[ i ];
      x[ i ] = xxn[ i ];
    }
    
    // The error
    err = Math.sqrt( err );
    relerr = err / ( relerr + tol );
  }
  
  // Check if x is better, else keep old one
  check_rmsd.call( this, Veq, this.xtmp, x, m ); 
  
  return err;
};

HessianMinimize.prototype.getHessian = getHessian;

module.exports = HessianMinimize;