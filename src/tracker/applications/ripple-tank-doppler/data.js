'use strict';

// Dependency utils
var getFrames = require( '../../utils/images' );

// Build data
module.exports = {
  'video': {
    frameStart: 3, // from 0
    frameStep: 0.00833333, // seconds
    frameRate: 60, // fps
    playRate: 0.1, // percantage
    frameCurrent: 0, // current frame
    frames: getFrames( 'ripple-tank-doppler', 20 ),
    width: 556,
    height: 478
  },
  'matrix': {
    xorigin: 224.88888888888889,
    yorigin: 198.28148148148148,
    angle: 0.0,
    xscale: 2086.5384615384587,
    yscale: 2086.5384615384587
  },
  'axis': {
    visible: true
  },
  'tape': {
    visible: true,
    color: '#00ff00',
    points: [
      { x: 425, y: 456 },
      { x: 497, y: 456 }
    ]
  },
  'objects': [
    require( './objects/point-source' ),
    require( './objects/point-wavefront-1' ),
    require( './objects/point-wavefront-2' )
  ]
};