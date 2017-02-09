'use strict';

// Dependency
var pathSegList = require( '../../../utils/svg.path-seg-list' );

// Private methods
var strToInteger = function( v ) {
  return parseInt( v, 10 );
}

// Public methods
var text = function( ctx, node ) {
  var t = node.getCTM();
  var x = Number( node.getAttribute( 'x' ) );
  var y = Number( node.getAttribute( 'y' ) );
  var style = window.getComputedStyle( node );
  var bbox = node.getBoundingClientRect();
  
  var text = node.textContent;
  var font = style.fontFamily;
  var size = style.fontSize;
  var color = style.fill;
  
  // Save context
  ctx.save();
  
  // Set text parameters
  ctx.font = size + ' ' +  font;
  ctx.fillStyle = color;
  
  // Transform apply
  if ( t.b && t.c ) {
    ctx.translate( bbox.width/2, bbox.height/2 );
    ctx.transform( t.a, t.b, t.c, t.d, t.e, t.f );
  }
  
  // Draw text
  ctx.fillText( text, x - bbox.width, y );
  
  // Restore context
  ctx.restore();
};

var line = function( ctx, node ) {
  var x1 = Number( node.getAttribute( 'x1' ) );
  var y1 = Number( node.getAttribute( 'y1' ) );
  var x2 = Number( node.getAttribute( 'x2' ) );
  var y2 = Number( node.getAttribute( 'y2' ) );
  var style = window.getComputedStyle( node );
  
  var crispEdges = style.shapeRendering === 'crispEdges';
  var dashstyle = style.strokeDasharray;
  var dasharray = null;
  
  if ( dashstyle !== 'none' ) {
    if ( dashstyle.indexOf( ',' ) > -1 ) {
      dasharray = dashstyle.split( ',' );
    } else {
      dasharray = dashstyle.split( ' ' );
    }
    
    if ( dasharray.length === 1 ) {
      dasharray.push( dasharray[ 0 ] );
    }
  }
  
  // Save context
  ctx.save();
  
  // Stroke styles
  ctx.strokeStyle = style.stroke;
  ctx.lineCap = style.strokeLinecap;
  ctx.lineJoin = style.strokeLinejoin;
  ctx.lineWidth = parseInt( style.strokeWidth, 10 );
  if ( crispEdges ) {
    ctx.imageSmoothingEnabled = false;
    //ctx.mozImageSmoothingEnabled = false;
    //ctx.webkitImageSmoothingEnabled = false;
  }
  if ( dasharray ) {
    dasharray = dasharray.map( strToInteger );
    ctx.setLineDash( dasharray );
  }
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo( x1, y1 );
  ctx.lineTo( x2, y2 );
  ctx.stroke();
  
  // Restore context
  ctx.restore();
};

var path = function( ctx, node ) {
  var style = window.getComputedStyle( node );
  var segs = pathSegList( node );
  var i, l, seg, type;
  
  // Save context
  ctx.save();
  
  // Stroke styles
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = parseInt( style.strokeWidth, 10 );
  
  // Draw path
  ctx.beginPath();
  
  for ( i = 0, l = segs.numberOfItems; i < l; i++ ) {
    seg = segs.getItem( i );
    type = seg.pathSegTypeAsLetter;
    
    switch ( type ) {
      case 'M': ctx.moveTo( seg.x, seg.y ); break;
      case 'L': ctx.lineTo( seg.x, seg.y ); break;
      case 'H': break;
      case 'V': break;
      case 'C': ctx.bezierCurveTo( seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y ); break;
      case 'S': break;
      case 'Q': break;
      case 'T': break;
      case 'A': break;
      case 'Z': ctx.closePath(); break;
    }
  }
  
  ctx.stroke();
  
  // Restore context
  ctx.restore();
}; 

module.exports = {
  text: text,
  line: line,
  path: path
};