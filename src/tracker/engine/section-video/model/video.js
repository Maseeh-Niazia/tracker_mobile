'use strict';

// Dependency model
var Axis = require( './axis' );
var Tape = require( './tape' );
var Protractor = require( './protractor' );

// Constants
var PLAY_RATE_MAX = 5;
var PLAY_RATE_MIN = 0.1;
var PLAY_RATE_STEP = 0.1;

// Model constructor
var Model = function( model ) {
  var video = model.video;
  
  this.magnification = video.magnification;

  this.frameCurrent = video.frameCurrent || 0;
  this.frameLoop = video.frameLoop || false;
  this.frameStart = video.frameStart || 0;
  this.frameTotal = video.frames.length;
  this.frameStep = video.frameStep || 0.1;
  this.frameRate = video.frameRate;
  
  this.width = video.width * video.magnification;
  this.height = video.height * video.magnification;
  
  this.playRate = video.playRate || 1;
  this.frames = video.frames;
  this.isPlaying = false;
  
  this.axis = new Axis( model );
  this.tape = new Tape( model.tape, model.matrix );
  this.protractor = new Protractor( model.protractor) ;
  
  this.shiftKeyDown = false;
  
  this.objects = model.objects;
  
  this.scale = 1;
  
  this.currentTrack = null;
  
  this.currentDisplayState = video.displayState || 'time';
};

Model.prototype.play = function() {
  this.isPlaying = true;
};

Model.prototype.stop = function() {
  this.isPlaying = false;
};

Model.prototype.gotoAndStop = function( n ) {
  this.frameCurrent = n;
  this.isPlaying = false;
};

Model.prototype.goto = function( n ) {
  this.frameCurrent = n;
};

Model.prototype.clearScale = function() {
  this.scale = 1;
};

Model.prototype.updateScale = function( scale ) {
  this.scale = scale;
};

Model.prototype.getCurrentState = function() {
  if ( this.currentDisplayState === 'time' ) {
    var frame = this.frameCurrent - this.frameStart;
    return ( frame * this.frameStep ).toFixed( 3 );
  } else
  if ( this.currentDisplayState === 'frame' ) {
    var frame = this.frameCurrent.toString();
    for ( var i = 3; i >= frame.length; i-- ) {
      frame = '0' + frame;
    }
    return frame;
  }
};

Model.prototype.stepInTime = function() {
  if ( this.frameCurrent + 1 === this.frameTotal ) {
    if ( this.frameLoop ) {
      this.frameCurrent = 0;
    } else {
      this.isPlaying = false;
    }
  } else {
    this.frameCurrent += 1;
  }
};

Model.prototype.changeFrame = function( dn ) {
  this.frameCurrent += dn;
};

Model.prototype.isInFirstFrame = function() {
  return this.frameCurrent === 0;
};

Model.prototype.isInLastFrame = function() {
  return this.frameCurrent === this.frameTotal - 1;
};

Model.prototype.isPlayRateMin = function() {
  return this.playRate === PLAY_RATE_MIN;
};

Model.prototype.isPlayRateMax = function() {
  return this.playRate === PLAY_RATE_MAX;
};

Model.prototype.changePlayRate = function( d ) {
  this.playRate += PLAY_RATE_STEP * d;
  this.playRate = parseFloat( this.playRate.toFixed( 1 ) );
};

Model.prototype.toogleLoop = function() {
  this.frameLoop = !this.frameLoop;
};

Model.prototype.setCurrentTrack = function ( name ) {
  this.currentTrack = this.objects.find( name );
}

module.exports = Model;