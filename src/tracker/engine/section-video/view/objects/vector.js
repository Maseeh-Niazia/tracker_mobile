'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './vector.svg' ) );
var pTemplate = template.querySelector( 'svg > g' );

// Private methods
var nodeSetPositionAtFrame = function( node, n, scale ) {
  if ( n < this.start ) {
    nodeHide( node );
    return false;
  }
  
  n = n - this.start;
  
  if ( n >= this.frames.length ) {
    nodeHide( node );
    return false;
  }
  
  nodeShow( node );
  
  var x1 = this.frames[ n ].position.x1;
  var y1 = this.frames[ n ].position.y1;
  var x2 = this.frames[ n ].position.x2;
  var y2 = this.frames[ n ].position.y2;
  
  node._x1 = x1;
  node._y1 = y1;
  node._x2 = x2;
  node._y2 = y2;
  
  node.line.setAttribute( 'x1', x1 );
  node.line.setAttribute( 'y1', y1 );
  node.line.setAttribute( 'x2', x2 );
  node.line.setAttribute( 'y2', y2 );
};

var setPositionAtFrame_Normal = function( n, scale ) {
  nodeSetPositionAtFrame.call( this, this.node, n, scale );
};

var createPointNode = function( color ) {
  var node = pTemplate.cloneNode( true );
  var v = node.querySelector( 'g > line' );
  var m = node.querySelector( 'g > defs > marker > path' );
  
  v.setAttribute( 'stroke', color.value );
  m.setAttribute( 'stroke', color.value );
  
  if ( color.opacity < 1 ) {
    node.style.opacity = color.opacity;
  }
  
  node.line = v;
  
  return node;
};

var initView_Normal = function( holder ) {
  // Use this.node as real node of point
  this.node.isVisible = true;
  holder.appendChild( this.node );
};

var initView = function( holder ) {
  if ( this.withTrack ) {
    initView_Normal.call( this, holder );
  } else {
    initView_Normal.call( this, holder );
  }
};

var nodeHide = function( node ) {
  if ( node.isVisible ) {
    node.style.display = 'none';
    node.isVisible = false;
  }
};

var nodeShow = function( node ) {
  if ( !node.isVisible ) {
    node.style.display = '';
    node.isVisible = true;
  }
}

// Point view constructor
var Vector = function( holder, model ) {
  this.node = createPointNode( model.color );
  this.name = model.name;
  this.frames = model.frames;
  this.start = model.start;
  
  this.withTrack = model.track;
  this.tracks = [];
  
  this.scale = 1;
  
  initView.call( this, holder );
};

Vector.prototype.setPositionAtFrame = function( n, scale ) {
  if ( this.withTrack ) {
    setPositionAtFrame_Normal.call( this, n, scale );
  } else {
    setPositionAtFrame_Normal.call( this, n, scale );
  }
};

module.exports = Vector;