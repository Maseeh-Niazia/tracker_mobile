'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Electrostatic Force'
  },
  // Minimum video section size
  'video': {
    width: 800,
    height: 500
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'radius',
    data: {
      view: 'graph',
      axisX: 'x',
      axisY: 'xhead'
    }
  },
  'rightB': {
    visible: true,
    object: 'radius',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'x_tail', 'xhead' ]
    }
  },
  'bottomL': {
    visible: false
  },
  'bottomR': {
    visible: false
  }
};