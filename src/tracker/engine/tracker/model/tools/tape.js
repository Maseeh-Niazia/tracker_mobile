'use strict';

var DEFAULT_COLOR = '#0000ff';
var DEFAULT_POINTS = [
  { x: 50,  y: 50 },
  { x: 150, y: 50 }
];

var Tape = function( model ) {
  this.points = model.points || DEFAULT_POINTS;
  this.color = model.color || DEFAULT_COLOR;
  this.visible = model.visible || false;
};

module.exports = Tape;