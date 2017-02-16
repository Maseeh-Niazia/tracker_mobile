'use strict';

var DEFAULT_PRECISION = 3;
var DEFAULT_COLUMNS_NUM = 3;

var getColumns = function( object, config ) {
  if ( config.columns && config.columns.length > 0 ) {
    var columns = [], i;
    
    for ( i = config.columns.length; i--; ) {
      if ( object.params.indexOf( config.columns[ i ] ) > -1 ) {
        columns.push( config.columns[ i ] );
      }
    }
    
    return columns.reverse();
  } else {
    return object.params.slice( 0, Math.min( DEFAULT_COLUMNS_NUM, object.params.length ) );
  }  
};

var Model = function( frame, object, config ) {
  this.frame = frame;
  this.updateObject( object, config );
};

Model.prototype.updateObject = function( object, config ) {
  this.object = object;
  this.data = object.frames;
  this.allParams = object.params;
  this.precisions = object.precisions || {};
  this.selectedColumns = getColumns( object, config );
  this.start = object.start || 0;
};

Model.prototype.addColumn = function( column ) {
  var index = this.allParams.indexOf( column );

  if ( this.selectedColumns.indexOf( column ) === -1 ) {
    if ( index !== -1 ) {
      this.selectedColumns.splice( index, 0, column );
    }
  }
};

Model.prototype.removeColumn = function( column ) {
  var index = this.selectedColumns.indexOf( column );

  if ( index !== -1 ) {
    this.selectedColumns.splice( index, 1 );
  }
};

Model.prototype.getPrecisionFor = function( name ) {
  return this.precisions[ name ] || this.precisions.default || DEFAULT_PRECISION;
};

Model.prototype.getHighlightIndex = function( frame ) {
  // Model point always start with first frame, predefine points - from start frame
  var index = this.object.isModel ? frame + 1 : frame - this.start + 1;
  var position = NaN;

  if ( index < this.data.length && !this.data[ index ] ) {
    return position;
  }
  
  for ( var i = 0; i < index; i++ ) {
    if ( this.data[ i ] ) {
      if ( isNaN( position) ) {
        position = 0;
      } else {
        position += 1;
      }
    }
  }
  
  return position;
};

module.exports = Model;