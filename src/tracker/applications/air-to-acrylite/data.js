'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 0, // from 0
    frameStep: 0.198, // seconds
    frameRate: 5.1, // fps
    playRate: 1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'air-to-acrylite', 43 ),
    width: 640,
    height: 480,
    displayState: 'frame'
  },
  'matrix': {
    xorigin: 331.0,
    yorigin: 238.0,
    angle: -0.09517562593594513,
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
      { x: 466, y: 121 },
      { x: 499, y: 170 },
      { x: 408, y: 114 }
    ]
  },
  'objects': [
    
  ]
};