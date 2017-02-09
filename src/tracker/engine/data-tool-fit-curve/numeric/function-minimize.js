'use strict';

var MinimizeUserFunction = function( f, x, y ) {
  this.f = f;
  this.x = x;
  this.y = y;
};

MinimizeUserFunction.prototype.evaluate = function( params ) {
  var sum = 0, dev, i, l;
  
  // Set new parameters
  for ( i = params.length; i--; ) {
    this.f.setParameterValue( i, params[ i ] );
  }
  
  // Evaluate
  for ( i = 0, l = this.x.length; i < l; i++ ) {
    dev = this.y[ i ] - this.f.evaluate( this.x[ i ] );
    sum += dev * dev;
  }
  
  return sum;
};

module.exports = MinimizeUserFunction;