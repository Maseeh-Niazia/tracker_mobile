'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Start Up'
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
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'rightB': {
    visible: false
  },
  'bottomL': {
    visible: true,
    object: 'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
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