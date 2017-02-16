'use strict';

module.exports = {
  // Application info
  'application': {
    name: 'Ice Slide',
    current: 'Ice Slide'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  'rightT': {
    visible: true,
    object: 'Ice Slide',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'rightB': {
    visible: true,
    object: 'model boy',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'bottomL': {
    visible: true,
    object: 'Ice Slide',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'bottomR': {
    visible: true,
    object: 'model boy',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  }
};