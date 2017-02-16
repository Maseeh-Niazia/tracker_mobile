'use strict';

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var Alert = function( node ) {
  this.view = new View( node );
  new Controller( this.view );
};

module.exports = Alert;