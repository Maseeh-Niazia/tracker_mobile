'use strict';

// Private methods
var createRowTemplate = function( node ) {
  var row = node.querySelector( 'tbody > tr ' );
  row.parentNode.removeChild( row );
  return row;
};

var createRow = function() {
  var row = this.rowTemplate.cloneNode( true );
  var td = row.querySelectorAll( 'td' );
  row.num = td[ 0 ];
  row.y = td[ 1 ];
  row.x = td[ 2 ];
  return row;
};

var buildLabel = function( str ) {
  return str
    .replace( /_x/g, '<sub>x</sub>' )
    .replace( /_y/g, '<sub>y</sub>' );
};

var clearRows = function() {
  while( this.tbody.firstChild ) {
    this.tbody.removeChild( this.tbody.firstChild );
  }
  this.rows.length = 0;
};

var updateRows = function( data ) {
  this.thead.yLabel.innerHTML = buildLabel( data.yLabel );
  this.thead.xLabel.innerHTML = buildLabel( data.xLabel );
  
  for ( var i = 0, l = data.length; i < l; i++ ) {
    var row = createRow.call( this );
    this.rows.push( row );
    row.num.textContent = i;
    row.y.textContent = data[ i ].y;
    row.x.textContent = data[ i ].x;
    this.tbody.appendChild( row );
  }
};

// Main class
var Table = function( node ) {
  this.node = node;
  
  this.thead = this.node.querySelector( 'thead' );
  var td = this.thead.querySelectorAll( 'td' );
  this.thead.yLabel = td[ 1 ];
  this.thead.xLabel = td[ 2 ];
  
  this.tbody = this.node.querySelector( 'tbody' ); 
  
  this.rowTemplate = createRowTemplate( this.tbody );
  this.rows = [];
};

Table.prototype.update = function( data ) {
  clearRows.call( this );
  updateRows.call( this, data );
};

module.exports = Table;