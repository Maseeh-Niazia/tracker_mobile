'use strict';

/**
 * Data tool fit builder popup for data tool (analizer)
**/

var View = require( './view/view' );
var Controller = require( './controllers/controller' );

var DataTool = function( holder, model ) {
  this.view = new View( holder, model );
  
  new Controller( this.view, model );
};

module.exports = DataTool;