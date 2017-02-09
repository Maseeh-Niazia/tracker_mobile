'use strict';

var parser = new DOMParser();

module.exports = function( svgString ) {
  return parser.parseFromString( svgString, 'image/svg+xml' );
}; 