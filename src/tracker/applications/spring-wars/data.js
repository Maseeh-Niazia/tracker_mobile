'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 3, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'spring-wars', 118 ),
    width: 403,
    height: 185,
    magnification: 1.4142135623730954
  },
  'matrix': {
    xorigin: 221.0,
    yorigin: 87.5,
    angle: 0,
    xscale: 539.4103857610137,
    yscale: 539.4103857610137
  },
  'axis': {
    visible: true
  },
  'objects': [
    require( './objects/point-mass' ),
    require( './objects/point-model' )
  ]
};