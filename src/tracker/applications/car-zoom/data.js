'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 3, // from 0
    frameStep: 0.2, // seconds
    frameRate: 5, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'car-zoom', 19 ),
    width: 640,
    height: 186
  },
  'matrix': {
    xorigin: 6.000000000000055,
    yorigin: 140.49999999999997,
    angle: 0.4612144010958182,
    xscale: 31.65413762343352,
    yscale: 31.65413762343352
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-car' )
  ]
};