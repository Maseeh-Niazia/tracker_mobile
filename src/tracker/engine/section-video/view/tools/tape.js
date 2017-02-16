'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './tape.svg' ) );
var aTemplate = template.querySelector( 'svg > g' );

// Private methods
var initView = function( model ) {
  if ( model.color ) {
    var node = this.node.querySelector( 'text' );
    node.setAttribute( 'fill', model.color );
    
    node = this.node.querySelector( 'line[name="line"]' );
    node.setAttribute( 'stroke', model.color );
    
    node = this.node.querySelector( 'circle[name="line-l"]' );
    node.setAttribute( 'stroke', model.color );
    
    node = this.node.querySelector( 'circle[name="line-r"]' );
    node.setAttribute( 'stroke', model.color );
  }
  
  this.holder.appendChild( this.node );
  
  updateVisibility.call( this );
};

var updateVisibility = function() {
  this.node.style.display = this.isVisible ? '' : 'none';
};

var setCoords = function( model ) {
  this.move_m( model );
};

var updateTitle = function( model ) {
  this.title.textContent = model.value;
  this.title.setAttribute( 'x', model.posT.x );
  this.title.setAttribute( 'y', model.posT.y );
};

// Axis view constructor
var Tape = function( holder, target, model ) {
  // View html links
  this.node = aTemplate.cloneNode( true );
  this.holder = holder;
  this.target = target;
  
  this.line = this.node.querySelector( '[name="line"]' );
  this.title = this.node.querySelector( '[name="title"]' );
  
  this.circleL = this.node.querySelector( '[name="line-l"]' );
  this.circleR = this.node.querySelector( '[name="line-r"]' );
  
  this.hitL = this.node.querySelector( '[name="hit-l"]' );
  this.hitR = this.node.querySelector( '[name="hit-r"]' );
  this.hitM = this.node.querySelector( '[name="hit-m"]' );
  
  // Model
  this.isVisible = model.visible;
  
  // Initiate view
  this.hidePoint( 'l' );
  this.hidePoint( 'r' );
  initView.call( this, model );
};

Tape.prototype.move_l = function( model ) {
  this.line.x1.baseVal.value = model.posL.x;
  this.line.y1.baseVal.value = model.posL.y;
  
  this.hitM.x1.baseVal.value = model.posL.x;
  this.hitM.y1.baseVal.value = model.posL.y;
  
  this.circleL.cx.baseVal.value = model.posL.x;
  this.circleL.cy.baseVal.value = model.posL.y;
  
  this.hitL.cx.baseVal.value = model.posL.x;
  this.hitL.cy.baseVal.value = model.posL.y;
  
  updateTitle.call( this, model );
};

Tape.prototype.move_r = function( model ) {
  this.line.x2.baseVal.value = model.posR.x;
  this.line.y2.baseVal.value = model.posR.y;
  
  this.hitM.x2.baseVal.value = model.posR.x;
  this.hitM.y2.baseVal.value = model.posR.y;
  
  this.circleR.cx.baseVal.value = model.posR.x;
  this.circleR.cy.baseVal.value = model.posR.y;
  
  this.hitR.cx.baseVal.value = model.posR.x;
  this.hitR.cy.baseVal.value = model.posR.y;
  
  updateTitle.call( this, model );
};

Tape.prototype.move_m = function( model ) {
  this.move_l( model );
  this.move_r( model );
};

Tape.prototype.toggle = function( value ) {
  this.isVisible = value;
  updateVisibility.call( this );
};

Tape.prototype.update = function( model ) {
  setCoords.call( this, model );
};

Tape.prototype.showPoint = function( p ) {
  this[ 'circle' + p.toUpperCase() ].style.display = '';
};

Tape.prototype.hidePoint = function( p ) {
  this[ 'circle' + p.toUpperCase() ].style.display = 'none';
};

module.exports = Tape;