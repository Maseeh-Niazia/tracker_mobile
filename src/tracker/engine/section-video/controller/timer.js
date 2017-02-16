'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Public method
module.exports = function( model, view ) {
  var start = Date.now();
  
	var loop = function() {
    var current = Date.now();
    var delta = current - start;
    var delay = 1000 / ( model.frameRate * model.playRate );
    
		if ( delta >= delay ) {
      if ( model.isPlaying ) {
        model.stepInTime();
        view.update( model );
        events.fire( 'VIDEO_CHANGE_FRAME', model.frameCurrent );
      }
      start = current;
    }
    
    requestAnimationFrame( loop );
  };
  
  requestAnimationFrame( loop );
};