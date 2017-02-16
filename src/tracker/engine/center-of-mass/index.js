'use strict';

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var CenterOfMass = function( holder, model ) {
  this.view = new View( holder, model );
  new Controller( this.view, model );
};

module.exports = CenterOfMass;