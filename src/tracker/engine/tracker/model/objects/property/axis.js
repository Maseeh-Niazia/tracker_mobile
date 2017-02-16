'use strict';

// Private methods
var iniParams = function( params ) {
  for ( var i = 0, l = params.length; i < l; i++ ) {
    this.params.push( {
      name: params[ i ],
      used: 0
    } );
  }
};

var iniParamsAxis = function( paramsAxis ) {
  for ( var i = 0, l = paramsAxis.length; i < l; i++ ) {
    this.paramsAxis.push( {
      axisX: paramsAxis[ i ][ 0 ],
      axisY: paramsAxis[ i ][ 1 ],
      used: 0
    } );
  }
};

var byUsedValue = function( a, b ) {
  return a.used - b.used;
};

var getAxisY = function() {
  var params = this.params.slice( 1 ).sort( byUsedValue ); // All except first - 't'
  
  params[ 0 ].used += 1;
  
  return params[ 0 ].name;
};

// Color constructor
var AxisIndex = function( params, paramsAxis ) {
  this.params = [];
  this.paramsAxis = [];
  
  iniParams.call( this, params );
  iniParamsAxis.call( this, paramsAxis );
};

AxisIndex.prototype.getAxisLabels = function() {
  var defaultAxisX = 't';
  
  if ( this.paramsAxis.length > 0 ) {
    var params = this.paramsAxis.slice( 0 ).sort( byUsedValue );
    if ( params[ 0 ].used === 0 ) {
      params[ 0 ].used += 1;
      
      return params[ 0 ];
    } else {
      return {
        axisX: defaultAxisX,
        axisY: getAxisY.call( this )
      };
    }
  } else {
    return {
      axisX: defaultAxisX,
      axisY: getAxisY.call( this )
    };
  }
};

module.exports = AxisIndex;