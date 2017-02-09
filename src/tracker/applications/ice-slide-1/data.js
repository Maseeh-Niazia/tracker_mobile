'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 2, // from 0
    frameStep: 0.2, // seconds
    frameRate: 5, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ice-slide-1', 12 ),
    width: 640,
    height: 123
  },
  'matrix': {
    xorigin: 107.50000000000003,
    yorigin: 71.50000000000001,
    angle: -0.8814039965821383,
    xscale: 65.49083948591742,
    yscale: 65.49083948591742
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ice-slide' ),
  ]
};