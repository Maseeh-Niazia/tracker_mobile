'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Draw node to canvas methods
var drawNodeToCanvas = require( './node-to-canvas' );
var drawTitleToCanvas = require( './title-to-canvas' );

// Private methods
var drawSvgAsImage = function( view, model ) {
  var bbox = view.chart.svg._node.getBoundingClientRect();
  var svg = view.chart.svg._node;
  
  var cnv = document.createElement( 'canvas' );
  var ctx = cnv.getContext( '2d' );

  var width = bbox.width + 10;
  var height = bbox.height + 10;
  
  cnv.setAttribute( 'width', width + 'px' );
  cnv.setAttribute( 'height', height + 'px' );
  
  drawChildsToCanvas( ctx, svg );
  drawTitleToCanvas( ctx, width, height, model );
  
  var url = cnv.toDataURL();
  downloadImage( view, model, url );
};

var drawChildsToCanvas = function ( ctx, node ) {
  // Main loop
  var childs = node.childNodes;
  var name, i, l;
  
  for ( i = 0, l = childs.length; i < l; i++ ) {
    if ( childs[ i ].nodeType === 1 ) {
      name = childs[ i ].nodeName.toLowerCase();
      
      if ( name === 'g' ) {
        drawChildsToCanvas( ctx, childs[ i ] );
      } else
      if ( drawNodeToCanvas[ name ] ) {
        if ( childs[ i ].style.display !== 'none' ) {
          drawNodeToCanvas[ name ]( ctx, childs[ i ] );
        }
      }
    }
  }
};

var downloadImage = function( view, model, url ) {
  var image_data = atob( url.split( ',' )[ 1 ] );
  // Use typed arrays to convert the binary data to a Blob
  var arraybuffer = new ArrayBuffer( image_data.length );
  var u8a = new Uint8Array( arraybuffer );
  
  for ( var i = 0; i < image_data.length; i++ ) {
    u8a[ i ] = image_data.charCodeAt( i ) & 0xff;
  }
  
  var blob = new Blob( [ arraybuffer ], { type: 'application/octet-stream' } );
  var url = ( window.webkitURL || window.URL ).createObjectURL( blob );
  //window.location.href = url; // <-- Download!
  
  var fileName = buildFileName( model );
  var a = view.bttnGetGraphAsImage;
  a.download = fileName;
  a.href = url;
  a.dataset.downloadurl = [ 'image/png', a.download, a.href ].join(':');
};

var buildFileName = function( model ) {
  return 'graph.' + model.name + '.' + model.y + '-' + model.x + '.png';
};

// Main controller
var graphToImage = function( view, model ) {
  if ( view && view.chart ) {
    drawSvgAsImage( view, model );
  }
};

module.exports = graphToImage;