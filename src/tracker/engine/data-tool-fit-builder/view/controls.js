'use strict';

var Controls = function( node ) {
  this.add = node.querySelector( '.dtfb-panel-buttons > button[name="add"]' );
  this.remove = node.querySelector( '.dtfb-panel-buttons > button[name="remove"]' );
};

module.exports = Controls;