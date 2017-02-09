'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.1, // seconds
    frameRate: 5.1, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'acrylite-to-air', 34 ),
    width: 640,
    height: 480,
    displayState: 'frame'
  },
  'matrix': {
    xorigin: 335.0,
    yorigin: 240.5,
    angle: -0.24277727376682284,
    xscale: 1.0,
    yscale: 1.0
  },
  'axis': {
    visible: true
  },
  'protractor': {
    visible: true,
    color: '#00ff00',
    points: [
      { x: 459, y: 112 },
      { x: 472, y: 165 },
      { x: 385, y: 111 }
    ]
  },
  'objects': [
    
  ]
};