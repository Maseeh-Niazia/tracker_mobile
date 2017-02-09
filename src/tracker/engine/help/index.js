'use strict';
/* global module require:true */

var View = require( './view/view' );
var Controller = require( './controller/controller' );

var Help = function( node ) {
  this.view = new View( node );
  new Controller( this.view );
};

module.exports = Help;
