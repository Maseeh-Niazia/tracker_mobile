'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 6, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 0.2, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'snowboard-jump-energy', 17 ),
    width: 640,
    height: 360
  },
  'matrix': {
    xorigin: 486.0,
    yorigin: 55.0,
    angle: -4.399999999999994,
    xscale: 72.70734480309824,
    yscale: 72.70734480309824
  },
  'axis': {
    visible: true
  },
  'objects': [
    require( './objects/point-head' ),
    require( './objects/point-legs' ),
    require( './objects/point-tail' ),
    require( './objects/point-cm' )
  ]
};