'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './protractor.svg' ) );
var aTemplate = template.querySelector( 'svg > g' );

// Private methods
var initView = function( model ) {
  this.holder.appendChild( this.node );
  updateVisibility.call( this );
  setCoords.call( this, model );
};

var updateVisibility = function() {
  this.node.style.display = this.isVisible ? '' : 'none';
};

var setColor = function( color ) {
  this.lineL.setAttribute( 'stroke', color );
  this.lineR.setAttribute( 'stroke', color );
  
  this.circleL.setAttribute( 'stroke', color );
  this.circleR.setAttribute( 'stroke', color );
  this.circleM.setAttribute( 'stroke', color );
  
  this.arcAng.setAttribute( 'stroke', color );
  this.arcAngMarker[ 0 ].setAttribute( 'stroke', color );
  this.arcAngMarker[ 1 ].setAttribute( 'stroke', color );
  this.arcTitle.setAttribute( 'fill', color );
};

var setCoords = function( model ) {
  this.move_l( model );
  this.move_r( model );
  this.move_m( model );
};

var updateArcAngle = function( model ) {
  var ang = model.ang > 180 ? ( 360 - model.ang ) : -1 * model.ang;
  var path = 'M' + model.arcL.x + ' ' + model.arcL.y;
  path += ' A' + model.arcRad + ' ' + model.arcRad;
  path += ' 0 0 ' + model.arcD + ' ';
  path += model.arcR.x + ' ' + model.arcR.y;
  this.arcAng.setAttribute( 'd', path );
  
  if ( Math.abs( ang ) >= 20 ) {
    this.arcAng.setAttribute( 'marker-end', 'url(#:angle-arrow-' + model.arcD + ')' );
  } else {
    this.arcAng.removeAttribute( 'marker-end' );
  }
  
  this.arcTitle.setAttribute( 'x', model.arcT.x );
  this.arcTitle.setAttribute( 'y', model.arcT.y );
  
  this.arcTitle.textContent = ang.toFixed( 1 ) + decodeURI( '%C2%B0' );
};

// Protractor view constructor
var Protractor = function( holder, target, model ) {
  // View html links
  this.node = aTemplate.cloneNode( true );
  this.holder = holder;
  this.target = target;
  
  this.arcAng = this.node.querySelector( 'path[name="arc-ang"]' );
  this.arcAngMarker =[
    this.node.querySelector( 'path[name="arc-ang-marker-0"]' ),
    this.node.querySelector( 'path[name="arc-ang-marker-1"]' )
  ];
  this.arcTitle = this.node.querySelector( 'text[name="arc-title"]' );
  
  this.lineL = this.node.querySelector( 'line[name="line-l"]' );
  this.lineR = this.node.querySelector( 'line[name="line-r"]' );
  
  this.circleL = this.node.querySelector( 'circle[name="line-l"]' );
  this.circleR = this.node.querySelector( 'circle[name="line-r"]' );
  this.circleM = this.node.querySelector( 'circle[name="middle"]' );
  
  this.hitL = this.node.querySelector( 'circle[name="line-l-hit"]' );
  this.hitR = this.node.querySelector( 'circle[name="line-r-hit"]' );
  this.hitM = this.node.querySelector( 'circle[name="middle-hit"]' );
  
  // Model
  this.isVisible = model.visible;
  
  // Initiate view
  this.hideMiddlePoint();
  initView.call( this, model );
  setColor.call( this, model.color );
};

Protractor.prototype.toggle = function( value ) {
  this.isVisible = value;
  updateVisibility.call( this );
};

Protractor.prototype.update = function( model ) {
  setCoords.call( this, model );
};

Protractor.prototype.move_l = function( model ) {
  this.lineL.x1.baseVal.value = model.posL.x;
  this.lineL.y1.baseVal.value = model.posL.y;
  
  this.circleL.cx.baseVal.value = model.posL.x;
  this.circleL.cy.baseVal.value = model.posL.y;
  
  this.hitL.cx.baseVal.value = model.posL.x;
  this.hitL.cy.baseVal.value = model.posL.y;
  
  updateArcAngle.call( this, model );
};

Protractor.prototype.move_r = function( model ) {
  this.lineR.x1.baseVal.value = model.posR.x;
  this.lineR.y1.baseVal.value = model.posR.y;
  
  this.circleR.cx.baseVal.value = model.posR.x;
  this.circleR.cy.baseVal.value = model.posR.y;
  
  this.hitR.cx.baseVal.value = model.posR.x;
  this.hitR.cy.baseVal.value = model.posR.y;
  
  updateArcAngle.call( this, model );
};

Protractor.prototype.move_m = function( model ) {
  this.lineL.x2.baseVal.value = model.posM.x;
  this.lineL.y2.baseVal.value = model.posM.y;
  
  this.lineR.x2.baseVal.value = model.posM.x;
  this.lineR.y2.baseVal.value = model.posM.y;
  
  this.hitM.cx.baseVal.value = model.posM.x;
  this.hitM.cy.baseVal.value = model.posM.y;
  
  this.circleM.cx.baseVal.value = model.posM.x;
  this.circleM.cy.baseVal.value = model.posM.y;
  
  updateArcAngle.call( this, model );
};

Protractor.prototype.showMiddlePoint = function() {
  this.circleM.style.display = '';
};

Protractor.prototype.hideMiddlePoint = function() {
  this.circleM.style.display = 'none';
};

module.exports = Protractor;