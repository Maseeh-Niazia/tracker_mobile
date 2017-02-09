'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );
var ButtonOption = require( './controls/button-option' );
var ButtonToggle = require( './controls/button-toggle' );

// Private methods
var setTitle = function( model ) {
  this.title.textContent = model.name;
};

var initView = function( node ) {
  while ( this.node.firstChild ) {
    node.appendChild( this.node.firstChild );
  }

  this.node = node;
};

var remove = function( node ) {
  node.parentNode.removeChild( node );
};

var initBttnOptionTracks = function( config, model ) {
  var name = config.application.current ? config.application.current : '';
  var bttnModel = name !== '' ? model.objects.find( name ) : model.objects[ 0 ];
  var bttnView = this.node.querySelector( '.section-h .bttn-existing-track-model > button' );
  var trackMenu = this.node.querySelector( '.section-h .bttn-existing-track-model > div' );
  var trackMenuButtons = this.node.querySelectorAll( '.section-h .bttn-existing-track-model > div > button' );
  var hr = this.selectTrackMenu.querySelector( 'hr' );

  // Remove this functionality if no objects define in model
  if ( model.objects.length === 0  ) {
    remove( bttnView );
    remove( this.bttnSelectTrackMenu );
    return false;
  }

  // Initiate current object button
  this.currentTrackMenu = trackMenu;
  this.currentTrackName = bttnModel.name;
  this.bttnCurrentTrack = new ButtonOption( bttnView, bttnModel );

  // Get template of buttons
  var bttnTemplate = this.selectTrackMenu.querySelector( '.bttn-option-track' );
  this.selectTrackMenu.removeChild( bttnTemplate );

  // Initiate full list of objects
  for ( var i = 0, l = model.objects.length; i < l; i++ ) {
    bttnModel = model.objects[ i ];
    bttnView = bttnTemplate.cloneNode( true );

    this.selectTrackMenu.insertBefore( bttnView, hr );
    this.bttnsOptionTrack.push( new ButtonOption( bttnView, bttnModel ) );
  }

  // Gel links to track menu buttons
  this.currentTrackMenuButtons = {
    visible : trackMenuButtons[ 0 ],
    define  : trackMenuButtons[ 1 ]
  };

  // Save link to template
  this.bttnTrackTemplate = bttnTemplate;
  this.bttnTrackTemplate.hr = hr;
};

// View constructor
var View = function( node, config, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );

  this.title = this.node.querySelector( '.section-h > h1' );

  this.toggleButtons = [
    new ButtonToggle( this.node.querySelector( '.section-h > h5 > .bttn-axes' ), 'axis', model.axis.visible ),
    new ButtonToggle( this.node.querySelector( '.section-h > h5 > .bttn-tape' ), 'tape', model.tape.visible ),
    new ButtonToggle( this.node.querySelector( '.section-h > h5 > .bttn-protractor' ), 'protractor', model.protractor.visible )
  ];

  this.bttnSelectTrackMenu = this.node.querySelector( '.section-h .bttn-existing-track' );
  this.selectTrackMenu = this.node.querySelector( '.section-h .select-track' );
  this.currentTrackMenuButtons = null;
  this.currentTrackMenu = null;
  this.bttnCurrentTrack = null;
  this.currentTrackName = '';
  this.bttnsOptionTrack = [];
  this.bttnHelp = this.node.querySelector('.section-h > h5 > .bttn-help');

  this.bttnTrackTemplate = null;

  this.bttnCreateCenterOfMass = this.node.querySelector( '.section-h .select-track > .bttn-center-of-mass' );
  this.bttnCreateModelDynamic = this.node.querySelector( '.section-h .select-track > .bttn-create-model-dynamic' );
  this.bttnCreateModelAnalytic = this.node.querySelector( '.section-h .select-track > .bttn-create-model-analytic' );

  // Initiate currect track selection
  initBttnOptionTracks.call( this, config, model );

  // Set title of application
  setTitle.call( this, model );

  // Initiate view
  initView.call( this, node );
  this.hideTrackOptions();
  this.hideTrackMenu();
};

View.prototype.setCurrentTrack = function( model, name ) {
  if ( this.bttnCurrentTrack.name === name ) {
    return false;
  }

  var object = model.objects.find( name );

  this.bttnCurrentTrack.update( object );
  this.currentTrackName = name;

  return this.bttnCurrentTrack.name;
};

View.prototype.showTrackOptions = function() {
  this.selectTrackMenu.style.display = '';
};

View.prototype.hideTrackOptions = function() {
  this.selectTrackMenu.style.display = 'none';
};

View.prototype.showTrackMenu = function( object ) {
  if ( object.isModel ) {
    this.currentTrackMenuButtons.define.classList.remove( 'disabled' );
  } else {
    this.currentTrackMenuButtons.define.classList.add( 'disabled' );
  }
  if ( object.hidden ) {
    this.currentTrackMenuButtons.visible.classList.remove( 'checked' );
  } else {
    this.currentTrackMenuButtons.visible.classList.add( 'checked' );
  }

  this.currentTrackMenu.style.display = '';
};

View.prototype.hideTrackMenu = function() {
  if ( this.currentTrackMenu ) {
    this.currentTrackMenu.style.display = 'none';
  }
};

View.prototype.addNewCreatedObject = function( object ) {
  var bttnView = this.bttnTrackTemplate.cloneNode( true );
  var bttn = new ButtonOption( bttnView, object );
  var hr = this.bttnTrackTemplate.hr;

  this.selectTrackMenu.insertBefore( bttnView, hr );
  this.bttnsOptionTrack.push( bttn );

  return bttn;
};

View.prototype.updatePointColor = function( object ) {
  if ( this.bttnCurrentTrack.name === object.name ) {
    this.bttnCurrentTrack.updateColor( object.color.value );
  }
  
  for ( var i = this.bttnsOptionTrack.length; i--; ) {
    if ( this.bttnsOptionTrack[ i ].name === object.name ) {
      this.bttnsOptionTrack[ i ].updateColor( object.color.value );
      break;
    }
  }
};

module.exports = View;
