'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Car Stop'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'bottomL': {
    visible: true,
    object: 'car',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x' ]
    }
  },
  'bottomR': {
    visible: false,
    object: 'car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'a_x'
    }
  }
};