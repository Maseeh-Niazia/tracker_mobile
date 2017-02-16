'use strict';

// Dependency utils
var events = require( '../../../utils/events' );
var browser = require( '../../../utils/browser' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;

var MOUSEOVER = events.user.mouseover;
var MOUSEOUT = events.user.mouseout;

var L = 'l';
var R = 'r';
var M = 'm';

// Controller constructor
module.exports = function( video, model, view ) {
  // On resize update
  var updateView = view.update.bind( view, model );
  
  events.on( 'VIDEO_SIZE_UPDATED', updateView );
  //events.on( 'APP_VIEW_WAS_RENDERED', updateView );
  window.addEventListener( 'resize', updateView, false );
  events.on( 'STATE_CHANGE:protractor', view.toggle.bind( view ) );
  
  // On drag update
  var dragElem = '';
  var holder;
  
  var applyScaleXY = function( pos ) {
    pos.x /= video.scale;
    pos.y /= video.scale;
  };
  
  var mdEvent = function( drag ) {
    return function( evt ) {
      holder = view.holder.getBoundingClientRect();
      dragElem = drag;
      if ( drag === M ) {
        view.showMiddlePoint();
      }
      evt.preventDefault();
      evt.stopPropagation();
    }
  };
  
  var mmEvent = function( evt ) {
    if ( dragElem === '' ) {
      return false;
    }
    
    var pos = events.user.position( evt );
    pos.x -= holder.left;
    pos.y -= holder.top;
    
    applyScaleXY( pos );
    
    model[ 'move_' + dragElem ]( pos );
    view[ 'move_' + dragElem ]( model );
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var muEvent = function( evt ) {
    if ( dragElem !== '' ) {
      view.hideMiddlePoint();
      dragElem = '';
    }
  };
  
  view.hitL.addEventListener( MOUSEDOWN, mdEvent( L ), false );
  view.hitR.addEventListener( MOUSEDOWN, mdEvent( R ), false );
  view.hitM.addEventListener( MOUSEDOWN, mdEvent( M ), false );
  window.addEventListener( MOUSEMOVE, mmEvent, false );
  window.addEventListener( MOUSEUP, muEvent, false );
  
  // Middle point hover behaviour
  if ( browser.platform.PC ) {
    view.hitM.addEventListener( MOUSEOVER, function() {
      view.showMiddlePoint();
    }, false );
    view.hitM.addEventListener( MOUSEOUT, function() {
      if ( dragElem !== M ) {
        view.hideMiddlePoint();
      }
    }, false );
  }
};
  