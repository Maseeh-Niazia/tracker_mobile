'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Swing'
  },
  // Minimum video section size
  'video': {
    width: 550,
    height: 450
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'swing',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'swing',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'y'
    }
  },
  'bottomL': {
    'visible': false
  },
  'bottomR': {
    visible: true,
    object: 'swing',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y', 'v', 'K' ]
    }
  }
};