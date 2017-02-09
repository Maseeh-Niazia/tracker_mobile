'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Colliding Carts'
  },
  // Minimum video section size
  'video': {
    width: 680,
    height: 380
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Left Cart 524 g',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'rightB': {
    visible: true,
    object: 'Right Cart 1048 g',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'bottomL': {
    visible: true,
    object: 'Left Cart 524 g',
    data: {
      view: 'table',
      columns: [ 't', 'v_x', 'p_x', 'K' ]
    }
  },
  'bottomR': {
    visible: true,
    object: 'Right Cart 1048 g',
    data: {
      view: 'table',
      columns: [ 't', 'v_x', 'p_x', 'K' ]
    }
  }
};