'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Howitzer cart'
  },
  // Minimum video section size
  'video': {
    width: 600,
    height: 440
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Ball',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'y', 'v_y' ]
    }
  },
  'rightB': {
    visible: true,
    object: 'Ball',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'

    }
  },
  'bottomL': {
    visible: true,
    object: 'Base',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'bottomR': {
    visible: true,
    object: 'Base',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x' ]
    }
  }
};