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
    frames: getFrames( 'colliding-carts-4', 16 ),
    width: 640,
    height: 320
  },
  'matrix': {
    xorigin: 76.49999999999997,
    yorigin: 197.0,
    angle: 0.0,
    xscale: 518.2669163336117,
    yscale: 518.2669163336117
  },
  'axis': {
    visible: true
  },
  'tape': {
    points: [
      { x: 63, y: 208 },
      { x: 581.5, y: 208 }
    ],
    visible: true
  },
  'objects': [
    require( './objects/point-cart-left' ),
    require( './objects/point-cart-right' )
  ]
};