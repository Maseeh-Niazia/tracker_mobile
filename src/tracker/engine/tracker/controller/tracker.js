'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var ORIENTATION = require( '../model/orientation' );

// Dependency modules
var DataTool = require( '../../data-tool/index' );
var DataGraph = require( '../../section-graph/index' );
var DataTable = require( '../../section-table/index' );
var ColorPicker = require( '../../color-picker/index' );

// Model builder dialog
var ModelBuilder = require( '../../model-builder/index' );

// Help dialog
var Help = require( '../../help/index' );

// Create Center of Mass dialog
var CenterOfMass = require( '../../center-of-mass/index' );

// Private methods
var buildUpdateLayout = function( config, model, view, video ) {
  return function() {
    view.updateLayout( config, model, video, {
      width       : window.innerWidth,
      height      : window.innerHeight,
      orientation : Math.abs( Number( window.orientation ) ) === 90 ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL
    } );

    events.fire( 'VIDEO_SIZE_UPDATED' );
  }
};

var updateAllFramesObject = function( panels, object, config ) {
  // Set event about new object
  events.fire( 'NEW_OBJECT_CREATED', object );
  events.fire( 'CURRENT_TRACK_CHANGE:force', object.name );
  
  // Update all panels
  for ( var i = panels.length; i--; ) {
    events.fire( 'NEW_OBJECT_CREATED:show:' + panels[ i ].view.name, {
      object: object
    } );
  }
};

// Controller constructor
var Controller = function( config, model, view, video, alert) {
  // Link to opened model builder
  var centerOfMass = null;
  var modelBuilder = null;
  var pointBuilder = null;
  var dataTool = null;
  var help = null;

  // Show point builder method
  var showPointBuilder = function( object ) {
    if ( pointBuilder ) {
      pointBuilder.hide();
    }

    pointBuilder = new ModelBuilder( view.node, object );
  };

  // Initiate component view
  view.draw();

  // Show / hide alert popup window
  events.on( 'HELP:show', function() {
    if ( help ) {
      return false;
    }
    help = new Help( view.node );
  } );

  events.on( 'HELP:closed', function() {
    if ( help ) {
      help = null;
    }
  }, false );

  // Show / hide alert popup window
  events.on( 'ALERT:show', function( ops ) {
    alert.view.show( ops );
  } );

  // Change frame data view
  events.on( 'FRAME_INIT_DATA_VIEW:graph', function( ops ) {
    var object = model.objects.find( ops.object );

    new DataGraph( ops.holder, ops.frame, object, ops.data );
  } );

  events.on( 'FRAME_INIT_DATA_VIEW:table', function( ops ) {
    var object = model.objects.find( ops.object );

    new DataTable( ops.holder, ops.frame, object, ops.data );
  } );

  // Show / hide model builder
  events.on( 'MODEL_BUILDER:show', function( name ) {
    if ( modelBuilder ) {
      return false;
    }

    var object = model.objects.find( name );

    modelBuilder = new ModelBuilder( view.node, object );
  }, false );

  events.on( 'MODEL_BUILDER:closed', function( name ) {
    if ( modelBuilder ) {
      modelBuilder = null;
    }
    if ( pointBuilder ) {
      pointBuilder = null;
    }
  }, false );

  events.on( 'MODEL_BUILDER:updated', function() {
    events.fire( 'UPDATE_DATA_ALL', {
      frame: video.model.frameCurrent
    } );
  }, false );

  // Show / hide center of mass builder
  events.on( 'CENTER_OF_MASS_BUILDER:show', function() {
    if ( centerOfMass ) {
      return false;
    }

    centerOfMass = new CenterOfMass( view.node, model );
  }, false );

  events.on( 'CENTER_OF_MASS_BUILDER:closed', function() {
    if ( centerOfMass ) {
      centerOfMass = null;
    }
  }, false );

  events.on( 'CENTER_OF_MASS_BUILDER:create', function( ops ) {
    var object = model.createPointCenterOfMass( ops.name, ops.points, ops.color );

    events.fire( 'NEW_OBJECT_CREATED', object );

    if ( centerOfMass ) {
      centerOfMass = null;
    }
  } );

  events.on( 'AXIS_CHANGE_ORIGIN', function( ops ) {
    model.axisChangeOrigin( ops );

    events.fire( 'UPDATE_DATA_ALL', {
      frame: ops.frame
    } );
  } );

  // Show / hide data tool
  events.on( 'DATA_TOOL:show', function( model ) {
    // Hide dialogs
    if ( modelBuilder ) {
      modelBuilder = null;
      events.fire( 'MODEL_BUILDER:hide' );
    }
    if ( centerOfMass ) {
      modelBuilder = null;
      events.fire( 'CENTER_OF_MASS_BUILDER:hide' );
    }

    // Hide all view of tracker
    view.hide();

    // Create data tool
    dataTool = new DataTool( view.node, model );
  } );

  events.on( 'DATA_TOOL:closed', function( model ) {
    // Hide model builder
    if ( dataTool ) {
      view.show();
      updateLayout();
      dataTool = null;
    }
  } );

  events.on( 'PARTICLE_MODEL_DYNAMIC:create', function() {
    var object = model.createNewParticalModelDynamic();

    showPointBuilder( object );
    updateAllFramesObject( view.panels, object, config );
  } );

  events.on( 'PARTICLE_MODEL_ANALYTIC:create', function() {
    var object = model.createNewParticalModelAnalytic();

    showPointBuilder( object );
    updateAllFramesObject( view.panels, object, config );
  } );

  // Color Picker
  events.on( 'COLOR_PICKER:show', function( bttn ) {
    new ColorPicker( bttn );
  } );

  // Fire about global rendering
  events.fire( 'APP_VIEW_WAS_RENDERED' );

  // Listen for orientation changes
  var updateLayout = buildUpdateLayout( config, model, view, video );

  window.addEventListener( 'resize', updateLayout, false);

  updateLayout();
};

module.exports = Controller;
