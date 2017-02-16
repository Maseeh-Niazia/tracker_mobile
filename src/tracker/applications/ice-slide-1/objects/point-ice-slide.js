'use strict';

module.exports = {
  name: 'Ice Slide',
  type: 'point',
  mass: 35,
  color: [ 0, 204, 0, 255 ],
  params: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y', 'K' ],
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
    'default': 2
  },
  start: 2,
  track: false,
  frames: [
    [ 0.000000000E0, -7.633752183E-3, -1.174423413E-4, , , , , ],
    [ 2.000000000E-1, 9.544539076E-1, -5.872117064E-4, 4.716974928E0, -4.581426339E-3, , , 3.893727855E2 ],
    [ 4.000000000E-1, 1.879156219E0, -1.950012877E-3, 4.543256972E0, -6.459328770E-3, -8.780246246E-1, -1.123755258E-2, 3.612214487E2 ],
    [ 6.000000000E-1, 2.771756697E0, -3.170943215E-3, 4.369539017E0, -8.337231202E-3, -8.479633221E-1, -1.191033029E-2, 3.341264628E2 ],
    [ 8.000000000E-1, 3.626971826E0, -5.284905358E-3, 4.199738124E0, -1.174423413E-2, -7.946959661E-1, 3.389656050E-2, 3.086639192E2 ],
    [ 1.000000000E0, 4.451651946E0, -7.868636866E-3, 4.053226668E0, 2.939353267E-3, -8.086773438E-1, -3.342677718E-2, 2.875014636E2 ],
    [ 1.200000000E0, 5.248262493E0, -4.109164051E-3, 3.881614087E0, -1.551460074E-2, -8.734683182E-1, 4.564277007E-2, 2.636754509E2 ],
    [ 1.400000000E0, 6.004297581E0, -1.407447716E-2, 3.696793433E0, 1.758340384E-3, -7.910490178E-1, 1.496213859E-2, 2.391599836E2 ],
    [ 1.600000000E0, 6.726979866E0, -3.405827897E-3, 3.563055927E0, 1.551460074E-2, -7.828821434E-1, 8.928303817E-2, 2.221731442E2 ],
    [ 1.800000000E0, 7.429519952E0, -7.868636866E-3, 3.397606933E0, 1.409308095E-2, , , 2.020188010E2 ],
    [ 2.000000000E0, 8.086022639E0, 2.231404484E-3, , , , , ]
  ]
};