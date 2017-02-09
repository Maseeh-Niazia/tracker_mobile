'use strict';

// Dependency utils
var html = require( '../../../../utils/html' );
var getVariable = require( '../../../../utils/variable' );

// Dependency view
require( './column-selector.less' );
var checkbox = html( require( './checkbox.html' ) );
var template = html( require( './column-selector.html' ) );

// Constants
var WIDHT = 310;
var HEIGHT = 160;
var TITLE_PRE_TEXT = 'Selected columns | ';

// Private methods
var addSelectors = function( model ) {
  var node, inputNode, column, text;

  this.selectors.length = 0;
  
  for ( var i = 0; i < model.allParams.length; i++ ) {
    node = checkbox.querySelector( 'label' ).cloneNode( true );
    inputNode = node.querySelector( 'input' );
    column = model.allParams[ i ];
    text = getVariable( column );
    
    inputNode.setAttribute( 'id', 'col' + i );
    inputNode.setAttribute( 'value', column );
    inputNode.nextSibling.textContent = text.label;
    inputNode.nextSibling.classList.add( 'index-' + text.type );
    inputNode.checked = model.selectedColumns.indexOf( column ) !== -1;
    
    this.selectors.push( { column : column, node : node, input : inputNode } );
    this.selectorsPanelNode.appendChild( node );
  }
};

var clearNode = function( node ) {
  while( node.firstChild ) {
    node.removeChild( node.firstChild );
  }
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  //this.node.style.height = HEIGHT + 'px';
  this.node.style.width = WIDHT + 'px';
  this.selectorsPanelNode = this.node.querySelector( '.tcs-panel-selectors' );
  this.holder = holder;
  this.selectors = [];
  
  this.width = WIDHT;
  this.height = HEIGHT;
  
  this.header = this.node.querySelector( '.tcs > .tcs-h' );
  this.bttnClose = this.node.querySelector( '.tcs > .tcs-h > button' );
  this.title = this.node.querySelector( '.tcs > .tcs-c > .tcs-panel' );
  
  addSelectors.call( this, model );
};

View.prototype.update = function( model ) {
  clearNode( this.selectorsPanelNode );
  addSelectors.call( this, model );
};

View.prototype.show = function( frameName ) {
  if ( !this.holder.contains( this.node ) ) {
    this.holder.appendChild( this.node );
    this.title.setAttribute( 'name', TITLE_PRE_TEXT + frameName );
  }
};

View.prototype.hide = function() {
  if ( this.holder.contains( this.node ) ) {
    this.holder.removeChild( this.node );
  }
};

module.exports = View;