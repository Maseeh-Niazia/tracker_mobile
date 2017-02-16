'use strict';

/**
 * The core module of Graph that is mainly providing static functions and higher level functions for chart modules.
 *
 * https://github.com/gionkunz/chartist-js.git
**/

var Graph = {
  version: '0.9.5'
};

// Styles
require( './style/core.less' );

// Build other modules
require( './core/core' )( Graph );
require( './core/interpolation' )( Graph );
require( './core/event' )( Graph );
require( './core/class' )( Graph );
require( './core/base' )( Graph );
require( './core/svg' )( Graph );
require( './core/svg-path' )( Graph );
require( './core/axes/axis' )( Graph );
require( './core/axes/axis-scale-auto' )( Graph );
require( './core/axes/axis-scale-fixed' )( Graph );
require( './core/axes/axis-step' )( Graph );
require( './core/charts/line' )( Graph );

module.exports = Graph;