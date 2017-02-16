'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'colliding-carts-1', 19 ),
    width: 640,
    height: 320
  },
  'matrix': {
    xorigin: 83.5,
    yorigin: 197.5,
    angle: 0.0,
    xscale: 519.5000601539916,
    yscale: 519.5000601539916
  },
  'axis': {
    visible: true
  },
  'tape': {
    points: [
      { x: 62, y: 208 },
      { x: 581.5, y: 208 }
    ],
    visible: true
  },
  'objects': [
    require( './objects/point-cart-left' ),
    require( './objects/point-cart-right' )
  ]
};