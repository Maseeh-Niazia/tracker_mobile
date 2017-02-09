'use strict';

// Dependency model
var SuperPoint = require( './interface/super' );

// Object constructor
var Point = function( model, matrix ) {
  SuperPoint.call( this, model, matrix );
};

Point.prototype.axisChangeOrigin = SuperPoint.prototype.axisChangeOrigin;

module.exports = Point;
