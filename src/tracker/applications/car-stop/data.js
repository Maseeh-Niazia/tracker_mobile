'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 5, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'car-stop', 47 ),
    width: 640,
    height: 174
  },
  'matrix': {
    xorigin: 31.500000000000053,
    yorigin: 132.99999999999997,
    angle: -0.44005109775646045,
    xscale: 31.672929716216753,
    yscale: 31.672929716216753
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-car' )
  ]
};