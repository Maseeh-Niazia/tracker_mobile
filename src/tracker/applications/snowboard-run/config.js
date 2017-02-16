'use strict';

module.exports = {
  // Application info
  'application': {
    name: 'Snowboard Run'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 400
  },
  'rightT': {
    visible: true,
    object: 'Eric',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'rightB': {
    visible: true,
    object: 'Eric',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'y'
    }
  },
  'bottomL': {
    visible: true,
    object: 'Eric',
    data: {
      view: 'table',
      columns:  [ 't', 'x', 'y' ]
    }
  },
  'bottomR': {
    visible: true,
    object: 'Eric',
    data: {
      view: 'graph',
      axisX: 'x',
      axisY: 'y'
    }
  }
};