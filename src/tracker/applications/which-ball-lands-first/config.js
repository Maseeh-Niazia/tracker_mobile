'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Ball Lands'
  },
  // Minimum video section size
  'video': {
    width: 600,
    height: 400
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Shot ball',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'Dropped ball',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'bottomL': {
    visible: true,
    object: 'Shot ball',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y' ]
    }
  },
  'bottomR': {
    visible: true,
    object: 'Dropped ball',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y' ]
    }
  }
};