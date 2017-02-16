'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var template = html( require( './view.html' ) );

var Point = require( './point' );
var ButtonColorPicker = require( '../../color-picker/button' );

// Constants
var WIDTH = 250;

// Private methods
var addAllAvaliableObjects = function( model ) {
  for ( var p, i = model.objects.length; i--; ) {
    if ( model.objects[ i ].type === 'point' ) {
      if ( !model.objects[ i ].isCenterOfMass ) {
        p = new Point( model.objects[ i ] );
        
        this.points.push( p );
        this.pointsPanel.appendChild( p.node );
      }
    }
  }
};

var hasSelectedPoints = function() {
  for ( var i = this.points.length; i--; ) {
    if ( this.points[ i ].isChecked ) {
      return true;
    }
  }
  
  return false;
};

var pointNameWrong = function() {
  if ( this.pointNameIsValid === true ) {
    this.pointNameIsValid = false;
    this.pointNameInput.classList.add( 'wrong' );
  }
};

var pointNameCorrect = function() {
  if ( this.pointNameIsValid === false ) {
    this.pointNameIsValid = true;
    this.pointNameInput.classList.remove( 'wrong' );
  }
};

// View constructor
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.node.style.width = WIDTH + 'px';
  this.holder = holder;
  
  this.width = WIDTH;
  
  this.isVisible = false;
  
  this.header = this.node.querySelector( '.ccom > .ccom-h' );
  this.bttnClose = this.node.querySelector( '.ccom > .ccom-h > button' );
  this.bttnCreate = this.node.querySelector( '.ccom > .ccom-c > button' );
  this.pointsPanel = this.node.querySelector( '.ccom > .ccom-c > .ccom-panel.points' );
  this.bttnColor = new ButtonColorPicker( this.node.querySelector( '.ccom > .ccom-c > .ccom-panel > button' ) );
  
  this.points = [];
  this.pointNameIsValid = true;
  this.pointNameInput = this.node.querySelector( '.ccom > .ccom-c > .ccom-panel > input' );
  this.pointNameWarning = this.node.querySelector( '.ccom > .ccom-c > .ccom-panel > .warning' );
  
  addAllAvaliableObjects.call( this, model );
  
  this.show();
  this.bttnCreateUpdate();
  this.bttnColor.setColor( null );
};

View.prototype.show = function() {
  if ( !this.isVisible ) {
    this.isVisible = true;
    this.holder.appendChild( this.node );
  }
};

View.prototype.hide = function() {
  if ( this.isVisible ) {
    this.isVisible = false;
    this.holder.removeChild( this.node );
  }
};

View.prototype.pointNameIsGood = function() {
  pointNameCorrect.call( this );
  
  this.pointNameWarning.textContent = '';
};

View.prototype.pointNameTooSmall = function() {
  pointNameWrong.call( this );
  
  this.pointNameWarning.textContent = 'Name must be at least 2 characters';
};

View.prototype.pointNameExisted = function() {
  pointNameWrong.call( this );
  
  this.pointNameWarning.textContent = 'Name already exists, choose another one';
};

View.prototype.bttnCreateUpdate = function() {
  if ( this.pointNameIsValid && hasSelectedPoints.call( this ) ) {
    this.bttnCreate.removeAttribute( 'disabled' );
  } else {
    this.bttnCreate.setAttribute( 'disabled', 'disabled' );
  }
};

View.prototype.getPointName = function() {
  return this.pointNameInput.value;
};

View.prototype.getSelectedPoints = function() {
  var points = [], i;
  
  for ( i = this.points.length; i--; ) {
    if ( this.points[ i ].isChecked ) {
      points.push( this.points[ i ].name );
    }
  }
  
  return points;
};

module.exports = View;