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
    frames: getFrames( 'swing', 33 ),
    width: 517,
    height: 337
  },
  'matrix': {
    xorigin: 244.99999999999994,
    yorigin: 284.0,
    angle: -0.7727285922963977,
    xscale: 108.96399578940238,
    yscale: 108.96399578940238
  },
  'axis': {
    visible: false
  },
  'objects': [
    require( './objects/point-swing' )
  ]
};