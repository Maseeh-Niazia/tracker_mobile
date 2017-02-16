'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var Table = require( './table' );
var Controls = require( './controls' );
var template = html( require( './view.html' ) );
var ButtonColorPicker = require( '../../color-picker/button' );

// Constants
var WIDTH = 360;
var HEIGHT = 530;

// Private methods
var getHeaderTitle = function( str ) {
  return str[ 0 ] + str.substr( 1 ).toLowerCase();
};

var initTitle = function( model ) {
  var span = this.node.querySelectorAll( '.mb > .mb-c > .mb-panel.model > span' );
  span[ 0 ].textContent = model.name;
  span[ 1 ].textContent = 'Frames: ' + model.start + ' – ' + model.end;

  this.headerTitle.innerHTML = 'Model Builder - ' + getHeaderTitle( model.modelType );
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.node.style.height = HEIGHT + 'px';
  this.node.style.width = WIDTH + 'px';
  this.holder = holder;
  
  this.width = WIDTH;
  this.height = HEIGHT;

  var parameters = this.node.querySelector( '.mb-panel[name="Parameters"]' );
  var initial = this.node.querySelector( '.mb-panel[name="Initial Values"]' );
  var functions = this.node.querySelector( '.mb-panel[name="Force Functions"]' );
  
  this.bttnColor = new ButtonColorPicker( this.node.querySelector( '.mb > .mb-c > .mb-panel.model > button' ) );
  this.bttnColor.setColor( model.color.value );

  this.state = {
    parameters: new Table( parameters ),
    initialValues: new Table( initial ),
    forceFunctions: new Table( functions )
  };
  
  this.controls = {
    parameters: new Controls( parameters ),
    forceFunctions: new Controls( functions ),
  };
  
  this.header = this.node.querySelector( '.mb > .mb-h' );
  this.headerTitle = this.header.querySelector( '.mb-h > h1' );
  this.bttnSaveAndClose = this.node.querySelector( '.mb > .mb-c > .mb-panel.hint > button' );
  
  this.hint = this.node.querySelector( '.mb > .mb-c > .mb-panel.hint' );
  this.warning = this.node.querySelector( '.mb > .mb-c > .mb-panel.warning' );
  this.calcShatter = this.node.querySelector( '.mb > .mb-calculating' );
  this.bttnCalc = this.node.querySelector( '.mb > .mb-c > .mb-panel.hint > button' );
  
  functions.setAttribute( 'name', model.functionsName );

  initTitle.call( this, model );
  this.calcShatterHide();
  this.warningHide();
  this.show();
};

View.prototype.show = function() {
  this.holder.appendChild( this.node );
};

View.prototype.hide = function() {
  this.holder.removeChild( this.node );
};

View.prototype.warningShow = function( state, cell ) {
  if ( cell ) {
    cell.classList.add( 'wrong' );
  }
  
  this.warning.style.display = '';
  this.hint.style.display = 'none';
};

View.prototype.warningHide = function( state, cell ) {
  if ( cell ) {
    cell.classList.remove( 'wrong' );
  }
  
  if ( !state || state.isModelStateValid() ) {
    this.hint.style.display = '';
    this.warning.style.display = 'none';
  }
};

View.prototype.calcShatterShow = function() {
  this.calcShatter.style.display = '';
};

View.prototype.calcShatterHide = function() {
  this.calcShatter.style.display = 'none';
};

module.exports = View;