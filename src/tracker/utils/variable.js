'use strict';

module.exports = function( text ) {
  var label = text.split( '_' );
  var type = label[ 1 ] || '';
  
  return {
    label: label[ 0 ],
    type: type
  };
};