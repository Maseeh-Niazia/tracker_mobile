'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );

// View constructor
var View = function( holder ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.holder = holder;

  this.header = this.node.querySelector( '.help > .help-h' );
  this.bttnClose = this.node.querySelector( '.help > .help-h > button.bttn-close' );

  this.show();
};

View.prototype.show = function() {
  this.holder.appendChild( this.node );
};

View.prototype.hide = function() {
  this.holder.removeChild( this.node );
};

module.exports = View;
