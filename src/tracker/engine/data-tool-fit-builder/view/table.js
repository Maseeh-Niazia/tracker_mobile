'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './table.less' );
var template = html( require( './table.html' ) );

// Private methods
var createRowTemplate = function( node ) {
  var row = node.querySelector( 'tbody > tr' );
  row.parentNode.removeChild( row );
  return row;
};

var createRow = function( record ) {
  var row = this.rowTemplate.cloneNode( true );
  var td = row.querySelectorAll( 'td' );
  
  if ( record.nameIsEditable ) {
    row.name = createTextInput( record.name );
  } else {
    row.name = createLabel( record.name );
  }
  
  row.expression = createTextInput( record.expression );
  
  td[ 0 ].appendChild( row.name );
  td[ 1 ].appendChild( row.expression ); 
  
  return row;
};

var createLabel = function( value ) {
  var label = document.createElement( 'label' );
  label.textContent = value;
  return label;
};

var createTextInput = function( value ) {
  var input = document.createElement( 'input' );
  input.value = value || 0;
  input.type = 'text';
  return input; 
};

var clear = function() {
  while( this.body.firstChild ) {
    this.body.removeChild( this.body.firstChild );
  }
};

// Table constructor
var Table = function( holder ) {
  this.node = template.querySelector( 'table' ).cloneNode( true );
  this.rowTemplate = createRowTemplate( this.node );
  this.body = this.node.querySelector( 'tbody' );
  holder.appendChild( this.node );
};

Table.prototype.createRecord = function( record ) {
  var row = createRow.call( this, record );
  this.body.appendChild( row );
  return row;
};

Table.prototype.removeRecord = function( row ) {
  this.body.removeChild( row );
};

Table.prototype.clear = function() {
  clear.call( this );
};

module.exports = Table;