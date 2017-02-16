'use strict';

var SegModel = {
  'M': function() {
    this.x = 0;
    this.y = 0;
  },
  'L': function() {
    this.x = 0;
    this.y = 0;
  },
  'C': function() {
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
  },
  'Z': function() {
  }
};

var SegModelSequence = {
  'M': [ 'x', 'y' ],
  'L': [ 'x', 'y' ],
  'C': [ 'x1', 'y1', 'x2', 'y2', 'x', 'y' ]
}

var getItem = function( n ) {
  return this[ n ];
};

var parse = function( path ) {
  var segList = [], seg = null, num = '', ind = 0, i, l;
  
  for ( i = 0, l = path.length; i < l; i++ ) {
    if ( SegModel[ path[ i ] ] ) {
      if ( num !== '' && seg !== null ) {
        seg[ SegModelSequence[ seg.pathSegTypeAsLetter ][ ind ] ] = Number( num );
        num = '';
      }
      
      seg = new SegModel[ path[ i ] ]();
      seg.pathSegTypeAsLetter = path[ i ];
      segList.push( seg );
      
      ind = 0;
    } else
    if ( path[ i ] === ',' || path[ i ] === ' ' ) {
      seg[ SegModelSequence[ seg.pathSegTypeAsLetter ][ ind ] ] =  Number( num );
      num = '';
      
      ind++;
    } else {
      num += path[ i ];
    }
  }
  
  if ( num !== '' && seg !== null ) {
    seg[ SegModelSequence[ seg.pathSegTypeAsLetter ][ ind ] ] = Number( num );
  }
  
  segList.numberOfItems = segList.length;
  segList.getItem = getItem;
  
  return segList;
};

module.exports = function( node ) {
  return parse( node.getAttribute( 'd' ) );
};