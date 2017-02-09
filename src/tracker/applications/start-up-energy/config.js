'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'StartUp Energy'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  // Other frames parameters
  'rightT': {
    visible: false
  },
  'rightB': {
    visible: true,
    object: 'Car',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x' ]
    }
  },
  'bottomL': {
    visible: false
  },
  'bottomR': {
    visible: true,
    object: 'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  }
};