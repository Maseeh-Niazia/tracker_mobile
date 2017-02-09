'use strict';

var ButtonOption = function( node, object ) {
  this.name = object ? object.name : '';
  this.node = node;
  
  this.isVisible = true;
  
  this.icon = this.node.querySelector( 'button > i' );
  this.label = this.node.querySelector( 'button > span' );
  
  if ( object ) {
    this.update( object );
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

ButtonOption.prototype.update = function( object ) {
  this.name = object.name;
  this.label.textContent = this.name;
  this.icon.style.color = object.color.value;
  this.icon.setAttribute( 'element', object.type );
};

ButtonOption.prototype.updateColor = function( color ) {
  this.icon.style.color = color;
};

module.exports = ButtonOption;