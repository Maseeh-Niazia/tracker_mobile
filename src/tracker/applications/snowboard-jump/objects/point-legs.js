'use strict';

module.exports = {
  name: 'Legs',
  type: 'point-place',
  mass: 30,
  color: [ 0, 204, 0, 255 ],
  params: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ],
  precisions: {
    't': 1,
    'default': 2
  },
  start: 3,
  placeStart: 7,
  placeEnd: 16,
  track: false,
  frames: [
    [ -3.000000000E-1, 1.872066703E0, -5.012247532E-1, , , , ],
    [ -2.000000000E-1, 1.216684857E0, -3.450260007E-1, -6.397504276E0, 1.427273721E0, , ],
    [ -1.000000000E-1, 5.925658477E-1, -2.157700090E-1, -6.083424283E0, 1.725130004E0, , ],
    [ 0, 0, 0, , , , ]
  ]
};