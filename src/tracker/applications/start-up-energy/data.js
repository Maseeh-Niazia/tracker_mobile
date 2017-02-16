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
    frames: getFrames( 'start-up-energy', 21 ),
    width: 640,
    height: 138
  },
  'matrix': {
    xorigin: 48.47099602436583,
    yorigin: 100.1126983722081,
    angle: 0.32260796183996326,
    xscale: 32.42004246106127,
    yscale: 32.42004246106127
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-car' )
  ]
};