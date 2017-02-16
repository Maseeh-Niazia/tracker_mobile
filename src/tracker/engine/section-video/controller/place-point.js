'use strict';

// Dependency utils
var events = require( '../../../utils/events' );
var browser = require( '../../../utils/browser' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;
var KEYDOWN = 'keydown';
var KEYUP = 'keyup';
var ACTIVE = 'active';
var DP = {
  x: browser.platform.PC ? 0 : -12,
  y: browser.platform.PC ? 0 : -12,
};

var SKIP_STEP_ALERT_SHOWN = false;

// Private methods
var checkObjectData= function( object ) {
  if ( SKIP_STEP_ALERT_SHOWN ) {
    return;
  }
  
  for ( var i = 0; i < object.frames.length; i++ ) {
    if ( !object.frames[ i ] ) {
      events.fire( 'ALERT:show', {
        title: 'Caution',
        content: 'Caution: skipping steps when marking positions leaves gaps in the data set.  Velocities and accelerations around the gaps cannot be determined until all steps are marked.'
      } );
      
      SKIP_STEP_ALERT_SHOWN = true;
      
      break;
    }
  }
};

var updatePointFrameData = function( model, pos ) {
  var object = model.currentTrack;
  var frame = model.frameCurrent;
  
  object.updateFrameData( frame, pos );
  
  events.fire( 'FRAME_UPDATE_DATA', {
    frame: frame,
    object: object
  } );
};

var shiftKeyDown = function( model, view, bttn ) {
  return function( evt ) {
    if ( ( evt.shiftKey || bttn ) && !model.shiftKeyDown ) {
      model.shiftKeyDown = true;
      
      view.videoToolsDisable();
      view.bttnTouchShift.classList.add( ACTIVE );
    }
  }
};

var shiftKeyUp = function( model, view ) {
  return function( evt ) {
    if ( model.shiftKeyDown ) {
      model.shiftKeyDown = false;
      
      view.videoToolsEnable();
      view.bttnTouchShift.classList.remove( ACTIVE );
    }
  }
};

// Public methods
var init = function( view, model ) {
  var holder = view.videoFrame;
  var isTryPlacePoint = false;
  var bbox;
  
  var getPointPosition = function( evt ) {
    var pos = events.user.position( evt );
    pos.x -= bbox.left - DP.x;
    pos.y -= bbox.top - DP.y;
    pos.x /= model.scale;
    pos.y /= model.scale;
    return pos;
  };
  
  var start = function( evt ) {
    if ( isTryPlacePoint || !model.shiftKeyDown || !model.currentTrack || !model.currentTrack.isModelPlace ) {
      return false;
    }

    var object = model.currentTrack;
    var frame = model.frameCurrent;
    
    if ( frame < object.placeStart || frame > object.placeEnd ) {
      return false;
    }

    bbox = holder.getBoundingClientRect();
    var pos = getPointPosition( evt );

    isTryPlacePoint = true;
    view.point.display( true );
    view.point.setPosition( pos );

    evt.preventDefault();
  };
  
  var move = function( evt ) {
    if ( !isTryPlacePoint ) {
      return false;
    }
    
    var pos = getPointPosition( evt );
    view.point.setPosition( pos );
    
    evt.preventDefault();
    evt.stopPropagation()
  };
  
  var end = function( evt ) {
    if ( !isTryPlacePoint ) {
      return false;
    }
    
    isTryPlacePoint = false;
    view.point.display( false );
    
    var p = events.user.position( evt );
    
    p.x -= bbox.left;
    p.y -= bbox.top;
    
    updatePointFrameData( model, p );

    checkObjectData( model.currentTrack );
    
    model.changeFrame( +1 );
    view.update( model );

    events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
  };

  // SHIFT key controllers
  view.bttnTouchShift.addEventListener( MOUSEDOWN, shiftKeyDown( model, view, true ), false );
  document.addEventListener( KEYDOWN, shiftKeyDown( model, view ), false );
  document.addEventListener( KEYUP, shiftKeyUp( model, view ), false );
  
  // Place point controllers
  view.videoFrame.addEventListener( MOUSEDOWN, start, false );
  view.videoFrame.addEventListener( MOUSEMOVE, move, false );
  view.videoFrame.addEventListener( MOUSEUP, end, false );
};

var update = function( view, model ) {
  view.shiftButtonVisible( false );
  
  if ( !model.currentTrack ) {
    return false;
  }
  
  if ( !model.currentTrack.isModelPlace ) {
    return false;
  }
  
  var object = model.currentTrack;
  var frame = model.frameCurrent;
  
  if ( frame >= object.placeStart && frame <= object.placeEnd ) {
    view.shiftButtonVisible( true );
  }
};

module.exports = {
  init: init,
  update: update	
};