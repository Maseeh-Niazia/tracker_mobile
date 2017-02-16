'use strict';

var SELECTED = 'selected';
var TITLE = {
  'time': 'Time in seconds',
  'frame': 'Frame number'
};
var TITLE_CLICK = '(click to change)';

var Menu = function( holder ) {
  this.node = holder.querySelector( '.menu-choose-display' );
  this.holder = holder;
  
  this.selected = null;
  this.labels = {
    'time': this.node.querySelector( '.display-time' ),
    'frame': this.node.querySelector( '.display-frame' )
  };
  
  this.hide();
};

Menu.prototype.show = function() {
  this.node.style.display = '';
};

Menu.prototype.hide = function() {
  this.node.style.display = 'none';
};

Menu.prototype.update = function( model ) {
  var state = model.currentDisplayState;
  
  if ( this.selected ) {
    this.selected.classList.remove( SELECTED );
  }
  
  this.selected = this.labels[ state ];
  this.selected.classList.add( SELECTED );
  
  this.holder.setAttribute( 'title', TITLE[ state ] + ' ' + TITLE_CLICK );
};

module.exports = Menu;