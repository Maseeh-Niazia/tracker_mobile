'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 2, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'snowboard-run', 12 ),
    width: 640,
    height: 290
  },
  'matrix': {
    xorigin: 607.5,
    yorigin: 116.0,
    angle: -4.100000000000006,
    xscale: 70.66731149133402,
    yscale: 70.66731149133402
  },
  'axis': {
    visible: true
  },
  'protractor': {
    visible: true,
    color: '#148C14',
    points: [
      { x: 81,  y: 78 },
      { x: 607, y: 116 },
      { x: 537, y: 221 }
    ]
  },
  'objects': [
    require( './objects/point-eric' )
  ]
};