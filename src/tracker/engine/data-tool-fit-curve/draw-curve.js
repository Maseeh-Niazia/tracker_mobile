'use strict';

var FitFunction = require( './fit-function' );

module.exports = function( fit, label_x, x, y ) {
  var func = new FitFunction( fit, label_x );  
  var data = [];
  var total = 0;
  var dev, next;

  for ( var i = 0, l = x.length; i < l; i++ ) {
    next = func.evaluate( x[ i ] );
    
    dev = ( next - y[ i ] );
    
    total += dev * dev;
    
    data.push( {
      x: x[ i ],
      y: next
    } );
  }

  return {
    rmsDev: Math.sqrt( total  / x.length ),
    data: data
  };
};