'use strict';

var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEMOVE = events.user.mousemove;
var MOUSEUP = events.user.mouseup;

// Controller constructor
var Controller = function( view ) {
  view.bttnClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();

    events.fire( 'HELP:closed' );

    evt.preventDefault();
    evt.stopPropagation();
  } );
};

module.exports = Controller;
