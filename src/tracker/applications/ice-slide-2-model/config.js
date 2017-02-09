'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Ice Slide 2',
    current: 'Ice Slide 2'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  'rightT': {
    visible: true,
    object: 'Ice Slide 2',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'rightB': {
    visible: true,
    object: 'model man',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'bottomL': {
    visible: true,
    object: 'Ice Slide 2',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  },
  'bottomR': {
    visible: true,
    object: 'model man',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  }
};