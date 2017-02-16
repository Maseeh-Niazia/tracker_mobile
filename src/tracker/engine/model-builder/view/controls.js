'use strict';

var Controls = function( node ) {
  this.add = node.querySelector( '.mb-panel-buttons > button[name="add"]' );
  this.cut = node.querySelector( '.mb-panel-buttons > button[name="cut"]' );
  this.copy = node.querySelector( '.mb-panel-buttons > button[name="copy"]' );
  this.paste = node.querySelector( '.mb-panel-buttons > button[name="paste"]' );
  this.remove = node.querySelector( '.mb-panel-buttons > button[name="remove"]' );
};

module.exports = Controls;