'use strict';

var SHIFT_INDEX = {
  't'   : 0,
  'x'   : 0,
  'y'   : 0,
  'r'   : 0,
  'θ'   : 0,
  'v_x' : 1,
  'v_y' : 1,
  'v'   : 1,
  'p_x' : 1,
  'p_y' : 1,
  'Fx'  : 1,
  'Fy'  : 1,
  'p'   : 1,
  'F'   : 1,
  'K'   : 1,
  'ω'   : 1,
  'θp'  : 1,
  'a_x' : 2,
  'a_y' : 2,
  'a'   : 2,
  'α'   : 2,
  'θa'  : 2,
  'KE'  : 1,
  'PE'  : 0,
  'TE'  : 1,
  'xhead' : 0,
  'x_tail': 0,
  'y_tail': 0
};

var isNumeric = function( value ) {
  return !isNaN( value ) && isFinite( value );
};

var getPointObject = function( x, y ) {
  if ( isNumeric( x ) && isNumeric( y ) ) {
    return { 'x' : x, 'y' : y };
  }
  else {
    return null;
  }
};

var getAxisLabels = function( object, config ) {
  if ( config.axisX && config.axisY ) {
    return {
      axisX: config.axisX,
      axisY: config.axisY
    };
  } else {
    return object.axisIndex.getAxisLabels();
  }
};

var Model = function( frame, object, config ) {
  var axisLabels = getAxisLabels( object, config );
  
  this.frame = frame;
  this.object = object;
  this.allParams = object.params;
  this.data = object.frames;
  this.dataSet = [];
  this.isModel = object.isModel;
  this.axisX = axisLabels.axisX;
  this.axisY = axisLabels.axisY;
  this.start = object.start || 0;
  this.end = object.end || object.frames.length;
  
  this.updateDataSet();
};

Model.prototype.updateObject = function( object, config ) {
  var axisLabels = getAxisLabels( object, config );
  
  this.object = object;
  this.allParams = object.params;
  this.data = object.frames;
  this.isModel = object.isModel;
  this.axisX = axisLabels.axisX;
  this.axisY = axisLabels.axisY;
  this.start = object.start || 0;
  this.end = object.end || object.frames.length;
  
  this.updateDataSet();
};

Model.prototype.getStart = function() {
  if ( this.isModel ) {
    return this.start;
  } else {
    return this.start + Math.max( SHIFT_INDEX[ this.axisX ], SHIFT_INDEX[ this.axisY ] );
  }
};

Model.prototype.changeAxis = function( axis, variable ) {
  this[ axis ] = variable;

  this.updateDataSet();
};

Model.prototype.updateDataSet = function() {
  this.dataSet = [];

  for ( var i = 0; i < this.data.length; i++ ) {
    if ( this.data[ i ] ) {
      var point = getPointObject( this.data[ i ][ this.axisX ], this.data[ i ][ this.axisY ] );
      
      if ( point ) {
        point.index = i;

        this.dataSet.push( point );
      }
    }
  }
};

Model.prototype.getHighlightIndex = function( frame ) {
  // Model point always start with first frame, predefine points - from start frame
  var index = this.object.isModel ? frame : frame - this.start;
  var position = NaN;
  
  for ( var i = this.dataSet.length; i--; ) {
    if ( this.dataSet[ i ].index === index ) {
      position = i;
      break;
    }
  }
  
  return position;
};

Model.prototype.getVideoFrame = function( index ) {
  if ( this.object.isModel ) {
    return this.dataSet[ index ] ? this.dataSet[ index ].index : NaN;
  } else {
    return this.dataSet[ index ] ? this.dataSet[ index ].index + this.start : NaN;
  }
};

module.exports = Model;