'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var RESIZE = 'resize';
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Data tool Fit Builder
var FitBuilder = require( '../../data-tool-fit-builder/index' );

// Data tool Fit Curve
var fitCurve = require( '../../data-tool-fit-curve/index' );
var drawCurve = require( '../../data-tool-fit-curve/draw-curve' );

// Data tool Image to clipboard
var graphToImage = require( './graph-to-image' );

// Dependency controllers
var bindShowSlope = require( './slope' );
var bindShowCoords = require( '../../section-graph/controllers/coords.js' );

// Private methods
var initChooseFitVariants = function( model, view ) {
  for ( var i = view.fitVariantsBttns.length; i--; ) {
    bindFitVariantEvent( view.fitVariantsBttns[ i ], model, view )
  }
};

var bindFitVariantEvent = function( bttn, model, view ) {
  bttn.addEventListener( MOUSEDOWN, function( evt ) {
    // Prevent close dropdown menu before choose fit variant
    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  bttn.addEventListener( MOUSEUP, function( evt ) {
    model.setCurrentFit( bttn.name );
    view.updateFitView( model );
    view.hideFitVariants();

    if ( model.getCurrentFit().isUserDefined ) {
      drawCurveController( model, view );
    } else {
      fitCurveController( model, view );
    }

    evt.preventDefault();
    evt.stopPropagation();
  }, false );
};

var updateViewChart = function( view, model ) {
  view.chartUpdate( model );
};

var getWindowResizedListener = function( view, model ) {
  // Special window resized event, to prevent often calls
  var lastTimeResize = Date.now();
  var maxWaitTime = 1500;
  var int = 0;

  var windowResized = function( evt ) {
    graphToImage( view, model );
  };

  return function( evt ) {
    if ( Date.now() - lastTimeResize < maxWaitTime ) {
      clearTimeout( int );
    }
    lastTimeResize = Date.now();
    int = setTimeout( windowResized, 500 );
  };
};

var fitCurveController = function( model, view ) {
  var fitData = model.getFitData();
  var fit = model.getCurrentFit();

  var result = fitCurve( fit, model.x, fitData.x, fitData.y);
  model.graph.fitCurve = result.data;

  view.setRMSDev( result.rmsDev );
  view.reDrawChartWithFitCurve( model.graph );
  view.fitParameters.update( model.getCurrentFit().parameters );

  updateCommonControllers( model, view, true );
};

var drawCurveController = function( model, view ) {
  var fitData = model.getFitData();
  var fit = model.getCurrentFit();

  if ( !fit.hasExpression() ) {
    return;
  }

  var result = drawCurve( fit, model.x, fitData.x, fitData.y);
  model.graph.fitCurve = result.data;

  view.setRMSDev( result.rmsDev );
  view.reDrawChartWithFitCurve( model.graph );
  view.fitParameters.update( model.getCurrentFit().parameters );

  updateCommonControllers( model, view, true );
};

var updateCommonControllers = function( model, view, doNotUpdateView ) {
  if ( !doNotUpdateView ) {
    updateViewChart( view, model );
  }

  view.createSlopeLine();

  bindShowCoords( { axisX: model.x, axisY: model.y }, view, true );
  bindShowSlope( model, view );
};

// Controller constructor
var Controller = function( model, view ) {
  var onWindowResized = getWindowResizedListener( view, model );

  var onWindowResize = function( evt ) {
    updateCommonControllers( model, view );
  };

  var hidePopups = function( evt ) {
    view.hideFitVariants();
  };

  // Initiate toggle button Slope
  view.bttnsToggle.slope.node.addEventListener( MOUSEUP, function( evt ) {
    model.isSlopeVisible = view.bttnsToggle.slope.toggle();

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Initiate toggle button Feat
  view.bttnsToggle.fit.node.addEventListener( MOUSEUP, function( evt ) {
    view.togglePanelFeat( model );
    
    updateCommonControllers( model, view );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Show Fit Builder popup
  view.bttnFitBuilder.addEventListener( MOUSEUP, function( evt ) {
    new FitBuilder( view.holder, model );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Build fit curve data
  view.bttnFitCurve.addEventListener( MOUSEUP, function( evt ) {
    fitCurveController( model, view );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Close button behavior
  view.bttnClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();

    events.fire( 'DATA_TOOL:closed' );
    events.clear( 'DATA_TOOL:user-fit-list:add' );
    events.clear( 'DATA_TOOL:user-fit-list:del' );
    events.clear( 'DATA_TOOL:user-fit-list:current-changed' );
    events.clear( 'DATA_TOOL:user-fit:name-updated' );
    events.clear( 'DATA_TOOL:user-fit:expression-updated' );
    events.clear( 'DATA_TOOL:user-fit:parameters-updated' );

    window.removeEventListener( MOUSEDOWN, hidePopups );
    window.removeEventListener( RESIZE, onWindowResize );
    window.removeEventListener( RESIZE, onWindowResized );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // Initiate fit variants menu
  view.fitNameValue.parentNode.addEventListener( MOUSEUP, function( evt ) {
    view.showFitVariants();

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  window.addEventListener( MOUSEDOWN, hidePopups, false );

  view.bttnGetGraphAsImage.addEventListener( MOUSEDOWN, function ( evt ) {
    graphToImage( view, model );
  }, false );

  // Update common user fit list
  events.on( 'DATA_TOOL:user-fit-list:add', function( fit ) {
    var bttn = view.addUserFitVariant( fit );
    bindFitVariantEvent( bttn, model, view );
    view.updateFitView( model );
  } );

  events.on( 'DATA_TOOL:user-fit-list:del', function( fit ) {
    view.delUserFitVariant( fit );
  } );

  events.on( 'DATA_TOOL:user-fit-list:current-changed', function() {
    view.updateFitView( model );

    drawCurveController( model, view );
  } );

  events.on( 'DATA_TOOL:user-fit:name-updated', function( ops ) {
    view.updateFitName( model, ops.oldName, ops.newName );
  } );

  events.on( 'DATA_TOOL:user-fit:expression-updated', function() {
    drawCurveController( model, view );
    view.setFitEquationValue( model );
  } );

  events.on( 'DATA_TOOL:user-fit:parameters-updated', function() {
    drawCurveController( model, view );
    view.fitParameters.update( model.getCurrentFit().parameters );
  } );

  // Show data tool
  view.show( model );

  // Initiate fit variant buttons
  initChooseFitVariants( model, view );

  // Inititate graph to image
  graphToImage( view, model );

  // Initiate coords show
  bindShowCoords( { axisX: model.x, axisY: model.y }, view, true );

  // Initiate show slope
  bindShowSlope( model, view );

  // Resize graph events
  window.addEventListener( RESIZE, onWindowResize, false );
  window.addEventListener( RESIZE, onWindowResized, false );
};

module.exports = Controller;
