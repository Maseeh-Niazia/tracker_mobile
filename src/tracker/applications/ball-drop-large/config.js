'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Ball Drop Large'
  },
  // Minimum video section size
  'video': {
    width: 350,
    height: 650
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Large Ball',
    data: {
      view: 'table',
      columns: [ 't', 'y', 'v_y', 'a_y' ]
    }
  },
  'rightB': {
    visible: true,
    object: 'Large Ball',
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
    'visible': false
  }
};