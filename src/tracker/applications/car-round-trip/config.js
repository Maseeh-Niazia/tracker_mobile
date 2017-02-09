'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Car Round Trip'
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
    visible: true,
    object: 'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'a_x'
    }
  },
  'bottomL': {
    visible: true,
    object:'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'bottomR': {
    visible: true,
    object:'Car',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  }
};