'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 1, // from 0
    frameStep: 0.1, // seconds
    frameRate: 2, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'coulomb', 17 ),
    width: 640,
    height: 480
  },
  'matrix': {
    xorigin: 467.5,
    yorigin: 191.5,
    angle: -0.3292824638466704,
    xscale: 562.008272466143,
    yscale: 562.008272466143
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ball-1' ),
    require( './objects/point-ball-2' ),
    require( './objects/vector-radius' )
  ]
};