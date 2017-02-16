'use strict';

// Dependencies
var browser = require( './browser.js' );

// Constant, indicate current device platform
var TOUCH = browser.platform.Mobile;

// Model events collection
var collection = {};

// Special constant Scale Factor, only for EDCY Application model
var scaleFactor = 1;

// Return position of user cursor
var getCursorPosition = function ( e, doNotUseScale ) {
  var scale = doNotUseScale ? 1 : scaleFactor;
  var x = e.pageX, y = e.pageY, body;
  
  if ( e.pageX === null && e.clientX !== null ) {
    body = document.documentElement.body || document.body || document.querySelector( 'body' );
    x = e.clientX + ( body && body.scrollLeft || 0 ) - ( body && body.clientLeft || 0 );
    y = e.clientY + ( body && body.scrollTop || 0 ) - ( body && body.clientTop || 0 );
  }
  
  if ( e.changedTouches && e.changedTouches.length ) {
    x = e.changedTouches[ 0 ].pageX;
    y = e.changedTouches[ 0 ].pageY;
  }
  
  return {
    x : Math.round( x / scale ),
    y : Math.round( y / scale )
  };
};

var addEventListener = function( name, func ) {
  if ( !collection[ name ] ) {
    collection[ name ] = [];
  }
  if ( func && func.call ) {
    collection[ name ].push( func );
  }
};

var fireEventListeners = function( name, ops ) {
  var listeners = collection[ name ];
  
  if ( !listeners || listeners.length === 0 ) {
    return;
  }
  
  for ( var i = 0, l = listeners.length; i < l; i++ ) {
    listeners[ i ]( ops );
  }
};

var clearEventListeners = function( name ) {
  var listeners = collection[ name ];
  
  if ( listeners && listeners.length > 0 ) {
    listeners.length = 0;
  }
};

var updateScaleFactor = function( value ) {
  scaleFactor = value;
};

var getPointScale = function() {
  return scaleFactor;
};

// Return singleton object
module.exports = {
  user: {
    mousedown : ( TOUCH ) ? 'touchstart' : 'mousedown',
    mousemove : ( TOUCH ) ? 'touchmove' : 'mousemove',
    mouseup : ( TOUCH ) ? 'touchend' : 'mouseup',
    mouseover : ( TOUCH ) ? 'xxx' : 'mouseover',
    mouseout : ( TOUCH ) ? 'xxx' : 'mouseout',
    mouseenter : 'mouseenter',
    mouseleave : 'mouseleave',
    position : getCursorPosition,
    touch : TOUCH
  },
  input: {
    change: 'change',
    focus: 'focus',
    blur: 'blur'
  },
  on: addEventListener,
  fire: fireEventListeners,
  clear: clearEventListeners,
  getPointScale: getPointScale,
  updateScaleFactor: updateScaleFactor
};