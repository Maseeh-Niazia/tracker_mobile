'use strict';

// Dependency utils
var getVariable = require( '../../../../utils/variable' );

// Constants
var LABEL_INDEX = 'index-';

// Main class constructor
var ButtonOption = function( node, variable ) {
  this.name = variable || '';
  this.node = node;
  
  this.isVisible = true;

  this.label = this.node.querySelector( 'button > span' );
  this.type = ''; // class for label
  
  if ( variable ) {
    this.update( variable );
  }
};

ButtonOption.prototype.show = function() {
  if ( !this.isVisible ) {
    this.isVisible = true;
    this.node.style.display = '';
  }
};

ButtonOption.prototype.hide = function() {
  if ( this.isVisible ) {
    this.isVisible = false;
    this.node.style.display = 'none';
  }
};

ButtonOption.prototype.update = function( variable ) {
  var text = getVariable( variable );
  
  if ( this.type !== '' ) {
    this.label.classList.remove( LABEL_INDEX + this.type );
  }
  
  this.name = variable;
  this.type = text.type;
  this.label.textContent = text.label;
  
  if ( this.type !== '' ) {
    this.label.classList.add( LABEL_INDEX + this.type );
  }
};

module.exports = ButtonOption;