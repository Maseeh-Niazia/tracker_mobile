'use strict';

var ni = require( 'os' ).networkInterfaces();

module.exports = function() {
  for ( var k in ni ) {
    var niv = ni[ k ];
    
    for ( var j in niv ) {
      if ( niv[ j ].family === 'IPv4' && !niv[ j ].internal ) {
        return niv[ j ].address;
      }
    }
  }
} ();