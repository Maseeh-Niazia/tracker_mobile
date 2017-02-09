'use strict';

// Dependency component
var View = require( './view/view' );
var Model = require( './model/model' );
var Controller = require( './controllers/controller' );

// Table component constructor
var Graph = function( holder, frame, object, config ) {
  this.model = new Model( frame, object, config );
  this.view = new View( holder, this.model );
  
  new Controller( this.model, this.view );
};

module.exports = Graph;