'use strict';

var sum = function( list ) {
  var sum = 0, i;
  
  for ( i = list.length; i--; ) {
    sum += list[ i ];
  }
  
  return isNaN( sum ) ? NaN : sum;
};

var matrix = function( n, m ) {
  var a = new Array( n );
  
  m = m || n;
  
  for ( var i = a.length; i--; ) {
    a[ i ] = new Array( m );
  }
  
  return a;
};

// https://raw.githubusercontent.com/processing-js/processing-js/v1.4.8/processing.js
var copy = function( /*src, srcPos, dest, destPos, length*/ ) {
  var src, srcPos = 0, dest, destPos = 0, length;

  if ( arguments.length === 2 ) {
    // recall itself and copy src to dest from start index 0 to 0 of src.length
    src = arguments[ 0 ];
    dest = arguments[ 1 ];
    length = src.length;
  } else
  if ( arguments.length === 3 ) {
    // recall itself and copy src to dest from start index 0 to 0 of length
    src = arguments[ 0 ];
    dest = arguments[ 1 ];
    length = arguments[ 2 ];
  } else
  if ( arguments.length === 5 ) {
    src = arguments[ 0 ];
    srcPos = arguments[ 1 ];
    dest = arguments[ 2 ];
    destPos = arguments[ 3 ];
    length = arguments[ 4 ];
  }

  // copy src to dest from index srcPos to index destPos of length recursivly on objects
  for ( var i = srcPos, j = destPos; i < length + srcPos; i++, j++ ) {
    if ( dest[ j ] !== undefined ) {
      dest[ j ] = src[ i ];
    } else {
      throw 'array index out of bounds exception';
    }
  }
};

module.exports = {
  sum: sum,
  copy: copy,
  matrix: matrix
};