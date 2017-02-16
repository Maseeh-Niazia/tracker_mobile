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
  events.on( 'STATE_CHANGE:tape', view.toggle.bind( view ) );
  
  // On drag update
  var dragElem = '';
  var posO = null;
  var holder;
  
  var applyScaleXY = function( pos ) {
    pos.x /= video.scale;
    pos.y /= video.scale;
  };
  
  var mdEvent = function( drag ) {
    return function( evt ) {
      holder = view.holder.getBoundingClientRect();
      dragElem = drag;
      
      if ( drag !== M ) {
        view.showPoint( drag );
      }
      
      posO = events.user.position( evt );
      posO.x -= holder.left;
      posO.y -= holder.top;
      
      applyScaleXY( posO );
      
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
    
    pos.dx = ( pos.x - posO.x );
    pos.dy = ( pos.y - posO.y );
    
    model[ 'move_' + dragElem ]( pos );
    view[ 'move_' + dragElem ]( model );
    
    posO = pos;
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  var muEvent = function( evt ) {
    if ( dragElem !== '' ) {
      if ( dragElem !== M ) {
        view.hidePoint( dragElem );
      }
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
    view.hitL.addEventListener( MOUSEOVER, function() {
      view.showPoint( L );
    }, false );
    view.hitL.addEventListener( MOUSEOUT, function() {
      if ( dragElem !== L ) {
        view.hidePoint( L );
      }
    }, false );
    view.hitR.addEventListener( MOUSEOVER, function() {
      view.showPoint( R );
    }, false );
    view.hitR.addEventListener( MOUSEOUT, function() {
      if ( dragElem !== R ) {
        view.hidePoint( R );
      }
    }, false );
  }
};
  