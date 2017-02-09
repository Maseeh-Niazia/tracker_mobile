'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;

// Private methods
var bindFunctionRowEvents = function( row, view, model ) {
  var fit = model.getCurrentUserFit();
  
  // Change name of function
  row.name.addEventListener( CHANGE, function( evt ) {
    if ( model.isFitNameValid( fit, row.name.value ) ) {
      var oldName = fit.name;
      fit.name = row.name.value;
      view.updateCurrentFitName( model );
      view.updateUserFitVarians( oldName, fit.name );
      events.fire( 'DATA_TOOL:user-fit:name-updated', {
        oldName: oldName,
        newName: fit.name
      } );
      view.warningHide( row.name );
    } else {
      view.warningShow( row.name );
    }
  }, false );
  
  // Change expression of function
  row.expression.addEventListener( CHANGE, function( evt ) {
    if ( model.isFitExpressionValid( row.expression.value ) ) {
       var fit = model.getCurrentUserFit();
       fit.setExpression( row.expression.value );
       events.fire( 'DATA_TOOL:user-fit:expression-updated' );
       view.warningHide( row.expression );
    } else {
      view.warningShow( row.expression );
    }
  }, false );
};

// Public function
var setFunction = function( view, model ) {
  var fit = model.getCurrentUserFit();
  var table = view.state.function;
  
  // Table clear
  table.clear();
  
  // Table add function row
  var row = table.createRecord( {
    name: fit.name,
    expression: fit.expression,
    nameIsEditable: true
  } );
  
  // Bind changes of function parameters
  bindFunctionRowEvents( row, view, model );
};

module.exports = setFunction;