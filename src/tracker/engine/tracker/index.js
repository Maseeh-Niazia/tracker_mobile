'use strict';

// Dependency utils
require( '../../utils/math' );
require( '../../utils/node' );
require( '../../utils/node-list' );
require( '../../utils/class-list' );

// Dependency tracker component
var View = require( './view/tracker' );
var Model = require( './model/tracker' );
var Controller = require( './controller/tracker' );

// Dependency sections
var Alert = require( '../alert/index' );
var Video = require( '../section-video/index' );
var Table = require( '../section-table/index' );
var Graph = require( '../section-graph/index' );
var Header = require( '../section-header/index' );

// Component contructor
window.Tracker = function( config, data ) {
  // Build common tracker model based on data
  this.model = new Model( config, data );

  // Build common tracker view with sections
  this.view = new View( config, this.model );

  // Build always existed video section
  this.video = new Video( this.view.sections.video, this.model );

  // Build header panel
  this.header = new Header( this.view.sections.header, config, this.model );

  // Build alert window service
  this.alert = new Alert( this.view.node );

  // Initiate common tracker controller
  new Controller( config, this.model, this.view, this.video, this.alert);
};
