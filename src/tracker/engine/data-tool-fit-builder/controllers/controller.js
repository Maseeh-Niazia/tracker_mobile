'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;

// Dependency controller
var makeWindowDraggable = require( './draggable' );
var setParameters = require( './parameters' );
var setFunction = require( './function' );

var bindChooseUserFit = function( bttn, view, model ) {
  bttn.addEventListener( MOUSEUP, function( evt ) {
    model.setCurrentUserFit( bttn.name );
    view.updateCurrentFitName( model );
    view.hideUserFitVariants();
    
    updateWorkspace( view, model );
    
    events.fire( 'DATA_TOOL:user-fit-list:current-changed' );
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
};

var updateWorkspace = function( view, model ) {
  // Set function table controller
  setFunction( view, model );
  
  // Set parameters table controller
  setParameters( view, model );
};

var initExistedButtons = function( view, model ) {
  for ( var i = view.userFits.length; i--; ) {
    bindChooseUserFit( view.userFits[ i ], view, model );
  }
};

// Main class
var Controller = function( view, model ) {
  // Close popup window
  view.bttnSaveAndClose.addEventListener( MOUSEUP, function( evt ) {
    view.hide();

    events.fire( 'DATA_TOOL:user-fit-list:current-changed' );
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  // Create fit
  view.bttnFitNew.addEventListener( MOUSEUP, function( evt ) {
    model.createUserDefinedFit();
    var fit = model.getCurrentUserFit();
    var bttn = view.addUserFit( fit );
    bindChooseUserFit( bttn, view, model );
    view.update( model );
    
    updateWorkspace( view, model );
    
    events.fire( 'DATA_TOOL:user-fit-list:add', fit );
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  // Delete fit
  view.bttnFitDel.addEventListener( MOUSEUP, function( evt ) {
    var fit = model.getCurrentUserFit();
    view.delUserFit( model.delCurrentUserFit() );
    view.updateCurrentFitName( model );
    view.update( model );
    
    events.fire( 'DATA_TOOL:user-fit-list:del', fit );
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  // Show / hide user fit menu
  view.currentUserFitBttn.addEventListener( MOUSEUP, function( evt ) {
    view.showUserFitVariants();
    
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  window.addEventListener( MOUSEUP, function( evt ) {
    view.hideUserFitVariants();
  }, false );
  
  // Initiate existed fit buttons
  initExistedButtons( view, model );

  // Drag & drop, place in the middle
  makeWindowDraggable( view );
  
  // Update workspace, if fit existed
  var fit = model.getCurrentUserFit();
  
  if ( fit ) {
    updateWorkspace( view, model );

    if ( !isNaN( model.currentFitUser ) ) {
      model.currentFit = model.currentFitUser
    }

    events.fire( 'DATA_TOOL:user-fit-list:current-changed' );
  }
};

module.exports = Controller;