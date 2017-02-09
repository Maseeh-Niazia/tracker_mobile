'use strict';

module.exports = {
  name: 'model cm',
  type: 'point-model',
  radius: 8,
  mass: 0,
  precisions: {
    't': 1,
    'default': 3
  },
  color: [ 255, 255, 0, 255 ],
  params: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ],
  frames: [
    // initial values
    [ 0, 0, 0, 0, 0, 0, 0 ]
  ],
  start: 6,
  end: 17,
  track: false
};