'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 1, // from 0
    frameStep: 0.1, // seconds
    frameRate: 10, // fps
    playRate: 0.6, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ball-drop-large', 15 ),
    width: 241,
    height: 596
  },
  'matrix': {
    xorigin: 173.05286343612335,
    yorigin: 57.88472834067548,
    angle: 1.1903903446085384,
    xscale: 82.70224547718821,
    yscale: 82.70224547718821
  },
  'axis': {
    visible: true
  },
  'tape': {
    visible: true,
    color: '#ffff00',
    points: [
      { x: 64,  y: 74  },
      { x: 67,  y: 332 }
    ]
  },
  'objects': [
    require( './objects/point-ball' )
  ]
};