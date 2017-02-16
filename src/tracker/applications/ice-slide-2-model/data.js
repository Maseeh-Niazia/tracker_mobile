'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 1, // from 0
    frameStep: 0.2, // seconds
    frameRate: 5, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ice-slide-2-model', 15 ),
    width: 641,
    height: 137
  },
  'matrix': {
    xorigin: 29.000000000000046,
    yorigin: 63.5,
    angle: -0.9503167717468703,
    xscale: 65.61239506269656,
    yscale: 65.61239506269656
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-ice-slide' ),
    require( './objects/point-model-man' )
  ]
};