'use strict';

// Dependency utils
var svg = require( '../../../../utils/svg' );
var template = svg( require( './point.svg' ) );
var pTemplate = template.querySelector( 'svg > g' );

// Constants
var RADIUS = 5;

// Private methods
var nodeSetPositionAtFrame = function( node, n, scale ) {
  if ( this.model.hidden ) {
    nodeHide( node );
    return false;
  }
  
  if ( n < this.start ) {
    nodeHide( node );
    return false;
  }
  
  if ( !this.model.isModel ) {
    n = n - this.start;
  }
  
  if ( n >= this.frames.length || !this.frames[ n ] ) {
    nodeHide( node );
    return false;
  }
  
  var x = this.frames[ n ].position.x;
  var y = this.frames[ n ].position.y;

  if ( isNaN( x ) || isNaN( y ) ) {
    nodeHide( node );
  } else {
    nodeShow( node );
    
    node._x = x;
    node._y = y;
    node.setAttribute( 'transform', 'scale(' + scale + ',' + scale + ') translate(' + x + ', ' + y + ')' );
  }
};

var setPositionAtFrame_Tracked = function( n, scale ) {
  // Don't forget about start position
  var len = this.tracks.length, i;
  n = Math.min( Math.max( n - this.start, -1 ), len );
  
  for ( i = 0; i < len; i++ ) {
    if ( i > n ) {
      nodeHide( this.tracks[ i ] );
    } else
    if ( i === n ) {
      nodeShow( this.tracks[ i ] );
    } else {
      nodeShow( this.tracks[ i ] );
      
      if ( this.trackType !== 'Circle' ) {
        this.tracks[ i ]._circle.hide(); 
      }
    }
  }
  
  if ( this.scale !== scale ) {
    this.scale = scale;
    updatePosition_Tracked.call( this );
  }
};

var setPositionAtFrame_Normal = function( n, scale ) {
  nodeSetPositionAtFrame.call( this, this.node, n, scale );
};

var updatePosition_Tracked = function() {
  // Don't forget about start position
  for ( var node, i = 0, l = this.frames.length; i < l; i++ ) {
    node = this.node.cloneNode( true );
    node.isVisible = true;
    nodeHide( node );
    
    nodeSetPositionAtFrame.call( this, node, i + this.start, this.scale );
  }
};

var createPointNode = function( color, radius, type, showNumber ) {
  var node = pTemplate.cloneNode( true ), i;
  var text = node.querySelector( 'g > text' );
  var l = node.querySelectorAll( 'g > line' );
  var c = node.querySelectorAll( 'g > circle' );
  
  for ( i = c.length; i--; ) {
    c[ i ].setAttribute( 'stroke', color.value );
  }
  
  for ( i = l.length; i--; ) {
    l[ i ].setAttribute( 'stroke', color.value );
  }
  
  text.setAttribute( 'fill', color.value );
  
  if ( showNumber !== true ) {
    text.hide();
  }
  
  if ( color.opacity < 1 ) {
    node.style.opacity = color.opacity;
  }
  
  if ( radius ) {
    c[ 0 ].setAttribute( 'r', radius );
    c[ 2 ].setAttribute( 'r', radius + 1 );
  }
  
  if ( type === 'VerticalLine' ) {
    var r = radius || RADIUS;
    
    l[ 0 ].setAttribute( 'x1', -1 * r );
    l[ 0 ].setAttribute( 'x2', +1 * r );
    l[ 0 ].show();
    
    l[ 1 ].setAttribute( 'y1', -500 );
    l[ 1 ].setAttribute( 'y2', +500 );
    l[ 1 ].show();
  }
  
  if ( type === 'HorizontalLine' ) {
    var r = radius || RADIUS;
    
    l[ 0 ].setAttribute( 'y1', -1 * r );
    l[ 0 ].setAttribute( 'y2', +1 * r );
    l[ 0 ].show();
    
    l[ 1 ].setAttribute( 'x1', -500 );
    l[ 1 ].setAttribute( 'x2', +500 );
    l[ 1 ].show();
  }
  
  node._line = l;
  node._circle = c;
  node._text = text;

  return node;
};

var initView_Tracked = function( holder ) {
  // Use this.node as template, and don't forget about start position
  for ( var node, i = 0, l = this.frames.length; i < l; i++ ) {
    node = this.node.cloneNode( true );
    node._text = node.querySelector( 'g > text' );
    node._line = node.querySelectorAll( 'g > line' );
    node._circle = node.querySelectorAll( 'g > circle' );
    node.isVisible = true;
    
    nodeHide( node );
    
    node._text.textContent = ( i + 1 );
    
    nodeSetPositionAtFrame.call( this, node, i + this.start, this.scale );
    
    holder.appendChild( node );
    
    this.tracks.push( node );
  }
};

var initView_Normal = function( holder ) {
  // Use this.node as real node of point
  holder.appendChild( this.node );
  
  this.node.isVisible = true;
  
  if ( this.model.hidden ) {
    nodeHide( this.node );
  }
};

var initView = function( holder ) {
  if ( this.withTrack ) {
    initView_Tracked.call( this, holder );
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
var Point = function( holder, model, video ) {
  this.node = createPointNode( model.color, model.radius, model.trackType, model.trackNumber );
  this.model = model;
  
  // Shortcats
  this.name = model.name;
  this.frames = model.frames;
  this.start = model.start;
  this.hidden = model.hidden;
  
  this.trackShowNumber = model.trackNumber;
  this.trackType = model.trackType;
  this.withTrack = model.track;
  this.tracks = [];
  
  this.scale = 1;
  
  initView.call( this, holder );
};

Point.prototype.setPositionAtFrame = function( n, scale ) {
  if ( this.withTrack ) {
    setPositionAtFrame_Tracked.call( this, n, scale );
  } else {
    setPositionAtFrame_Normal.call( this, n, scale );
  }
};

Point.prototype.updateColor = function( color ) {
  this.node._text.setAttribute( 'fill', color );
  
  for ( var i = this.node._line.length; i--; ) {
    this.node._line[ i ].setAttribute( 'stroke', color );
  }
  
  for ( var j = this.node._circle.length; j--; ) {
    this.node._circle[ j ].setAttribute( 'stroke', color );
  }
};

module.exports = Point;