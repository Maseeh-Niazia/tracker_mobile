'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEDOWN = events.user.mousedown;
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;
var FOCUS = events.input.focus;
var BLUR = events.input.blur;
var ACTIVE = 'active'; // row active css class
var MAX_PARAMETERS = 4;

// Private methods
var updateButtons = function( bttns, disabled ) {
  bttns.remove.disabled = disabled;
};

var updateAddButton = function( bttns, disabled ) {
  bttns.add.disabled = disabled;
};

var bindParamRowEvents = function( row, param ) {
  initRowChange( row, param );
  initRowActivation( row, param );
};

var initRowActivation = function( row, param ) {
  var blur = function( evt ) {
    row.classList.remove( ACTIVE );
    
    events.fire( 'DATA_TOOL:FIT_BUILDER:blur:row', {
      row: row, param: param
    } );
  };
  var focus = function( evt ) {
    row.classList.add( ACTIVE );
    
    events.fire( 'DATA_TOOL:FIT_BUILDER:focus:row', {
      row: row, param: param
    } );
  };
  
  row.name.addEventListener( BLUR, blur, false );
  row.name.addEventListener( FOCUS, focus, false );
  row.expression.addEventListener( BLUR, blur, false );
  row.expression.addEventListener( FOCUS, focus, false );
};

var initRowChange = function( row, param ) {
  // Add change name behaviour
  row.name.addEventListener( CHANGE, function( evt ) {
    events.fire( 'DATA_TOOL:FIT_BUILDER:update:param-name', {
      row: row, param: param
    } );
  }, false );
  
  // Add change expression behaviour
  row.expression.addEventListener( CHANGE, function( evt ) {
    events.fire( 'DATA_TOOL:FIT_BUILDER:update:param-expression', {
      row: row, param: param
    } );
  }, false );
};

var addAllParameters = function( params, table ) {
  for ( var row, p, i = 0, l = params.length; i < l; i++ ) {
    p = params[ i ];
    
    row = table.createRecord( {
      name: p.name,
      expression: p.value,
      nameIsEditable: true
    } );
    
    bindParamRowEvents( row, p );
  }
};

// Public function
var setParameters = function( view, model ) {
  var bttns = view.controls.parameters;
  var fit = model.getCurrentUserFit();
  var table = view.state.parameters;
  var currParam = null;
  var currRow = null;
  
  // Table clear
  table.clear();
  
  // Table fill
  addAllParameters( fit.parameters, table );
  updateButtons( bttns, currRow === null );
  updateAddButton( bttns, fit.parameters.length >= MAX_PARAMETERS );
  
  // Add new parameter
  bttns.add.onclick = function( evt ) {
    var p = fit.addParameter();
    var row = table.createRecord( {
      name: p.name,
      expression: p.value,
      nameIsEditable: true
    } );
    
    // bind events for new row
    bindParamRowEvents( row, p );
    
    // Update buttons
    updateButtons( bttns, currRow === null );
    updateAddButton( bttns, fit.parameters.length >= MAX_PARAMETERS );
    
    // Sync with Data tool
    events.fire( 'DATA_TOOL:user-fit:parameters-updated' );
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  // Remove parameter
  bttns.remove.addEventListener( MOUSEDOWN, function( evt ) {
    // Prevent row focus loose
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  bttns.remove.onclick = function( evt ) {
    // Real remove from table and model
    fit.delParameter( currParam );
    table.removeRecord( currRow );
    
    // Update "Add" button
    updateAddButton( bttns, fit.parameters.length >= MAX_PARAMETERS );
    
    // Sync with Data tool
    events.fire( 'DATA_TOOL:user-fit:parameters-updated' );
    
    evt.preventDefault();
    evt.stopPropagation();
  };
  
  // Clear all previous binding
  events.clear( 'DATA_TOOL:FIT_BUILDER:blur:row' );
  events.clear( 'DATA_TOOL:FIT_BUILDER:focus:row' );
  events.clear( 'DATA_TOOL:FIT_BUILDER:update:param-name' );
  events.clear( 'DATA_TOOL:FIT_BUILDER:update:param-expression' );
  
  // On change events
  events.on( 'DATA_TOOL:FIT_BUILDER:update:param-name', function( ops ) {
    if ( fit.isParameterNameValid( ops.row.name.value ) ) {
      ops.param.name = ops.row.name.value;
      view.warningHide( ops.row.name );
      events.fire( 'DATA_TOOL:user-fit:parameters-updated' );
    } else {
      view.warningShow( ops.row.name );
    }
  } );
  
  events.on( 'DATA_TOOL:FIT_BUILDER:update:param-expression', function( ops ) {
    if ( fit.isParameterExpressionValid( ops.row.expression.value ) ) {
      ops.param.value = Number( ops.row.expression.value );
      view.warningHide( ops.row.expression );
      events.fire( 'DATA_TOOL:user-fit:parameters-updated' );
    } else {
      view.warningShow( ops.row.expression );
    }
  } );
  
  events.on( 'DATA_TOOL:FIT_BUILDER:focus:row' , function( ops ) {
    currRow = ops.row;
    currParam = ops.param;
    
    updateButtons( bttns, currRow === null );
  } );
  
  events.on( 'DATA_TOOL:FIT_BUILDER:blur:row' , function( ops ) {
    currRow = null;
    currParam = null;
    
    updateButtons( bttns, currRow === null );
  } );
  
  // Update current view: buttons, except "Add"
  updateButtons( bttns, currRow === null );
};

module.exports = setParameters;