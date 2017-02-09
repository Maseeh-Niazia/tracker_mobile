'use strict';

var getTotalPower = function( n ) {
  var total = 0;
  while( n >= 1 ) {
    n = n / 10;
    total += 1;
  }
  return total;
};

var getFrameNumber = function( n, total ) {
  n = n.toString();
  for ( var i = total - n.length; i--; ) {
    n = '0' + n;
  }
  return n;
};

var getFrames = function( folder, n ) {
  var total = getTotalPower( n );
  var frames = [], i;
  
  for ( i = 0; i <= n; i++ ) {
    frames.push( require( '../applications/' + folder + '/video/frame-' + getFrameNumber( i, total ) + '.jpg' ) );
  }
  
  return frames;
};

module.exports = getFrames;