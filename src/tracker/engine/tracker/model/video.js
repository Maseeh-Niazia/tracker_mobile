'use strict';

var calcBoundingBox = function() {
  return {
    width   : Math.ceil( this.magnification * this.width ),
    height  : Math.ceil( this.magnification * this.height )
  };
};

var Video = function( model ) {
  this.frameStart = model.frameStart;
  this.frameStep = model.frameStep;
  this.frameRate = model.frameRate;
  this.playRate = model.playRate;
  this.frameCurrent = model.frameCurrent;
  this.frames = model.frames;
  this.width = model.width;
  this.height = model.height;
  this.magnification = model.magnification || 1;
  this.displayState = model.displayState;
  
  this.bbox = calcBoundingBox.call( this );
};

module.exports = Video;