'use strict';

// Dependency nimeric
var HessianMinimize = require( './numeric/hessian-minimize' );
var LevenbergMarquardt = require( './numeric/levenberg-marquardt' );
var MinimizeUserFunction = require( './numeric/function-minimize' );

/**
 * Determines the Pearson correlation and linear fit parameter SEs.
 *
 * @param xd double[]
 * @param yd double[]
 * @param isLinearFit true if linear fit (sets uncertainties to slope and intercept SE)
**/
var doLinearRegression = function( xd, yd, isLinearFit ) {	
  var n = xd.length, i;
  
  // Set NaN defaults
  var uncertainties = new Array( 2 );
  var correlation = NaN;
  
  for ( i = 0; i < uncertainties.length; i++ ) {
    uncertainties[ i ] = NaN;
  }
  
  // Return if less than 3 data points
  if ( n < 3) {
    return false;
  }
  
  var mean_x = xd[ 0 ];
  var mean_y = yd[ 0 ];    
  
  for ( i = 1; i < n; i++ ) {
    mean_x += xd[ i ];
    mean_y += yd[ i ];
  }
  
  mean_x /= n;
  mean_y /= n;
  
  var sum_sq_x = 0;
  var sum_sq_y = 0;
  var sum_coproduct = 0;
  
  for ( i = 0; i < n; i++ ) {
    var delta_x = xd[ i ] - mean_x;
    var delta_y = yd[ i ] - mean_y;
    
    sum_sq_x += delta_x * delta_x;
    sum_sq_y += delta_y * delta_y;
    sum_coproduct += delta_x * delta_y;
  }
  
  if ( sum_sq_x === 0 || sum_sq_y === 0 ) {
    correlation = NaN;
    
    for ( i = 0; i < uncertainties.length; i++) {
      uncertainties[ i ] = NaN;
    }
    
    return false;
  }
  
  var pop_sd_x = sum_sq_x / n;
  var pop_sd_y = sum_sq_y / n;
  var cov_x_y = sum_coproduct / n;
  
  correlation = cov_x_y * cov_x_y / ( pop_sd_x * pop_sd_y );   
  
  if ( isLinearFit ) {
    var sumSqErr =  Math.max( 0.0, sum_sq_y - sum_coproduct * sum_coproduct / sum_sq_x );
    var meanSqErr = sumSqErr / ( n - 2 );
    
    // slope SE
    uncertainties[ 0 ] = Math.sqrt( meanSqErr / sum_sq_x );
    // intercept SE
    uncertainties[ 1 ] = Math.sqrt( meanSqErr * ( ( 1.0 / n ) + ( mean_x * mean_x) / sum_sq_x ) );
  }
  
  return uncertainties;
};

var getDevSquared = function( f, x, y ) {
  var fitEvaluatedToNaN = false;
  var total = 0;
  var dev, i, l;
  
  for ( i = 0, l = x.length; i < l; i++ ) {
    var next = f.evaluate( x[ i ] );
    
    if ( isNaN( next ) ) {
      fitEvaluatedToNaN = true;
      break
    }
    
    dev = ( next - y[ i ] );
    
    total += dev * dev;
  }
  
  return fitEvaluatedToNaN ? NaN : total;
};

// Main class
var CurveFitter = function( x, y ) {
  this.uncertainties = new Array( 2 );
  this.x = x;
  this.y = y;
};

/**
 * Fits a fit function to the current data.
 *
 * @param fit the function to fit
 * @return the rms deviation
**/
CurveFitter.prototype.fit = function( fit ) {
  var devSq = 0, i;
  var x = this.x;
  var y = this.y;
    
  var prevDevSq = getDevSquared( fit, x, y );
  
  var isLinearFit = false;
  
  var hessian = new HessianMinimize();
  var levmar = new LevenbergMarquardt();
  
  if ( !isNaN( prevDevSq ) ) {
    if ( fit.isKnownPolynomial ) {
      fit.fitData( x, y );
      isLinearFit = ( fit.degree === 1 );
    } else {
      var params = new Array( fit.getParameterCount() );
      
      if ( params.length > 0 && params.length <= x.length ) {
        var minFunc = new MinimizeUserFunction( fit, x, y );
        var prevParams = new Array( params.length );
        
        for( i = 0; i < params.length; i++) {
          params[ i ] = prevParams[ i ] = fit.getParameterValue( i );
        }
        
        var tol = 1.0E-6;
        var iterations = 20;
        
        hessian.minimize( minFunc, params, iterations, tol );
        
        // Get deviation after minimizing
        devSq = getDevSquared( fit, x, y );
        
        // Restore parameters and try Levenberg-Marquardt if Hessian fit is worse
        if ( devSq > prevDevSq ) {
          for( i = 0; i < prevParams.length; i++ ) {
            fit.setParameterValue( i, prevParams[ i ] );
          }
          
          levmar.minimize( minFunc, params, iterations, tol );
          
          // Get deviation after minimizing
          devSq = getDevSquared( fit, x, y );
        }
        
        // Restore parameters and deviation if new fit is worse
        if ( devSq > prevDevSq ) {
          for ( i = 0; i < prevParams.length; i++ ) {
            fit.setParameterValue( i, prevParams[ i ] );
          }
          
          devSq = prevDevSq;
          // TODO: send error with no fit!
        }
      }
    }
  }
  
  doLinearRegression( x, y, isLinearFit );
  
  if ( devSq === 0 ) {
    devSq = getDevSquared( fit, x, y );
  }
    
  var rmsDev = Math.sqrt( devSq / x.length );
  
  if ( x.length === 0 || y.length === 0 ) {
    //rmsField.setText(ToolsRes.getString("DatasetCurveFitter.RMSField.NoData")); //$NON-NLS-1$
    //rmsField.setForeground(Color.RED);
  } else
  if ( isNaN( rmsDev ) ) {
    //rmsField.setText(ToolsRes.getString("DatasetCurveFitter.RMSField.Undefined")); //$NON-NLS-1$
    //rmsField.setForeground(Color.RED);
  } else {
    //rmsField.applyPattern("0.000E0"); //$NON-NLS-1$
    //rmsField.setValue(rmsDev);
  }
  
  return rmsDev;
};

module.exports = CurveFitter;