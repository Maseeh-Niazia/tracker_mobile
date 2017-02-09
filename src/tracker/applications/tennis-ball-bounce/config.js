'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'BouncingTennis Ball'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 500
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'tennis-ball',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'y'
    }
  },
  'rightB': {
    visible: true,
    object: 'tennis-ball',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_y'
    }
  },
  'bottomL': {
    visible: true,
    object: 'tennis-ball',
    data: {
      view: 'table',
      columns: [ 't', 'y', 'v_y', 'a_y', 'p_y', 'Fy' ]
    }
  },
  'bottomR': {
    visible: false
  }
};