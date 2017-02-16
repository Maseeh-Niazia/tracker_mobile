'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 0.2, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'colliding-carts-3', 26 ),
    width: 640,
    height: 320
  },
  'matrix': {
    xorigin: 83.25,
    yorigin: 196.75,
    angle: -0.0037539002444525113,
    xscale: 519.0000000000005,
    yscale: 519.0000000000005
  },
  'axis': {
    visible: true
  },
  'tape': {
    points: [
      { x: 62.5, y: 208 },
      { x: 581.5, y: 208 }
    ],
    visible: true
  },
  'objects': [
    require( './objects/point-cart-left' ),
    require( './objects/point-cart-right' )
  ]
};