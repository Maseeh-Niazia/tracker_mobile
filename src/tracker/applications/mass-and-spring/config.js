'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Mass & Spring'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 200
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Mass',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'y'
    }
  },
  'rightB': {
    visible: true,
    object: 'Mass',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_y'
    }
  },
  'bottomL': {
    'visible': false
  },
  'bottomR': {
    'visible': false
  }
};