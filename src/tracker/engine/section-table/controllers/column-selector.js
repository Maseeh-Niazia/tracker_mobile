'use strict';
// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;

// Controller constructor
var Controller = function( model, view ) {
  // Close behaviour
  view.bttnClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  for ( var i = view.selectors.length; i--; ) {
    view.selectors[ i ].node.addEventListener( events.input.change, function( selector ) {
      events.fire( 'CHANGE_DATA_PARAMETERS:table:' + model.frame, {
        isChecked : selector.input.checked,
        column : selector.column
      } );
    }.bind( view.selectors[ i ].node, view.selectors[ i ] ) );
  }
};

module.exports = Controller;