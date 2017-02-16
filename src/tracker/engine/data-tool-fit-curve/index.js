'use-strict';

var FitFunction = require( './fit-function' );
var CurveFitter = require( './curve-fitter' );

var getFitData = function( func, data_x ) {
  var l = data_x.length;
  var fit_data = [], i;
  
  window.func = func;
  
  for ( i = 0; i < l; i++ ) {
    fit_data.push( {
      x: data_x[ i ],
      y: Number( func.evaluate( data_x[ i ] ) )
    } );
  }
  
  return fit_data;
};

module.exports = function( fit, label_x, x, y ) {
  // Build fit funciton
  var func = new FitFunction( fit, label_x );  
  
  // Build curve fitter
  var fitter = new CurveFitter( x, y );
  
  // Try to fit data on current func
  var rmsDev = fitter.fit( func );
  
  // Build fitted curve data
  return {
    rmsDev: rmsDev,
    data: getFitData( func, x )
  };
};