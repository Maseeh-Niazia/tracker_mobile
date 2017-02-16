'use strict';

var ButtonOption = function( node ) {
  this.name = node.getAttribute( 'option' );
  this.node = node;
  
  this.isVisible = true;
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

module.exports = ButtonOption;