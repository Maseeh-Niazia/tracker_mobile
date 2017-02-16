'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
var template = html( '<label><i></i><span></span></label>' );

// View constructor
var Point = function( object ) {
  this.node = template.querySelector( 'label' ).cloneNode( true );
  this.name = object.name;
  
  var icon = this.node.querySelector( 'i' );
  var title = this.node.querySelector( 'span' );
  
  this.isChecked = false;
  
  title.textContent = this.name;
  icon.style.color = object.color.value;
  icon.setAttribute( 'element', object.type );
};


Point.prototype.toggle = function() {
  this.isChecked = !this.isChecked;
  
  if ( this.isChecked ) {
    this.node.classList.add( 'checked' );
  } else {
    this.node.classList.remove( 'checked' );
  }
};

module.exports = Point;