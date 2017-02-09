'use strict';

// Dependency utils
var html = require( '../../../utils/html' );
var body = document.body || document.querySelector( 'body' );

// Constants
var HAS_SHIFT_BUTTON = 'has-shift-button';

// Dependency video view
require( './video.less' );
var template = html( require( './video.html' ) );
var DisplayState = require( './controls/display-state' );

// Dependency video data objects
var Data = {
  'point': require( './objects/point' ),
  'vector': require( './objects/vector' )
};

// Dependency video data tools
var Axis = require( './tools/axis' );
var Tape = require( './tools/tape' );
var Point = require( './tools/point' );
var Protractor = require( './tools/protractor' );

// Private methods
var updatePlayRate = function( model ) {
  var playRate = Math.round( model.playRate * 100 );
  this.playRateValue.textContent = playRate + '%';
  
  if ( model.isPlayRateMin() ) {
    this.bttnPlayRatePrev.disabled = true;
    this.bttnPlayRateNext.disabled = false;
  } else
  if ( model.isPlayRateMax() ) {
    this.bttnPlayRatePrev.disabled = false;
    this.bttnPlayRateNext.disabled = true;
  } else {
    this.bttnPlayRatePrev.disabled = false;
    this.bttnPlayRateNext.disabled = false;
  }
};

var updateCurrentState = function( model ) {
  this.currentState.textContent = model.getCurrentState();
};

var updateButtonsPlayPause = function( model ) {
  if ( model.isPlaying ) {
    this.bttnPlayStart.style.display = 'none';
    this.bttnPlayPause.style.display = '';
  } else {
    this.bttnPlayStart.style.display = '';
    this.bttnPlayPause.style.display = 'none';
  }
};

var updateButtonsSkipBack = function( model ) {
  if ( model.isInFirstFrame() ) {
    this.bttnSkipPrev.disabled = true;
    this.bttnSkipNext.disabled = false;
    this.bttnPlayBack.disabled = true;
  } else
  if ( model.isInLastFrame() ) {
    this.bttnSkipPrev.disabled = false;
    this.bttnSkipNext.disabled = true;
    this.bttnPlayBack.disabled = false;
  } else {
    this.bttnSkipPrev.disabled = false;
    this.bttnSkipNext.disabled = false;
    this.bttnPlayBack.disabled = false;
  }
};

var initSeekBar = function( i, n ) {
  this.seekBar.min = 0;
  this.seekBar.max = n;
  this.seekBar.step = 1;
  this.seekBar.value = i;
};

var updateSeekBar = function( model ) {
  this.seekBar.value = model.frameCurrent;
};

var initFrame = function( model ) {
  var w = model.width.toFixed( 1 ) + 'px';
  var h = model.height.toFixed( 1 ) + 'px';
  
  this.videoFrame.style.width = w;
  this.videoFrame.style.height = h;
  this.objectsHolder.style.width = w;
  this.objectsHolder.style.height = h;
};

var initFrames = function( model ) {
  var w = parseFloat( model.width.toFixed( 1 ) );
  var h = parseFloat( model.height.toFixed( 1 ) );
  
  for ( var img, i = 0, l = model.frames.length; i < l; i++ ) {
    img = new Image;
    img.src = model.frames[ i ];
    img.width = w;
    img.height = h;
    this.frames.push( img );
  }
};

var updateVideoFrames = function( model ) {
  if ( this.currentFrame ) {
    this.videoFrame.removeChild( this.currentFrame );
  }
  this.currentFrame = this.frames[ model.frameCurrent ];
  this.videoFrame.appendChild( this.currentFrame );
};

var updateObjects = function( model ) {
  var m = model.magnification;
  var n = model.frameCurrent;
  
  for ( var i = this.objects.length; i--; ) {
    this.objects[ i ].setPositionAtFrame( n, m );
  }
};

var initObjects = function( objects ) {
  for ( var i = 0, l = objects.length; i < l; i++ ) {
    this.objects.push(
      new Data[ objects[ i ].type ]( this.objectsHolder, objects[ i ] )
    );
  }
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.holder = holder;
  
  // Video controls html links
  this.currentState = this.node.querySelector( '.video-controls > .current-state > span' );
  this.displayStateMenu = new DisplayState( this.node.querySelector( '.video-controls > .current-state' ) );
  
  this.videoWrapper = this.node.querySelector( '.video > .video-holder' );
  
  this.bttnPlayRatePrev = this.node.querySelector( '.video-controls > .play-rate > .play-rate-prev' );
  this.playRateValue = this.node.querySelector( '.video-controls > .play-rate > .play-rate-value' );
  this.bttnPlayRateNext = this.node.querySelector( '.video-controls > .play-rate > .play-rate-next' );
  
  this.bttnPlayStart = this.node.querySelector( '.video-controls > .play-start' );
  this.bttnPlayPause = this.node.querySelector( '.video-controls > .play-pause' ); 
  
  this.bttnPlayBack = this.node.querySelector( '.video-controls > .play-back' );
  this.bttnSkipPrev = this.node.querySelector( '.video-controls > .skip-prev' );
  this.bttnSkipNext = this.node.querySelector( '.video-controls > .skip-next' );
  this.bttnPlayLoop = this.node.querySelector( '.video-controls > .play-loop' );
  
  this.bttnTouchShift = this.node.querySelector( '.video-controls > .touch-shift' );
  
  this.seekBar = this.node.querySelector( '.video-controls > .seek-bar' );
  initSeekBar.call( this, model.frameCurrent, model.frameTotal - 1 );
  
  // Video frame html links
  this.videoFrame = this.node.querySelector( '.video > .video-holder > .video-frame' );
  this.currentFrame = null; // link to current video image frame
  this.frames = [];
  
  // Video objects (points, vectors, etc...)
  this.objectsHolder = this.videoFrame.querySelector( 'svg' );
  this.objects = [];
  
  // Video tools (axis, protractor, etc...)
  this.videoTools = this.node.querySelector( '.video > .video-holder > .video-tools' );
  this.point = new Point( this.objectsHolder ); // only this tools show in video frame
  this.axis = new Axis( this.videoTools, this.videoFrame, model );
  this.tape = new Tape( this.videoTools, this.videoFrame, model.tape );
  this.protractor = new Protractor( this.videoTools, this.videoFrame, model.protractor );
  
  // Initiate view objects
  initFrame.call( this, model );
  initFrames.call( this, model );
  initObjects.call( this, model.objects );
  this.shiftButtonVisible( false );
  this.displayStateMenu.update( model );
};

View.prototype.draw = function() {
  this.holder.appendChild( this.node );
};

View.prototype.update = function( model ) {
  this.updateLoopButton( model );
  updateSeekBar.call( this, model );
  updatePlayRate.call( this, model );
  updateCurrentState.call( this, model );
  updateVideoFrames.call( this, model );
  updateButtonsSkipBack.call( this, model);
  updateButtonsPlayPause.call( this, model );
  updateObjects.call( this, model );
};

View.prototype.updateObjects = function( model ) {
  updateObjects.call( this, model );
};

View.prototype.updateButtons = function( model ) {
  updateButtonsPlayPause.call( this, model );
};

View.prototype.updatePlayRate = function( model ) {
  updatePlayRate.call( this, model );
};

View.prototype.updateLoopButton = function( model ) {
  if ( model.frameLoop === true ) {
    this.bttnPlayLoop.classList.remove( 'loop-off' );
    this.bttnPlayLoop.classList.add( 'loop-on' );
  } else {
    this.bttnPlayLoop.classList.remove( 'loop-on' );
    this.bttnPlayLoop.classList.add( 'loop-off' );
  }
};

View.prototype.updateVideoToolsHolder = function() {
  this.videoTools.style.width = this.videoFrame.style.width;
  this.videoTools.style.height = this.videoFrame.style.height;
  this.videoTools.style.left = this.videoFrame.offsetLeft + 'px';
};

View.prototype.shiftButtonVisible = function( visible ) {
  this.bttnTouchShift.style.display = visible ? '' : 'none';
  
  if ( visible ) {
    this.seekBar.classList.add( HAS_SHIFT_BUTTON );
  } else {
    this.seekBar.classList.remove( HAS_SHIFT_BUTTON );
  }
};

View.prototype.updateDisplayState = function( model ) {
  updateCurrentState.call( this, model );
};

View.prototype.addNewCreatedObject = function( object ) {
  this.objects.push(
    new Data[ object.type ]( this.objectsHolder, object )
  );
};

View.prototype.videoToolsDisable = function() {
  this.videoTools.style.pointerEvents = 'none';
};

View.prototype.videoToolsEnable = function() {
  this.videoTools.style.pointerEvents = '';
};

View.prototype.updatePointColor = function( object ) {
  for ( var i = this.objects.length; i--; ) {
    if ( this.objects[ i ].name === object.name ) {
      this.objects[ i ].updateColor( object.color.value );
    }
  }
};

module.exports = View;