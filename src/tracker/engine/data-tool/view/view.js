'use strict';
// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );
var getVariable = require( '../../../utils/variable' );
var Graph = require( '../../math-graph/index' );
var TableParameters = require( './tables/parameters' );
var ToggleButton = require( './bttn-toggle' );
var TableData = require( './tables/data' );

// Graph config
var graphConfig = {
  axisX : {
    type : Graph.AutoScaleAxis
  }
};

// Private methods
var buildLabel = function( str ) {
  var label = str.split( '_' );
  
  if ( label.length === 2 ) {
    return label[ 0 ] + '<sub>' + label[ 1 ] + '</sub>';
  } else {
    return str;
  }
};

var getHeaderToggleButtons = function() {
  var bttns = this.node.querySelectorAll( '.dt-panel-header .bttn-toggle' );
  for ( var bttn, i = bttns.length; i--; ) {
    bttn = new ToggleButton( bttns[ i ] );
    this.bttnsToggle[ bttn.name ] = bttn;
  }
}

var updateGraphLabels = function( model ) {
  var axisX = buildLabel( model.x );
  var axisY = buildLabel( model.y );
  var title = model.name + ' (' + axisX + ', ' + axisY + ')';
  
  this.graphTitle.innerHTML = title;
  this.graphAxisX.innerHTML = axisX;
  this.graphAxisY.innerHTML = axisY;
};

var updateFitVariants = function( model ) {
  for ( var i = 0, l = model.fit.length; i < l; i++ ) {
    createFitVariant.call( this, model.fit[ i ] );
  }
};

var createFitVariant = function( fit ) {
  var bttn = document.createElement( 'button' );
  bttn.name = fit.name;
  bttn.textContent = bttn.name;
  
  this.fitVariantsBttns.push( bttn );
  this.fitVariantsMenu.appendChild( bttn );
  
  return bttn;
};

var deleteFitVariant = function( fit ) {
  for( var bttn, i = this.fitVariantsBttns.length; i--; ) {
    if ( this.fitVariantsBttns[ i ].name === fit.name ) {
      bttn = this.fitVariantsBttns[ i ];
      this.fitVariantsBttns.splice( i, 1 );
      this.fitVariantsMenu.removeChild( bttn );
      break;
    }
  }
};

var findBttnWithName = function( name ) {
  var bttns = this.fitVariantsBttns, bttn, i;
  
  for ( i = bttns.length; i--; ) {
    if ( bttns[ i ].name === name ) {
      bttn = bttns[ i ];
      break;
    }
  } 
  
  return bttn;
};

// View class
var View = function( holder, model ) {
  this.node = template.querySelector( '.data-tool' ).cloneNode( true );
  this.holder = holder;
  this.isVisible = false;
  
  this.bttnClose = this.node.querySelector( '.dt-panel-header .bttn-data-tool-close' );
  this.bttnFitBuilder = this.node.querySelector( '.dt-panel-feat [name="fit-builder"]' );
  
  this.bttnFitCurve = this.node.querySelector( '.dt-panel-feat [name="fit-auto"]' );
  this.fitNameValue = this.node.querySelector( '.dt-panel-feat .fit-name-value > span' );
  this.fitEquationValue = this.node.querySelector( '.dt-panel-feat .fit-equation-value > span' );
  this.fitParameters = new TableParameters( this.node.querySelector( '.dt-panel-feat .dt-feat-parametrs' ) );
  this.fitVariantsMenu = this.node.querySelector( '.dt-panel-feat .fit-name-value > .dt-panel-row-menu' );
  this.fitVariantsBttns = [];
  
  this.slopeLine = document.createElement( 'div' );
  
  this.graphTitle = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .title' );
  this.graphSlope = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .slope' );
  this.graphCoords = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .coords' );
  this.graphAxisX = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .axis-x > span' );
  this.graphAxisY = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .axis-y > span' );
  
  this.rmsDev = this.node.querySelector( '.dt-panel-feat .fit-rms-value > span' );
  
  this.graphContainer = this.node.querySelector( '.dt-panel-l > .dt-panel-graph > .dt-panel-graph-chart' );
  
  this.bttnGetGraphAsImage = this.node.querySelector( '.dt-panel-header > h5 > a[name="get-graph-as-image"]' );
    
  this.rowData = new TableData( this.node.querySelector( '.dt-panel-data > table' ) );
  
  this.panels = {
    feat: this.node.querySelector( '.dt-panel-feat' )
  };
  
  this.chart = null;
  
  this.bttnsToggle = {};
  
  this.hideFitVariants();
  
  this.slopeHide();
  this.coordsHide();
  
  getHeaderToggleButtons.call( this );
  updateGraphLabels.call( this, model );
  updateFitVariants.call( this, model );
};

View.prototype.coordsShow = function() {
  this.graphCoords.style.display = '';
};

View.prototype.coordsHide = function() {
  this.graphCoords.style.display = 'none';
};

View.prototype.coordsUpdate = function( label, p ) {
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
  
  p = this.chart.getCoords( p );
  p.x = p.x.toFixed( 2 );
  p.y = p.y.toFixed( 2 );
	
  this.graphCoords.innerHTML = labelXstr + ': ' + p.x + ' ' + labelYstr + ': ' + p.y;
};

View.prototype.slopeShow = function() {
  this.slopeLine.style.display = '';
  this.graphSlope.style.display = '';
};

View.prototype.slopeHide = function() {
  this.slopeLine.style.display = 'none';
  this.graphSlope.style.display = 'none';
};

View.prototype.slopeUpdate = function( model, p ) {
  var axisX = this.chart.axisX;
  var axisY = this.chart.axisY;
  var coords = this.chart.getCoords( p );
  var index = model.getRangeIndex( coords.x );
  
  if ( isNaN( index ) ) {
    this.slopeHide();
    
    return false;
  }
  
  var line = model.getSlopeLineCoords( index );  
  
  var p1 = this.chart.getPaperCoords( { x : line.x1, y: line.y1 } );
  var p2 = this.chart.getPaperCoords( { x : line.x2, y: line.y2 } );
  
  this.slopeLine.setAttribute( 'x1', p1.x + 3 );
  this.slopeLine.setAttribute( 'y1', p1.y );
  this.slopeLine.setAttribute( 'x2', p2.x + 3 );
  this.slopeLine.setAttribute( 'y2', p2.y );
  
  this.graphSlope.textContent = 'slope: ' + line.slope;
  
  this.slopeShow();
};

View.prototype.chartUpdate = function( model, drawAgain ) {
  if ( drawAgain ) {
    this.chart.update( { series: [ model.graph.curve ] } );
  } else {
    this.chart.update();
  }
  this.chart.grid_paper = this.chart.svg._node.querySelector( '.ct-grids' );
};

View.prototype.show = function( model ) {
  if ( !this.isVisible ) {
    this.isVisible = true;
    this.rowData.update( model.data );
    this.holder.appendChild( this.node );
    
    this.chart = new Graph.Line( this.graphContainer, { series : [ model.graph.curve ] }, graphConfig );
    this.chart.grid_paper = this.chart.svg._node.querySelector( '.ct-grids' );
    
    this.createSlopeLine();  
  }
};

View.prototype.createSlopeLine = function() {
  var svg = this.chart.svg._node;
  
  if ( this.slopeLine && this.slopeLine.parentNode ) {
    this.slopeLine.parentNode.removeChild( this.slopeLine );
  }

  this.slopeLine = svg.querySelector( 'line' ).cloneNode( true );
  this.slopeLine.setAttribute( 'class', 'ct-slope-line' );
  this.slopeLine.style.display = 'none';

  svg.appendChild( this.slopeLine );
};

View.prototype.hide = function() {
  if ( this.isVisible ) {
    this.isVisible = false;
    this.holder.removeChild( this.node );
  }
};

View.prototype.togglePanelFeat = function( model ) {
  this.bttnsToggle.fit.toggle();
  
  if ( this.bttnsToggle.fit.isSelected ) {
    this.updateFitView( model );
    this.node.classList.add( 'panel-feat' );
  } else {
    this.chartUpdate( model, true );
    this.node.classList.remove( 'panel-feat' );
  }
};

View.prototype.updateFitView = function( model ) {
  var fit = model.getCurrentFit();
  var params = fit.parameters;
  
  this.fitNameValue.textContent = fit.name;
  this.fitEquationValue.innerHTML = fit.equation;
  this.fitParameters.update( params );
};

View.prototype.showFitVariants = function() {
  this.fitVariantsMenu.style.display = '';
};

View.prototype.hideFitVariants = function() {
  this.fitVariantsMenu.style.display = 'none';
};

View.prototype.addUserFitVariant = function( fit ) {
  return createFitVariant.call( this, fit );
};

View.prototype.delUserFitVariant = function( fit ) {
  deleteFitVariant.call( this, fit );
};

View.prototype.updateFitName = function( model, oldName, newName ) {
  var fit = model.getCurrentFit();
  
  if ( fit.name === newName ) {
    this.fitNameValue.textContent = fit.name;
  }
  
  var bttn = findBttnWithName.call( this, oldName );
  
  if ( bttn ) {
    bttn.name = newName;
    bttn.textContent = newName;
  }
};

View.prototype.reDrawChartWithFitCurve = function( graph ) {
  this.chart.update( { series: [ graph.curve, graph.fitCurve ] } );
  this.chart.grid_paper = this.chart.svg._node.querySelector( '.ct-grids' );
};

View.prototype.setRMSDev = function( value ) {
  value = ( value === 0 ) ? '0' : value.toExponential( 3 ).toString();
  this.rmsDev.textContent = value.replace( /e/, 'E' );
};

View.prototype.setFitEquationValue = function( model ) {
  this.fitEquationValue.innerHTML = model.getCurrentFit().equation;
};

module.exports = View;