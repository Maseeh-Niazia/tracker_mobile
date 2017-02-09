'use strict';

module.exports = {
  // Application restrictions on size
  'application': {
    name: 'Spring Wars',
    current: 'Mass'
  },
  // Minimum video section size
  'video': {
    width: 650,
    height: 300
  },
  'rightT': {
    visible: true,
    object: 'Mass',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x' 
    }
  },
  'rightB': {
    visible: true,
    object: 'Model',
    data: {
      view: 'graph',
      axisX: 't',
      axisY: 'x' 
    }
  },
  'bottomL': {
    visible: true,
    object: 'Mass',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  },
  'bottomR': {
    visible: true,
    object: 'Model',
    data: {
      view: 'table',
      columns: [ 't', 'x', 'v_x', 'a_x' ]
    }
  }
};