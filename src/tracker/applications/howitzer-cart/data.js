'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 1, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'howitzer-cart', 8 ),
    width: 600,
    height: 440,
    displayState: 'frame'
  },
  'matrix': {
    xorigin: 146.49999999999997,
    yorigin: 408.0,
    angle: 0.0,
    xscale: 436.50000000000074,
    yscale: 436.50000000000074
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ball' ),
    require( './objects/point-base' )
  ]
};