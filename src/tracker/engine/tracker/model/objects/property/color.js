'use strict';

// Private methods
var getOpacity = function( opacity ) {
  return Math.min( Math.max( opacity / 255, 0 ), 1 );
};

var getHexColor = function( color ) {
  var result = '#', i, l, h;
  
  for ( i = 0, l = 3; i < l; i++ ) {
    h = color[ i ] < 16 ? '0' : '';
    h += color[ i ].toString( 16 );
    result += h;
  }
  
  return result;
};

// Color constructor
var Color = function( color ) {
  this.value = getHexColor( color  );
  this.opacity = getOpacity( color[ 3 ] );
};

module.exports = Color;