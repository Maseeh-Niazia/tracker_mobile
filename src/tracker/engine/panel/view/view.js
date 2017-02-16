'use strict';

// Dependency utils
var html = require( '../../../utils/html' );
var body = document.body || document.querySelector( 'body' );

// Dependency video view
require( './view.less' );
var template = html( require( './view.html' ) );

// Constants
var TITLE = {
  'graph' : 'Plot',
  'table' : 'Table',
  'blank' : 'Page'
};

// Dependency view constructor
var ButtonOptionView = require( './controls/button-option-view' );
var ButtonOptionObject = require( './controls/button-option-object' );

// Private methods
var initBttnOptionView = function() {
  var bttns = this.node.querySelectorAll( '.select-view > .bttn-view-option' );
  for ( var i = 0, l = bttns.length; i < l; i++ ) {
    this.bttnsOptionView.push( new ButtonOptionView( bttns[ i ] ) );
  }
};

var initBttnOptionObjects = function( config, model ) {
  // Initiate current object button
  var bttnModel = config.object ? model.objects.find( config.object ) : model.objects[ 0 ];
  var bttnView = this.node.querySelector( '.frame-panel-header .bttn-object-current' );
  this.bttnCurrentObject = new ButtonOptionObject( bttnView, bttnModel );

  // Get template of buttons
  var bttnTemplate = this.selectObjectMenu.querySelector( '.bttn-object-select' );
  this.selectObjectMenu.removeChild( bttnTemplate );

  // Initiate full list of objects
  for ( var i = 0, l = model.objects.length; i < l; i++ ) {
    bttnModel = model.objects[ i ];
    bttnView = bttnTemplate.cloneNode( true );
    this.selectObjectMenu.appendChild( bttnView );
    this.bttnsOptionObject.push( new ButtonOptionObject( bttnView, bttnModel ) );
  }

  // Save template url
  this.bttnObjectTemplate = bttnTemplate;
};

var updateOptionView = function() {
  for ( var i = this.bttnsOptionView.length; i--; ) {
    if ( this.bttnsOptionView[ i ].name === this.currentView ) {
      this.bttnsOptionView[ i ].hide();
    }
    else {
      this.bttnsOptionView[ i ].show();
    }
  }
};

// View constructor
var View = function( holder, model, config ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.name = holder.getAttribute( 'name' );
  this.holder = holder;
  this.id = config.id;

  this.contentHolder = this.node.querySelector( '.frame-panel-content' );
  this.contentNode = null;

  this.title = this.node.querySelector( '.frame-panel-title > span' );
  this.title.textContent = this.name;

  this.currentView = '';
  this.bttnCurrentView = this.node.querySelector( '.frame-panel-header .bttn-view-current' );
  this.bttnViewParameters = this.node.querySelector( '.frame-panel-header .bttn-view-parameters' );
  this.bttnViewParametersText = this.node.querySelector( '.frame-panel-header .bttn-view-parameters > span' );

  this.optionViewMenu = this.node.querySelector( '.frame-panel-header .select-view' );
  this.bttnsOptionView = [];

  this.selectObjectBox = this.node.querySelector( '.frame-panel-header > .menu-object-current' );
  this.selectObjectMenu = this.node.querySelector( '.frame-panel-header > .menu-object-current > .select-object' );
  this.bttnCurrentObject = null;
  this.bttnsOptionObject = [];

  this.bttnObjectTemplate = null;

  // Initiate buttons view options
  initBttnOptionView.call( this );
  // Initiate buttons objects obtions
  initBttnOptionObjects.call( this, config, model );

  // Initiate first parameters
  this.setCurrentView( config.view, model );
  this.hideObjectOptions();
  this.hideViewOptions();
  this.draw();
};

View.prototype.draw = function() {
  this.holder.appendChild( this.node );
};

View.prototype.setCurrentView = function( viewType, model ) {
  if ( !viewType || viewType === '' ) {
    this.selectObjectBox.style.display = 'none';
    this.selectObjectMenu.style.display = 'none';
    this.bttnViewParameters.style.display = 'none';
    this.bttnCurrentView.setAttribute( 'current', 'default' );
    return false;
  }

  if ( this.currentView === viewType ) {
    return false;
  }

  this.currentView = viewType;
  this.selectObjectBox.style.display = '';
  this.selectObjectMenu.style.display = '';
  this.bttnViewParameters.style.display = '';
  this.bttnViewParametersText.textContent = TITLE[ viewType ];
  this.bttnCurrentView.setAttribute( 'current', viewType );
  this.bttnViewParameters.setAttribute( 'current', viewType );
  this.setCurrentObject( model, this.bttnCurrentObject.name );

  return this.currentView;
};

View.prototype.setCurrentObject = function( model, name ) {
  if ( this.bttnCurrentObject.name === name ) {
    return false;
  }

  var object = model.objects.find( name );
  this.bttnCurrentObject.update( object );

  return this.bttnCurrentObject.name;
};

View.prototype.showViewOptions = function() {
  this.optionViewMenu.style.display = '';
};

View.prototype.hideViewOptions = function() {
  this.optionViewMenu.style.display = 'none';
};

View.prototype.showObjectOptions = function() {
  this.selectObjectMenu.style.display = '';
};

View.prototype.hideObjectOptions = function() {
  this.selectObjectMenu.style.display = 'none';
};

View.prototype.clear = function( node ) {
  while ( this.contentHolder.firstChild ) {
    this.contentHolder.removeChild( this.contentHolder.firstChild );
  }
};

View.prototype.addNewCreatedObject = function( object ) {
  var bttnView = this.bttnObjectTemplate.cloneNode( true );
  var bttn = new ButtonOptionObject( bttnView, object );

  this.selectObjectMenu.appendChild( bttnView );
  this.bttnsOptionObject.push( bttn );

  return bttn;
};

View.prototype.updateColor = function( object ) {
  if ( this.bttnCurrentObject.name === object.name ) {
    this.bttnCurrentObject.updateColor( object.color.value )
  }
  
  for ( var i = this.bttnsOptionObject.length; i--; ) {
    if ( this.bttnsOptionObject[ i ].name === object.name ) {
      this.bttnsOptionObject[ i ].updateColor( object.color.value );
      break;
    }
  }
};

module.exports = View;
