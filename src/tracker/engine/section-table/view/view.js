'use strict';

// Dependency utils
var html = require( '../../../utils/html' );
var body = document.body || document.querySelector( 'body' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );
var ColumnSelector = require( './column-selector/column-selector' );

// Constants
var HIGHLIGHT_CLASS = 'highlight';

var changeCellText = function( cell, data, precision, postText ) {
  if ( isNaN( data ) && isNaN( precision ) ) {
    var match = data.match( /^(\w+)_(\w+)$/ );
	    
    if ( match ) {
      data = match[ 1 ] + '<sub>' + match[ 2 ] + '</sub>';
    }
    
    cell.innerHTML = data || '';
  } else {
    cell.textContent = ( isNaN( data ) ? '' : data.toFixed( precision ) ) + ( postText ? postText : '' );
  }
};

var isNumber = function( value ) {
  return value || value === 0;
};

var removeChildren = function( node ) {
  while ( node.hasChildNodes() ) {
    node.removeChild( node.lastChild );
  }
};

var isScrollEnd = function( node ) {
  return node.scrollHeight - node.scrollTop === node.clientHeight;
};

var getColumnIndex = function( model, column ) {
  var index = model.selectedColumns.indexOf( column );
  
  if ( index === -1 ) {
    index = model.allParams.indexOf( column );
  }
  
  return index;
};

var clearNode = function( node ) {
  while( node.firstChild ) {
    node.removeChild( node.firstChild );
  }
};

var clearTable = function() {
  clearNode( this.head );
  clearNode( this.body );
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.holder = holder;
  this.head = this.node.querySelector( 'thead' );
  this.body = this.node.querySelector( 'tbody' );
  this.cellNodes = [];
  this.rowNodes = [];

  this.columnHolder = document.querySelector( '.tracker' );
  this.columnSelector = new ColumnSelector( this.columnHolder, model );
  
  // Draw table
  this.drawTable( model );
  this.holder.appendChild( this.node );
  
  this.scrollStep = Math.ceil( this.holder.scrollHeight / this.rowNodes.length );
  this.halfHeight = this.holder.clientHeight / 2;
};

View.prototype.drawTable = function( model ) {
  this.createRow( model );
  
  for ( var i = 0; i < model.data.length; i++ ) {
    if ( model.data[ i ] ) {
      this.createRow( model, i );
    }
  }
};

View.prototype.changeObject = function( model ) {
  this.cellNodes.length = 0;
  this.rowNodes.length = 0;
  
  removeChildren( this.head );
  removeChildren( this.body );
  
  clearTable.call( this );
  this.drawTable( model );
  this.columnSelector.update( model );
};

View.prototype.createRow = function( model, index ) {
  var target = isNaN( index ) ? this.head : this.body;
  var row = document.createElement( 'tr' );
  var columns = model.selectedColumns;
  var isDataRow = !isNaN( index );
  var precision, cell, data;
  var cellNodes = [];
  var postText = '';
  
  for ( var i = 0; i < columns.length; i++ ) {
    cell = document.createElement( 'td' );
    precision = model.getPrecisionFor( columns[ i ] );
    data = isDataRow ? model.data[ index ][ columns[ i ] ] : columns[ i ];
    
    if ( columns[ i ] === 'θ' ) {
      postText = '°';
    }
    
    changeCellText( cell, data, isDataRow ? precision : NaN, postText );
    
    cellNodes.push( cell );
    row.appendChild( cell );
  }
  
  this.cellNodes.push( cellNodes );
  this.rowNodes.push( row );
  
  target.appendChild( row );
};

View.prototype.addColumn = function( model, column ) {
  var index = getColumnIndex( model, column );
  var cell, data, precision;
  var dr = 0, r;

  if ( this.rowNodes.length === 0 ) {
    this.rowNodes.push( document.createElement( 'tr' ) );
  }

  // Create header
  cell = document.createElement( 'td' );
  precision = NaN;
  data = column;

  changeCellText( cell, data, precision );

  // First: add in real node
  if ( this.cellNodes[ 0 ].length === index ) {
    
    this.rowNodes[ 0 ].appendChild( cell );
  } else {
    this.rowNodes[ 0 ].insertBefore( cell, this.cellNodes[ 0 ][ index ] );
  }

  // Second: add in virtual model
  this.cellNodes[ 0 ].splice( index, 0, cell );

  // Crceate data rows
  for ( var i = 0, l = model.data.length; i < l; i++ ) {
    if ( !model.data[ i ] ) {
      dr += 1;
      continue;
    }
    r = i + 1 - dr;
    data = model.data[ i ][ column ];
    cell = document.createElement( 'td' );
    precision = model.getPrecisionFor( column );

    changeCellText( cell, data, precision );

    // First: add in real node
    if ( this.cellNodes[ r ].length === index ) {
      this.rowNodes[ r ].appendChild( cell );  
    } else {
      this.rowNodes[ r ].insertBefore( cell, this.cellNodes[ r ][ index ] );
    }

    // Second: add in virtual model
    this.cellNodes[ r ].splice( index, 0, cell );
  }
};

View.prototype.removeColumn = function( model, column ) {
  var index = getColumnIndex( model, column );
  
  for ( var i = this.rowNodes.length; i--; ) {
    this.cellNodes[ i ][ index ].remove();
    this.cellNodes[ i ].splice( index, 1 );
  }
};

View.prototype.highlightRow = function( index ) {
  for ( var i = this.rowNodes.length; i--; ) {
    var row = this.rowNodes[ i ];

    if ( i === index + 1 ) {
      row.classList.add( HIGHLIGHT_CLASS );
    }
    else {
      row.classList.remove( HIGHLIGHT_CLASS );
    }
  }
  
  if ( !isScrollEnd( this.holder ) ) {
    this.holder.scrollTop = this.scrollStep * index - this.halfHeight;
  }
};

module.exports = View;
