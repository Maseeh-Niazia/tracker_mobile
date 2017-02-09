'use strict';

Node.prototype.show = Node.prototype.show || function() {
  this.style.display = '';
};

Node.prototype.hide = Node.prototype.hide || function() {
  this.style.display = 'none';
};

Node.prototype.remove = Node.prototype.remove || function() {
  if ( this.parentNode ) {
    this.parentNode.removeChild( this );
  }
};

Node.prototype.insert = Node.prototype.insert || function( parent ) {
  parent.appendChild( this );
};

Node.prototype.attr = Node.prototype.attr || function( name, val ) {
  if ( arguments.length === 2 ) {
    this.setAttribute( name, val );
  } else {
    return this.getAttribute( name );
  }
};

Node.prototype.bind = Node.prototype.bind || function( name, fn, bubling ) {
  this.addEventListener( name, fn, bubling );
};

Node.prototype.attrDel = Node.prototype.attrDel || function( name ) {
  this.removeAttribute( name );
};