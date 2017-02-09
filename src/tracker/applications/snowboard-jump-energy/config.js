'use strict';

module.exports = {
  // Application info
  'application': {
    name: 'Snowboard Jump',
    current: 'cm'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 400
  },
  'rightT': {
    visible: true,
    object: 'cm',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_y'
    }
  },
  'rightB': {
    visible: true,
    object: 'cm',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v'
    }
  },
  'bottomL': {
    visible: false
  },
  'bottomR': {
    visible: true,
    object: 'cm',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_y', 'v' ]
    }
  }
};