'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 0.5, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ball-drop-2', 11 ),
    width: 249,
    height: 595
  },
  'matrix': {
    xorigin: 176.0,
    yorigin: 82.0,
    angle: 1.2188752351312977,
    xscale: 81.66386719485864,
    yscale: 81.66386719485864
  },
  'axis': {
    visible: true
  },
  'objects': [
    require( './objects/point-ball' )
  ]
};