'use strict';

var SELECTED = 'selected';

var ToggleButton = function( node ) {
  this.node = node;
  this.isSelected = false;
  this.name = this.node.getAttribute( 'name' );
};

ToggleButton.prototype.toggle = function() {
  this.isSelected = !this.isSelected;
  
  if ( this.isSelected ) {
    this.node.classList.add( SELECTED );
  } else {
    this.node.classList.remove( SELECTED );
  }
  
  return this.isSelected;
};

module.exports = ToggleButton;