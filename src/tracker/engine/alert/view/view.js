'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );

// Private methods
var calcPosition = function() {
  var bboxH = this.holder.getBoundingClientRect();
  var bboxA = this.node.getBoundingClientRect();
  
  this.node.style.left = ( bboxH.width / 2 - bboxA.width / 2) + 'px';
  this.node.style.top = ( bboxH.height / 2 - bboxA.height / 2) + 'px';
};

// View constructor
var View = function( node ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.holder = node;
  
  this.title = this.node.querySelector( '.pa > .pa-w > .pa-h' );
  this.content = this.node.querySelector( '.pa > .pa-w > .pa-c' );
  this.bttnClose = this.node.querySelector( '.pa > .pa-w > .pa-b > button' );
  
  // Model
  this.isVisible = false;
};

View.prototype.show = function( model ) {
  if ( !this.isVisible ) {
    this.title.textContent = model.title;
    this.content.innerHTML = model.content;
    this.holder.appendChild( this.node );
    this.isVisible = true;
  }
};

View.prototype.hide = function() {
  if ( this.isVisible ) {
    this.holder.removeChild( this.node );
    this.title.textContent = '';
    this.content.innerHTML = '';
    this.isVisible = false;
  }
};

module.exports = View;