'use strict';

// Private methods
var createRowTemplate = function( node ) {
  var row = node.querySelector( 'tbody > tr ' );
  row.parentNode.removeChild( row );
  return row;
};

var createRow = function() {
  var row = this.rowTemplate.cloneNode( true );
  row.label = row.querySelector( 'td:first-child' );
  row.input = row.querySelector( 'td:last-child > input' );
  return row;
};

var clearRows = function() {
  while( this.tbody.firstChild ) {
    this.tbody.removeChild( this.tbody.firstChild );
  }
  this.rows.length = 0;
};

var updateRows = function( params ) {
  for ( var v, i = 0, l = params.length; i < l; i++ ) {
    var row = createRow.call( this );
    this.rows.push( row );
    row.label.textContent = params[ i ].name;
    v = params[ i ].value;
    v =  ( v === 0 ) ? '0' : v.toExponential( 3 ).toString();
    row.input.value = v.replace( /e/, 'E' );
    this.tbody.appendChild( row );
  }
};

// Main class
var Table = function( node ) {
  this.node = node;
  this.tbody = this.node.querySelector( 'tbody' ); 
  this.rowTemplate = createRowTemplate( this.tbody );
  this.rows = [];
};

Table.prototype.update = function( params ) {
  clearRows.call( this );
  updateRows.call( this, params );
};

module.exports = Table;