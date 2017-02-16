'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Car Zoom'
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
      view: 'table',
      columns: [ 't', 'x', 'v_x' ]
    }
  },
  'rightB': {
    visible: false
  },
  'bottomL': {
    visible: true
  },
  'bottomR': {
    visible: true
  }
};