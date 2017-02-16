'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.001, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'tennis-ball-bounce', 36 ),
    width: 639,
    height: 433
  },
  'matrix': {
    xorigin: 324.0,
    yorigin: 359.0,
    angle: 0.0,
    xscale: 3049.0585122938064,
    yscale: 3049.0585122938064
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ball' )
  ]
};