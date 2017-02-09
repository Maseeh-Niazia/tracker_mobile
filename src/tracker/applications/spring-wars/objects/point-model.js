'use strict';

module.exports = {
  name: 'Model',
  type: 'point-model',
  mass: 0.250,
  color: [ 255, 180, 0, 255 ],
  params: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ],
  bounds: {
    'y': {
      min: -1,
      max: 1
    },
    'v_y': {
      min: -3,
      max: 3
    },
    'a_y': {
      min: -5,
      max: 5
    }
  },
  precisions: {
    't': 1,
    'x': 3,
    'default': 2
  },
  frames: [
    // initial values
    [ 0, 0, 0, 0, 0, 0, 0 ]
  ],
  start: 3,
  end: 118,
  track: false
};