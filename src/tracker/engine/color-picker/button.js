'use strict';

var getRandomColor = function() {
  return '#' + Math.floor( Math.random() * 16777215 ).toString( 16 );
};

var Button = function( node ) {
  var position = node.attr( 'widget-position' ).split( '-' );
  
  this.node = node;
  
  this.alpha = 1;
  this.color = '#fff';
  
  this.isTop = ( position[ 0 ] === 'top' );
  this.isLeft = ( position[ 1 ] === 'left' );
  this.isRight = ( position[ 1 ] === 'right' );
  this.isBottom = ( position[ 0 ] === 'bottom' );
};

Button.prototype.setColor = function( color ) {
  if ( color === null ) {
    this.color = getRandomColor();
  } else {
    this.color = color;
  }
  this.node.style.background = this.color;
};

Button.prototype.bind = function( name, fn, bubbling ) {
  this.node.bind( name, fn, bubbling );
};

module.exports = Button;
