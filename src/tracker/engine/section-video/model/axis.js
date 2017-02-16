'use strict';

var Axis = function( model ) {
  this.x0 = model.matrix.x0;
  this.y0 = model.matrix.y0;
  this.ang = -1 * Math.toRadians( model.matrix.ang );
  this.visible = model.axis.visible;
  this.draggable = model.axis.draggable;
};

Axis.prototype.getCoords = function( cx, cy, x1, y1 ) {
  return {
    x: cx + ( x1 * Math.cos( this.ang ) + y1 * Math.sin( this.ang ) ),
    y: cy - ( - x1 * Math.sin( this.ang ) + y1 * Math.cos( this.ang ) )
  };
};

module.exports = Axis;