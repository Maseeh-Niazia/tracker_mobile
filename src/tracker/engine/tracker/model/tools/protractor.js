'use strict';

var DEFAULT_COLOR = '#00ff00';
var DEFAULT_POINTS = [
  { x: 120, y:30 },
  { x: 50, y: 100 },
  { x: 120, y: 170 }
];

var Protractor = function( model ) {
  this.points = model.points || DEFAULT_POINTS;
  this.color = model.color || DEFAULT_COLOR;
  this.visible = model.visible || false;
};

module.exports = Protractor;