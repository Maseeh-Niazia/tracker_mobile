'use strict';

/**
 * Has properties like { param_name : param_value }
 * Has property:
 * - position { x, y } with real paper coords for point
 * - position { x1, y1, x2, y2 } with real paper coords for vector
**/

var Frame = function( frame, params ) {
  for ( var i = frame.length; i--; ) {
    this[ params[ i ] ] = frame[ i ];
  }
  
  this.position = {};
};

module.exports = Frame;