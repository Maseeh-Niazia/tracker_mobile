'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.06666666667, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'mass-and-spring', 75 ),
    width: 372,
    height: 472
  },
  'matrix': {
    xorigin: 275.80256121069147,
    yorigin: 347.7228714274745,
    angle: 0.29229266937788273,
    xscale: 465.27626202074816,
    yscale: 465.27626202074816
  },
  'axis': {
    visible: true
  },
  'objects': [
    require( './objects/point-mass' ),
  ]
};