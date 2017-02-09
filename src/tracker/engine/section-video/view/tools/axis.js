'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './axis.svg' ) );
var aTemplate = template.querySelector( 'svg > g' );

// Private methods
var initView = function() {
  this.holder.appendChild( this.node );
  updateVisibility.call( this );
};

var updateVisibility = function() {
  this.node.style.display = this.isVisible ? '' : 'none';
};

// Axis view constructor
var Axis = function( holder, target, model ) {
  // View html links
  this.node = aTemplate.cloneNode( true );
  this.holder = holder;
  this.target = target;
  
  this.axisX = this.node.querySelector( '[name="axis-x"]' );
  this.axisY = this.node.querySelector( '[name="axis-y"]' );
  this.axisX_hit = this.node.querySelector( '[name="axis-x-hit"]' );
  this.axisY_hit = this.node.querySelector( '[name="axis-y-hit"]' );
  
  // Model
  this.isVisible = model.axis.visible;
  
  // Initiate view
  initView.call( this );
};

Axis.prototype.toggle = function( value ) {
  this.isVisible = value;
  updateVisibility.call( this );
};

Axis.prototype.update = function( model ) {
  var size = this.holder.getBoundingClientRect();
  var axis = model.axis, p;
  var w = size.width;
  var h = size.height;
  var rad = Math.sqrt( w * w + h * h  );
  
  var cx = axis.x0 * model.magnification;
  var cy = axis.y0 * model.magnification;
  
  p = axis.getCoords( cx, cy, -rad, 0 );
  this.axisX.setAttribute( 'x1', p.x );
  this.axisX.setAttribute( 'y1', p.y );
  this.axisX_hit.setAttribute( 'x1', p.x );
  this.axisX_hit.setAttribute( 'y1', p.y );
  
  p = axis.getCoords( cx, cy, +rad, 0 );
  this.axisX.setAttribute( 'x2', p.x );
  this.axisX.setAttribute( 'y2', p.y );
  this.axisX_hit.setAttribute( 'x2', p.x );
  this.axisX_hit.setAttribute( 'y2', p.y );
  
  p = axis.getCoords( cx, cy, 0, -rad );
  this.axisY.setAttribute( 'x1', p.x );
  this.axisY.setAttribute( 'y1', p.y );
  this.axisY_hit.setAttribute( 'x1', p.x );
  this.axisY_hit.setAttribute( 'y1', p.y );
  
  p = axis.getCoords( cx, cy, 0, +rad );
  this.axisY.setAttribute( 'x2', p.x );
  this.axisY.setAttribute( 'y2', p.y );
  this.axisY_hit.setAttribute( 'x2', p.x );
  this.axisY_hit.setAttribute( 'y2', p.y );
};

Axis.prototype.highlight = function( val ) {
  var alpha = ( val === true ) ? 0.1 : 0;
  
  this.axisX_hit.setAttribute( 'opacity', alpha );
  this.axisY_hit.setAttribute( 'opacity', alpha );
};

module.exports = Axis;