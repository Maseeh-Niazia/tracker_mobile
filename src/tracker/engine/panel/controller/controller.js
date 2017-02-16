'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;

// Private methods
var initDataView = function( view, config ) {
  view.clear();
  
  events.fire( 'FRAME_INIT_DATA_VIEW:' + view.currentView, {
    frame: view.name,
    data: config.data || {},
    holder: view.contentHolder,
    object: view.bttnCurrentObject.name    
  } );
};

var changeObject = function( view, name, config, model, object ) {
  var currView = view.currentView;
  var currObject = view.setCurrentObject( model, name );

  if ( currObject ) {
    events.fire( 'FRAME_CHANGE_DATA:' + currView + ':' + view.name, {
      data: config.data || {},
      holder: view.contentHolder,
      object: object || model.objects.find( view.bttnCurrentObject.name )
    } );
  }
};

var bindChangeViewType = function( view, bttn, config ) {
  bttn.node.addEventListener( MOUSEUP, function( evt ) {
    var currView = view.setCurrentView( bttn.name );
    
    if ( currView ) {
      initDataView( view, config );
    }
  }, false );
};

var bindChangeObject = function( view, bttn, config, model ) {
  bttn.node.addEventListener( MOUSEUP, function( evt ) {
    changeObject( view, bttn.name, config, model );
  }, false );
};

// Controller constructor
var Controller = function( view, model, config ) {
  // Show data view parameters
  view.bttnViewParameters.addEventListener( MOUSEUP, function( evt ) {
    events.fire( 'SHOW_DATA_PARAMETERS:' + view.currentView + ':' + view.name, {
      object: view.bttnCurrentObject.name,
      frameName: view.name
    } );
  } );
  
  // Show change view menu
  view.bttnCurrentView.addEventListener( MOUSEUP, function( evt ) {
    view.showViewOptions();
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  // Show change object menu
  view.bttnCurrentObject.node.addEventListener( MOUSEUP, function( evt ) {
    view.showObjectOptions();
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  // Hide all opened options (menu)
  window.addEventListener( MOUSEUP, function( evt ) {
    view.hideViewOptions();
    view.hideObjectOptions();      
  }, false );
  
  // Change view type
  for ( var i = view.bttnsOptionView.length; i--; ) {
    bindChangeViewType( view, view.bttnsOptionView[ i ], config );
  }
  
  // Change object
  for ( var i = view.bttnsOptionObject.length; i--; ) {
    bindChangeObject( view, view.bttnsOptionObject[ i ], config, model );
  }
  
  // Initiate data view
  events.on( 'APP_VIEW_WAS_RENDERED', function( ops ) {
    if ( config.object ) {
      initDataView( view, config );
    }
  } );
  
  // New object created
  events.on( 'NEW_OBJECT_CREATED', function( object ) {
    var bttn = view.addNewCreatedObject( object );
    
    bindChangeObject( view, bttn, config, model );
  } );

  events.on( 'NEW_OBJECT_CREATED:show:' + view.name, function( ops ) {
    changeObject( view, ops.object.name, config, model, ops.object );
  } );

  events.on( 'POINT_UPDATE:color', function( ops ) {
    view.updateColor( ops.object );
  } );
};

module.exports = Controller;