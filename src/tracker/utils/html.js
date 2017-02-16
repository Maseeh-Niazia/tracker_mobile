'use strict';

var div = document.createElement( 'div' );

module.exports = function( htmlString ) {
  var html = document.createDocumentFragment();
  htmlString = htmlString.replace( />\s*</gm,'><' );
  div.innerHTML = htmlString.replace( />\s*</gm,'><' );
  
  while( div.firstChild ) {
    html.appendChild( div.firstChild );
  }
  
  return html;
};