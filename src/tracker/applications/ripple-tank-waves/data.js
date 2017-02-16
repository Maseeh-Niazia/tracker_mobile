'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 2, // from 0
    frameStep: 0.00833333, // seconds
    frameRate: 60, // fps
    playRate: 0.1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ripple-tank-waves', 18 ),
    width: 562,
    height: 480
  },
  'matrix': {
    xorigin: 273.49999999999994,
    yorigin: 198.49999999999997,
    angle: 0.0,
    xscale: 2092.3076923076924,
    yscale: 2092.3076923076924
  },
  'axis': {
    visible: true
  },
  'tape': {
    visible: true,
    color: '#00ff00',
    points: [
      { x: 440, y: 456 },
      { x: 522.11, y: 456 }
    ]
  },
  'objects': [
    require( './objects/point-wavefront-1' ),
    require( './objects/point-wavefront-2' )
  ]
};