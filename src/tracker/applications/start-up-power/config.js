'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'StartUp Power'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'bottomL': {
    visible: true,
    object:'Car',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x' ]
    }
  },
  'bottomR': {
    visible: false
  }
};