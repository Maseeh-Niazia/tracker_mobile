'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 4, // from 0
    frameStep: 0.033, // seconds
    frameRate: 27.7, // fps
    playRate: 0.1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'which-ball-lands-first', 13 ),
    width: 320,
    height: 240
  },
  'matrix': {
    xorigin: 255.4594154601839,
    yorigin: 60.95658377092331,
    angle: -0.1741507692065826,
    xscale: 255.04950936132872,
    yscale: 255.04950936132872
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ball-dropped' ),
    require( './objects/point-ball-shot' ),
  ]
};