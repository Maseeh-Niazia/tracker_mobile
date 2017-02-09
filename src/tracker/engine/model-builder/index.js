'use strict';

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var ModelBuilder = function( holder, model ) {
  this.view = new View( holder, model );
  new Controller( this.view, model );
};

ModelBuilder.prototype.hide = function() {
  this.view.hide();
};

module.exports = ModelBuilder;