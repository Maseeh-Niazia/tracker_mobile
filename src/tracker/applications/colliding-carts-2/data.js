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
    frames: getFrames( 'colliding-carts-2', 22 ),
    width: 640,
    height: 320
  },
  'matrix': {
    xorigin: 88.25,
    yorigin: 197.0,
    angle: -0.018686209515064042,
    xscale: 515.7549078777633,
    yscale: 515.7549078777633
  },
  'axis': {
    visible: true
  },
  'tape': {
    points: [
      { x: 64, y: 208 },
      { x: 580, y: 208 }
    ],
    visible: true
  },
  'objects': [
    require( './objects/point-cart-left' ),
    require( './objects/point-cart-right' )
  ]
};