'use strict';

module.exports = {
  // Application info
  'application': {
    name: 'Snowboard Jump',
    current: 'Legs'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 400
  },
  'rightT': {
    visible: true,
    object: 'Legs',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'Legs',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'y'
    }
  },
  'bottomL': {
    visible: false
  },
  'bottomR': {
    visible: true,
    object: 'Legs',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ]
    }
  }
};