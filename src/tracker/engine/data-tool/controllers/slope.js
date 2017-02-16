'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;
var MOUSEENTER = 'mouseenter';
var MOUSELEAVE = 'mouseleave';

// Private method
var slopeShow = function( evt ) {
  if ( !this.model.isSlopeVisible ) {
    return false;
  }
  
  this.isVisible = true;
  
  this.bbox = this.view.chart.svg._node.getBoundingClientRect();
  
  slopeUpdate.call( this, evt );
};

var slopeUpdate = function( evt ) {
  if ( !this.isVisible || !this.model.isSlopeVisible ) {
    return false;
  }
  
  var p = events.user.position( evt );
  p.x -= this.bbox.left;
  p.y -= this.bbox.top;
  
  this.view.slopeUpdate( this.model, p );
};

var slopeHide = function( evt ) {
  if ( this.isVisible ) {
    this.view.slopeHide();
    this.isVisible = true;
  }
};

// Public method
module.exports = function( model, view, ignorePoints ) {
  var ctx = {
    bbox: null,
    model: model,
    view: view,
    isVisible: false
  };
  
  var show = slopeShow.bind( ctx );
  var hide = slopeHide.bind( ctx );
  var update = slopeUpdate.bind( ctx );
  
  if ( events.user.touch ) {
    window.addEventListener( MOUSEUP, hide, false );
    window.addEventListener( MOUSEMOVE, update, false );
    view.chart.grid_paper.addEventListener( MOUSEDOWN, show, false );
  } else {
    view.chart.grid_paper.addEventListener( MOUSEENTER, show, false );
    view.chart.grid_paper.addEventListener( MOUSELEAVE, hide, false );
    view.chart.grid_paper.addEventListener( MOUSEMOVE, update, false );
  }
};