'use strict';

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var Panel = function( frame, model, config ) {
  this.view = new View( frame, model, config );
  new Controller( this.view, model, config );
};

module.exports = Panel;