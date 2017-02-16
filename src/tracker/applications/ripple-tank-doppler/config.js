'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: '2D Surface Wave Propagation'
  },
  // Minimum video section size
  'video': {
    width: 700,
    height: 500
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'wavefront1',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'wavefront2',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x' ]
    }
  },
  'bottomL': {
    'visible': false
  },
  'bottomR': {
    'visible': false
  }
};