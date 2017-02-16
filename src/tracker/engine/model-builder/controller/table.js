'use strict';
// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var CHANGE = events.input.change;
var FOCUS = events.input.focus;
var BLUR = events.input.blur;

// Private methods
var initRow = function( row, record, name ) {
  initRowChange( row, record, name );
  initRowActivation( row, record, name );
};

var initRowChange = function( row, record, name ) {
  // Add change expression behaviour
  row.expression.addEventListener( CHANGE, function( evt ) {
    this.value = this.value.replace( /,/g, '.' );

    events.fire( 'MODEL_BUILDER:update:expression:in:' + name, {
      row: row, record: record
    } );
  }, false );

  // Add change name behaviour
  if ( !record.nameIsEditable ) {
    return false;
  }

  row.name.addEventListener( CHANGE, function( evt ) {
    events.fire( 'MODEL_BUILDER:update:name:in:' + name, {
      row: row, record: record
    } );
  }, false );
};

var initRowActivation = function( row, record, name ) {
  var focus = function( evt ) {
    row.classList.add( 'active' );

    events.fire( 'MODEL_BUILDER:focus:row:in:' + name, {
      row: row, record: record
    } );
  };
  var blur = function( evt ) {
    row.classList.remove( 'active' );
  };

  row.name.addEventListener( BLUR, blur, false );
  row.name.addEventListener( FOCUS, focus, false );
  row.expression.addEventListener( BLUR, blur, false );
  row.expression.addEventListener( FOCUS, focus, false );
};

var disableButtons = function( bttns, value ) {
  if ( bttns.cut ) {
    bttns.cut.disabled = value;
  }
  if ( bttns.copy ) {
    bttns.copy.disabled = value;
  }
  if ( bttns.paste ) {
    bttns.paste.disabled = value;
  }
  if ( bttns.remove ) {
    bttns.remove.disabled = value;
  }
};

// Controller constructor
var initTable = function( view, object, name ) {

  // Shortcats
  var bttns = view.controls[ name ];
  var table = view.state[ name ];
  var state = object.state[ name ];
  var currRow, currRecord;

  // Initiate all rows in table
  for ( var i = 0 , l = state.length; i < l; i++ ) {
    initRow( table.createRecord( state[ i ] ), state[ i ], name );
  }

  events.on( 'MODEL_BUILDER:update:expression:in:' + name, function( ops ) {
    var cell = ops.row.expression;
    var exp = ops.record.getValidExpression( cell.value );

    if ( exp === null || !object.state.isExpressionValid( ops.record.name, exp ) ) {
      ops.record.isValid = false;
      view.warningShow( object.state, cell );

      return false;
    }

    ops.record.isValid = true;
    ops.record.setExpression( cell.value, exp );

    view.warningHide( object.state, cell );
    view.calcShatterShow();

    setTimeout( function() {
      object.reCalcModel();

      setTimeout( function() {
        view.calcShatterHide();

        events.fire( 'MODEL_BUILDER:updated' );
      }, 40 );
    }, 40 );
  } );

  // Initiate control button
  if ( !bttns ) {
    return false;
  }

  // Disable buttons
  disableButtons( bttns, true );

  // Bind events
  bttns.add.addEventListener( MOUSEUP, function( evt ) {
    var record = state.addRecord();
    var row = table.createRecord( record );

    initRow( row, record, name );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  bttns.remove.addEventListener( MOUSEUP, function( evt ) {
    table.removeRecord( currRow );
    state.removeRecord( currRecord );

    disableButtons( bttns, true );

    evt.preventDefault();
    evt.stopPropagation();
  }, false );

  // On change events
  events.on( 'MODEL_BUILDER:update:name:in:' + name, function( ops ) {
    var cell = ops.row.name;
    var name = cell.value;

    if ( ops.record.isNameValid( name ) && object.state.isNameNotUsed( name ) ) {
      ops.record.isValid = true;
      ops.record.setName( name );

      view.warningHide( object.state, cell );
    } else {
      ops.record.isValid = false;

      view.warningShow( object.state, cell );
    }
  } );

  events.on( 'MODEL_BUILDER:focus:row:in:' + name, function( ops ) {
    currRow = ops.row;
    currRecord = ops.record;

    if ( ops.record.nameIsEditable ) {
      disableButtons( bttns, false );
    } else {
      disableButtons( bttns, true );
    }
  } );
};

module.exports = initTable;
