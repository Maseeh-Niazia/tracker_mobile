'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './point.svg' ) );
var aTemplate = template.querySelector( 'svg > g' );

// Private methods
var initView = function() {
  this.holder.appendChild( this.node );
};

// Point view constructor
var Point = function( holder ) {
  // View html links
  this.node = aTemplate.cloneNode( true );
  this.holder = holder;
  
  // Initiate view
  initView.call( this );
  this.display( false );
};

Point.prototype.display = function( visible ) {
  this.node.style.display = visible ? '' : 'none';
};

Point.prototype.setPosition = function( pos ) {
  this.node.setAttribute( 'transform', 'translate(' + pos.x + ',' + pos.y + ')' );
};

module.exports = Point;