'use strict';

// Dependency utils
var html = require( '../../utils/html' );
var body = document.body || document.querySelector( 'body' );

// Dependency video component
var View = require( './view/video' );
var Model = require( './model/video' );
var Controller = require( './controller/video' );

// View constructor
var Video = function( holder, model ) {
  this.model = new Model( model );
  this.view = new View( holder, this.model );
  
  new Controller( this.model, this.view );
};

module.exports = Video;