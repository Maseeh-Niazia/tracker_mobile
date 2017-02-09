'use strict';

// Controller constructor
var Controller = function( view ) {
  view.bttnClose.addEventListener( 'click', view.hide.bind( view ) );
};

module.exports = Controller;