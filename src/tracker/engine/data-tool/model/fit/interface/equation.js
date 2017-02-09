'use strict';

module.exports = function( str ) {
  return str
    .replace( /_x/g, '<sub>x</sub>' )
    .replace( /_y/g, '<sub>y</sub>' );
};