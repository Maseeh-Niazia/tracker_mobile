'use strict';

// Private methods
var update = function() {
  if ( this.value === true ) {
    this.node.classList.add( 'on' );
  } else {
    this.node.classList.remove( 'on' );
  }
};

// Button toggle constructor
var Button = function( node, name, value ) {
  this.value = value;
  this.name = name;
  this.node = node;
  
  update.call( this );
};

Button.prototype.toggle = function() {
  this.value = !this.value;
  update.call( this );
  return this.value;
};

module.exports = Button;