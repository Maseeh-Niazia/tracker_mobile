'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.2, // seconds
    frameRate: 5, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'car-round-trip', 86 ),
    width: 640,
    height: 158
  },
  'matrix': {
    xorigin: 32.56109344766851,
    yorigin: 112.23401871576773,
    angle: -0.3974209986061688,
    xscale: 27.508175844279663,
    yscale: 27.508175844279663
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-car' )
  ]
};