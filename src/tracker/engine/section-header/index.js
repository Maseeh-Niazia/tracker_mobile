'use strict';

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var Header = function( node, config, model ) {
  this.view = new View( node, config, model );
  new Controller( this.view, model );
};

module.exports = Header;