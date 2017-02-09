'use strict';

module.exports = {
  // Application info
  'application': {
    name: 'Snowboard Jump Dynamic',
    current: 'model cm'
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
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ]
    }
  },
  'rightB': {
    visible: true,
    object: 'model cm',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'y', 'v_x', 'v_y', 'a_x', 'a_y' ]
    }
  },
  'bottomL': {
    visible: true,
    object: 'cm',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_y'
    }
  },
  'bottomR': {
    visible: true,
    object: 'model cm',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_y'
    }
  }
};