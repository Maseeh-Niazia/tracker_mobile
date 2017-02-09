'use strict';

// Dependency utils
var html = require( '../../../utils/html' );
var body = document.body || document.querySelector( 'body' );
var getVariable = require( '../../../utils/variable' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );
var Graph = require( '../../math-graph/index' );
var ButtonOption = require( './controls/button-option-axis-variable' );

// Graph config
var getTemplateConfig = function() {
  return {
    axisX : {
      type : Graph.AutoScaleAxis,
      scaleMinSpace : 40
    },
    axisY : {

    }
  };
};

// Constants
var HIGHLIGHT_CLASS = 'highlight';

// Private methods
var getRealUsedParams = function( model ) {
  var params = [], map = {}, p, i, j;
  var l = model.allParams.length;

  for ( i = 0; i < l; i++ ) {
    p = model.allParams[ i ];

    for ( j = model.data.length; j--; ) {
      if ( model.data[ j ] && model.data[ j ][ p ] ) {
        map[ p ] = true;
      }
    }
  }

  for ( i = 0; i < l; i++ ) {
    p = model.allParams[ i ];

    if ( map[ p ] ) {
      params.push( p );
    }
  }

  return params;
};

var initBttnVariableObjects = function( model, holder, axis ) {
  // Initiate current object button
  var bttnModel = model[ axis ];
  var bttnView = holder.querySelector( '.data-view-graph .bttn-axis-current' );
  this[ axis ].bttnCurrent = new ButtonOption( bttnView, bttnModel );

  // Get template of buttons
  var bttnTemplate = this[ axis ].selectMenu.querySelector( '.bttn-axis-select' );

  bttnTemplate = bttnTemplate || this.bttnAxisChangeTemplate;
  removeChildren( this[ axis ].selectMenu );

  // Initiate full list of objects
  var realUsedParams = getRealUsedParams( model );

  for ( var i = 0, l = realUsedParams.length; i < l; i++ ) {
    bttnModel = realUsedParams[ i ];
    bttnView = bttnTemplate.cloneNode( true );
    this[ axis ].selectMenu.appendChild( bttnView );
    this[ axis ].bttnsOption.push( new ButtonOption( bttnView, bttnModel ) );
  }

  // Save template link
  this.bttnAxisChangeTemplate = bttnTemplate;
};

var getStringLabel = function( label ) {
  var match = label.match( /^(\w+)_(\w+)$/ );

  if ( match ) {
    label = match[ 1 ] + '<sub>' + match[ 2 ] + '</sub>';
  }

  return label || '';
};

var setHeader = function( model ) {
  this.header.innerHTML = model.object.name + ' (' + getStringLabel( model.axisX ) + ', ' + getStringLabel( model.axisY ) + ')';
};

var setGraphColor = function( color ) {
  this.chart.line.style.stroke = color.value;
  this.chart.line.style.opacity = color.opacity;

  for ( var i = this.chart.points.length; i--; ) {
    this.chart.points[ i ].style.stroke = color.value;
    this.chart.points[ i ].style.opacity = color.opacity;
  }
};

var setupSelectBox = function( holder, model, axis ) {
  this[ axis ] = {};
  this[ axis ].selectBox = holder.querySelector( '.menu-axis-current' );
  this[ axis ].selectMenu = holder.querySelector( '.menu-axis-current > .select-axis' );
  this[ axis ].bttnCurrent = null;
  this[ axis ].bttnsOption = [];

  initBttnVariableObjects.call( this, model, holder, axis );
};

var setSelectMenuTop = function( selectMenu ) {
  selectMenu.style.display = '';
  selectMenu.style.top = '';

  if ( this.node.scrollHeight > this.node.clientHeight ) {
    selectMenu.style.top = -selectMenu.clientHeight + 'px';
  }
};

var removeChildren = function( node ) {
  while ( node.hasChildNodes() ) {
    node.removeChild( node.lastChild );
  }
};

var getDefaultDataSet = function() {
  return [ {
    x: 0,
    y: 0
  } ];
};

var buildSeriesForGraph = function( model ) {
  var series = model.dataSet.length > 0 ? model.dataSet : getDefaultDataSet();

  return { series : [ series ] };
};

var checkRealPointExistance = function( model ) {
  var display = model.dataSet.length === 0 ? 'none' : '';

  for ( var i = this.chart.points.length; i--; ) {
    this.chart.points[ i ].style.display = display;
  }
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.header = this.node.querySelector( '.dvg-header' );
  this.axisXTitle = this.node.querySelector( '.dvg-axisX-title' );
  this.axisYTitle = this.node.querySelector( '.dvg-axisY-title' );
  this.holder = holder;

  this.AXIS = {
    axisX : 'axisX',
    axisY : 'axisY'
  };

  // Container for graph
  this.container = this.node.querySelector( '.dvg-chart' );

  // Container for coords
  this.coords = this.node.querySelector( '.dvg-coords' );

  // Initiate view
  this.coordsHide();

  setHeader.call( this, model );

  this.holder.appendChild( this.node );
  this.updateSelectBoxes( model );
};

View.prototype.createChart = function( model ) {
  var config = getTemplateConfig();
  var by = model.object.bounds[ model.axisY ];

  if ( by ) {
    config.axisY.low = by.min;
    config.axisY.high = by.max;
  }

  this.chart = new Graph.Line( this.container, buildSeriesForGraph( model ), config );
  this.chart.grid_paper = this.chart.svg._node.querySelector( '.ct-grids' );
  this.chart.points = this.chart.svg._node.querySelectorAll( '.ct-point' );
  this.chart.line = this.chart.svg._node.querySelector( '.ct-line' );

  setGraphColor.call( this, model.object.color );
  checkRealPointExistance.call( this, model );
  setHeader.call( this, model );
};

View.prototype.coordsShow = function() {
  this.coords.style.display = '';
};

View.prototype.coordsHide = function() {
  this.coords.style.display = 'none';
};

View.prototype.coordsUpdate = function( label, p ) {
  this.coordsUpdateAsIs( label, this.chart.getCoords( p ) );
};

View.prototype.coordsUpdateAsIs = function( label, p ) {
  var labelX = getVariable( label.x );
  var labelY = getVariable( label.y );
  var labelXstr = labelX.label;
  var labelYstr = labelY.label;

  if ( labelX.type ) {
    labelXstr += '<sub>' + labelX.type + '</sub>';
  }
  if ( labelY.type ) {
    labelYstr += '<sub>' + labelY.type + '</sub>';
  }

  p.x = p.x.toFixed( 2 );
  p.y = p.y.toFixed( 2 );

  this.coords.innerHTML = labelXstr + ': ' + p.x + ' ' + labelYstr + ': ' + p.y;
};

View.prototype.updateSelectBoxes = function( model ) {
  // Initiate select buttons obtions
  setupSelectBox.call( this, this.axisXTitle, model, this.AXIS.axisX );
  setupSelectBox.call( this, this.axisYTitle, model, this.AXIS.axisY );

  // Initiate first parameters
  this.setCurrentVariable( model.axisX, this.AXIS.axisX );
  this.setCurrentVariable( model.axisY, this.AXIS.axisY );

  // Put axisX select menu above select button if it doesn't fit on panel
  setSelectMenuTop.call( this, this[ this.AXIS.axisX ].selectMenu );

  this.hideVariableOptions( this.AXIS.axisX );
  this.hideVariableOptions( this.AXIS.axisY );
};

View.prototype.chartUpdate = function( model, newDataSet  ) {
  if ( newDataSet ) {
    this.chart.update( buildSeriesForGraph( model ) );
  } else {
    this.chart.update();
  }

  // Line chart was fully re-rendered
  this.chart.grid_paper = this.chart.svg._node.querySelector( '.ct-grids' );
  this.chart.points = this.chart.svg._node.querySelectorAll( '.ct-point' );
  this.chart.line = this.chart.svg._node.querySelector( '.ct-line' );

  setGraphColor.call( this, model.object.color );
  checkRealPointExistance.call( this, model );
  setHeader.call( this, model );
};

View.prototype.highlightPoint = function( index ) {
  for ( var i = this.chart.points.length; i--; ) {
    var point = this.chart.points[ i ];

    if ( i === index ) {
      point.classList.add( HIGHLIGHT_CLASS );
    }
    else {
      point.classList.remove( HIGHLIGHT_CLASS );
    }
  }
};

View.prototype.showVariableOptions = function( axis ) {
  this[ axis ].selectMenu.style.display = '';
};

View.prototype.hideVariableOptions = function( axis ) {
  this[ axis ].selectMenu.style.display = 'none';
};

View.prototype.updateAxisButton = function( model ) {
  var realUsedParams = getRealUsedParams( model );
  var axisX = this[ this.AXIS.axisX ];
  var axisY = this[ this.AXIS.axisY ];
  var bttnModel, bttnView;

  removeChildren( axisX.selectMenu );
  removeChildren( axisY.selectMenu );

  axisX.bttnsOption.length = 0;
  axisY.bttnsOption.length = 0;

  for ( var i = 0, l = realUsedParams.length; i < l; i++ ) {
    bttnModel = realUsedParams[ i ];

    bttnView = this.bttnAxisChangeTemplate.cloneNode( true );
    axisX.selectMenu.appendChild( bttnView );
    axisX.bttnsOption.push( new ButtonOption( bttnView, bttnModel ) );

    bttnView = this.bttnAxisChangeTemplate.cloneNode( true );
    axisY.selectMenu.appendChild( bttnView );
    axisY.bttnsOption.push( new ButtonOption( bttnView, bttnModel ) );
  }
};

View.prototype.setCurrentVariable = function( variable, axis ) {
  if ( this[ axis ].bttnCurrent.name === variable ) {
    return false;
  }

  this[ axis ].bttnCurrent.update( variable );

  return this[ axis ].bttnCurrent.name;
};

View.prototype.hideVariableOptions = function( axis ) {
  this[ axis ].selectMenu.style.display = 'none';
};

View.prototype.updatePointColor = function( color ) {
  for ( var i = this.chart.points.length; i--; ) {
    this.chart.points[ i ].style.stroke = color;
  }

  this.chart.points[ 0 ].parentNode.firstChild.style.stroke = color;
};

module.exports = View;
