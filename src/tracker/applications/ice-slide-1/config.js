'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Ice Slide'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 200
  },
  // Other frames parameters
  'rightT': {
    visible: true,
    object: 'Ice Slide',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'rightB': {
    visible: false
  },
  'bottomL': {
    visible: true,
    object: 'Ice Slide',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x'
    }
  },
  'bottomR': {
    visible: true,
    object: 'Ice Slide',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'v_x'
    }
  }
};