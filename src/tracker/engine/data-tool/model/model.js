'use strict';

// Fit models
var Line = require( './fit/line' );
var Cubic = require( './fit/cubic' );
var Parabola = require( './fit/parabola' );
var Sinusoid = require( './fit/sinusoid' );
var Exponential = require( './fit/exponential' );
var UserDefined = require( './fit/user-defined' );

// Singleton library of user-defined curves
var userDefinedFit = [];

// Parser utility
var Parser = require( '../../math-parser/index' );

// Private methods
var buildRowData = function( model ) {
  var frames = model.object.frames, i, l, x, y;
  
  for ( i = 0, l = frames.length; i < l; i++ ) {
    if ( !frames[ i ] ) {
      continue;
    }
    
    x = frames[ i ][ this.x ];
    y = frames[ i ][ this.y ];
    
    if ( !isNaN( x ) && !isNaN( y ) ) {
      this.data.push( { x: x.toFixed( 2 ), y: y.toFixed( 2 ) } );
      this.graph.curve.push( { x: Number( x ), y: Number( y ) } );
    }
  }
};

var buildRangeData = function() {
  var prev, next, curr, i, l, r;
  var curve = this.graph.curve;
  var range = this.graph.range;
  
  for ( i = 1, l = curve.length - 1; i < l; i++ ) {
    prev = curve[ i - 1 ].x;
    curr = curve[ i ].x;
    next = curve[ i + 1 ].x;
    r = [ curr - ( curr - prev ) / 2, curr + ( next - curr ) / 2 ].sort();  


    range.push( {
      min: r[ 0 ],
      max: r[ 1 ],
      index: i
    } );
  }
};

var getFitIndexByName = function( fitList, name ) {
  for ( var i = fitList.length; i--; ) {
    if ( fitList[ i ].name === name ) {
      return i;
    }
  }
  
  return NaN; 
};

var getFreeFitUserDefName = function() {
  var names = this.fit.map( function( fit ) {
    return fit.name;
  } );
  
  var num = 1;
  
  while( names.indexOf( 'Fit_' + num ) > -1 ) {
    num += 1;
  }
  
  return 'Fit_' + num;
};

var isNameFitExistsExcept = function( fit, name ) {
  var exist = false, i;
  
  for ( i = this.fit.length; i--; ) {
    if ( this.fit[ i ] !== fit && this.fit[ i ].name === name ) {
      exist = true;
      break;
    }
  }
  
  return exist;
};

var isVariablesExisted = function( vars ) {
  var fit = this.getCurrentFit();
  var existed = true, i;
  
  var list = fit.parameters.map( function( p ) {
    return p.name;
  } );
  
  list.push( this.x );
  
  for ( i = vars.length; i--; ) {
    if ( list.indexOf( vars[ i ] ) === -1 ) {
      existed = false;
      break;
    }
  }
  
  return existed;
};

var addUserDefineFit = function() {
  for ( var i = 0, l = userDefinedFit.length; i < l; i++ ) {
    this.fit.push( userDefinedFit[ i ].update( this.x ) );
  }
};

// Main class
var Model = function( model, fit ) {
  this.name = model.object.name;
  
  var x = model.axisX;
  var y = model.axisY;
  
  this.x = x;
  this.y = y;
  
  this.fit = [
    new Line( x, y ),
    new Parabola( x, y ),
    new Exponential( x, y )
  ];
  
  this.data = [];
  this.data.xLabel = x;
  this.data.yLabel = y;
  
  this.isSlopeVisible = false;
  
  this.graph = {
    range: [],
    curve: [],
    fitCurve: []
  };
  
  this.currentFit = 0;
  this.currentFitUser = NaN;
  
  addUserDefineFit.call( this );
  buildRowData.call( this, model );
  buildRangeData.call( this );
};

Model.prototype.getRangeIndex = function( x ) {
  var range = this.graph.range;
  var index, r, i;
  
  for ( i = range.length; i--; ) {
    r = range[ i ];
    
    if ( x >= r.min && x < r.max ) {
      return r.index;
    }
  }
  
  return NaN;
};

Model.prototype.getSlopeLineCoords = function( n ) {
  var curve = this.graph.curve;
  var prev = curve[ n - 1 ];
  var curr = curve[ n ];
  var next = curve[ n + 1 ];
  var dy = next.y - prev.y;
  var dx = next.x - prev.x;
  var x1, x2, y1, y2, slope = NaN;
  
  if ( dx === 0 ) {
    x2 = x1 = curr.x;
    y1 = prev.y;
    y2 = next.y;
    slope = '∞';
  } else
  if ( dy === 0 ) {
    y2 = y1 = curr.y;
    x1 = prev.x;
    x2 = next.x;
    slope = 0;
  } else {
    slope = dy / dx;
    x1 = prev.x;
    x2 = next.x;
    y1 = curr.y + slope * ( prev.x - curr.x );
    y2 = curr.y + slope * ( next.x - curr.x );
  }
  
  return {
    curr: curr,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    slope: slope === '∞' ? slope : slope.toPrecision( 3 )
  };
};

Model.prototype.calcUserFit = function() {
  var total = 0, i;
  
  for ( i = this.fit.length; i--; ) {
    total += this.fit[ i ].isUserDefined;
  }
  
  return total;
};

Model.prototype.getCurrentFit = function() {
  return this.fit[ this.currentFit ];
};

Model.prototype.setCurrentFit = function( name ) {
  var num = getFitIndexByName( this.fit, name );
  
  if ( !isNaN( num ) ) {
    this.currentFit = num;
  }
};

Model.prototype.createUserDefinedFit = function() {
  var name = getFreeFitUserDefName.call( this );
  var fit = new UserDefined( this.x, this.y, name );
  
  this.fit.push( fit );
  userDefinedFit.push( fit );
  
  this.currentFit = this.fit.length - 1;
  this.currentFitUser = this.fit.length - 1;
};

Model.prototype.getCurrentUserFit = function() {
  return this.fit[ this.currentFitUser ];
};

Model.prototype.delCurrentUserFit = function() {
  var fit = this.getCurrentUserFit();
  var num = this.fit.indexOf( fit );
  
  if ( num > -1 ) {
    this.fit.splice( num, 1 );
  }
  
  if ( this.currentFit >= this.fit.length ) {
    this.currentFit = this.fit.length - 1;
  }
  
  if ( this.calcUserFit() > 0 ) {
    if ( !this.getCurrentUserFit() ) {
      this.currentFitUser = this.currentFit;
    }
  } else {
    this.currentFitUser = NaN;
  }
  
  return fit;
};

Model.prototype.setCurrentUserFit = function( name ) {
  var num = getFitIndexByName( this.fit, name );
  
  if ( !isNaN( num ) ) {
    this.currentFit = num;
    this.currentFitUser = num;
  }
};

Model.prototype.isFitNameValid = function( fit, name ) {
  var isNameExisted = isNameFitExistsExcept.call( this, fit, name );
  var isTextValid = (/^[a-zA-Z]([a-zA-Z0-9_]*)?$/).test( name );
  return isTextValid && !isNameExisted;
};

Model.prototype.isFitExpressionValid = function( value ) {
  value = value.replace( /,/g, '.' );
  var isValid = false;
  
  try {
    var exp = Parser.parse( value );
    var vars = exp.variables();
    var allVeriablesExisted = isVariablesExisted.call( this, vars );
    
    return !!exp && allVeriablesExisted;
  } catch( err ) {
    console.log( err );
    return isValid;
  }
};

Model.prototype.getFitData = function() {
  var l = this.graph.curve.length;
  var data_x = [], data_y = [], i;
  
  for ( i = 0; i < l; i++ ) {
    data_x.push( this.graph.curve[ i ].x );
    data_y.push( this.graph.curve[ i ].y );
  }
  
  return { x: data_x, y: data_y };
};

module.exports = Model;