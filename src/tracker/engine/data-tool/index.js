'use strict';

/**
 * Data tool (analizer) opened in max window size,
 *  have own full-view
**/

var View = require( './view/view' );
var Model = require( './model/model' );
var Controller = require( './controllers/controller' );

var DataTool = function( holder, model ) {
  this.model = new Model( model );
  this.view = new View( holder, this.model );
  
  new Controller( this.model, this.view );
};

module.exports = DataTool;