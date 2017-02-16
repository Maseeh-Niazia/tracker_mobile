// Dependency utils
var html = require( '../../../utils/html' );

// Dependency view
require( './view.less' );
var Table = require( './table' );
var Controls = require( './controls' );
var template = html( require( './view.html' ) );

// Constants
var WIDHT = 360;
var HEIGHT = 380;

// Private methods
var updateUserFitVariants = function( model ) {
  var fits = model.fit, bttn, i, l;
  
  for ( i = 0, l = fits.length; i < l; i++ ) {
    if ( fits[ i ].isUserDefined ) {
      bttn = createUserFitBttn( fits[ i ].name );
      this.userFitVariants.appendChild( bttn );
      this.userFits.push( bttn );
    }
  }
  
  var fit = model.getCurrentUserFit();
  
  if ( fit ) {
    this.currentUserFit.textContent = fit.name;
  }
};

var createUserFitBttn = function( name ) {
  var bttn = document.createElement( 'button' );
  bttn.textContent = name;
  bttn.name = name;
  return bttn;
};

var findBttnFitByName = function( name ) {
  var bttns = this.userFits, i;
  
  for ( i = bttns.length; i--; ) {
    if ( bttns[ i ].name === name ) {
      return bttns[ i ];
    }
  }
  
  return null;
};

// Main class
var View = function( holder, model ) {
  this.node = template.querySelector( 'div' ).cloneNode( true );
  this.node.style.height = HEIGHT + 'px';
  this.node.style.width = WIDHT + 'px';
  this.holder = holder;
  
  this.width = WIDHT;
  this.height = HEIGHT;
  
  this.header = this.node.querySelector( '.dtfb > .dtfb-h' );
  this.bttnFitNew = this.node.querySelector( '.dtfb > .dtfb-c [name="new"]' );
  this.bttnFitDel = this.node.querySelector( '.dtfb > .dtfb-c [name="del"]' );
  this.bttnSaveAndClose = this.node.querySelector( '.dtfb > .dtfb-c > .dtfb-panel.hint > button' );
  
  this.currentUserFit = this.node.querySelector( '.dtfb > .dtfb-c .dtfb-bttn-fit-current > span' );
  this.currentUserFitBttn = this.currentUserFit.parentNode;
  this.userFitVariants = this.node.querySelector( '.dtfb > .dtfb-c .dtfb-bttn-fit-current > .dtfb-menu-fit-variants' );
  this.userFits = [];
  
  this.state = {
    parameters: new Table( this.node.querySelector( '.dtfb-panel[name="Parameters"]' ) ),
    function: new Table( this.node.querySelector( '.dtfb-panel[name="Function"]' ) )
  };
  this.controls = {
    parameters: new Controls( this.node.querySelector( '.dtfb-panel[name="Parameters"]' ) )
  };
  
  this.hint = this.node.querySelector( '.dtfb > .dtfb-c > .dtfb-panel.hint' );
  this.warning = this.node.querySelector( '.dtfb > .dtfb-c > .dtfb-panel.warning' );
  this.warnings = 0;
  
  this.panels = {
    function: this.node.querySelector( '.dtfb-panel-cover > [name="Function"]' ),
    parameters: this.node.querySelector( '.dtfb-panel-cover > [name="Parameters"]' )    
  };
  
  // Initiate view objects
  updateUserFitVariants.call( this, model );
  this.hideUserFitVariants();
  this.update( model );
  this.warningHide();
  this.show();
};

View.prototype.show = function() {
  this.holder.appendChild( this.node );
};

View.prototype.hide = function() {
  this.holder.removeChild( this.node );
};

View.prototype.update = function( model ) {
  if ( model.calcUserFit() === 0 ) {
    this.bttnFitDel.disabled = true;
    this.currentUserFitBttn.disabled = true;
    this.panels.function.style.display = 'none';
    this.panels.parameters.style.display = 'none';
    
  } else {
    this.bttnFitDel.disabled = false;
    this.currentUserFitBttn.disabled = false;
    this.panels.function.style.display = '';
    this.panels.parameters.style.display = '';
  }
};

View.prototype.updateCurrentFitName = function( model ) {
  var fit = model.getCurrentUserFit();
  
  if ( fit ) {
    this.currentUserFit.textContent = fit.name;
  } else {
    this.currentUserFit.textContent = '';
  }
};

View.prototype.addUserFit = function( fit ) {
  var bttn = createUserFitBttn( fit.name );
  
  this.userFits.push( bttn );
  this.userFitVariants.appendChild( bttn );
  this.currentUserFit.textContent = fit.name;
  
  return bttn;
};

View.prototype.delUserFit = function( fit ) {
  var bttn = findBttnFitByName.call( this, fit.name );
  
  if ( bttn !== null ) {
    this.userFitVariants.removeChild( bttn );
  }
};

View.prototype.warningShow = function( cell ) {
  if ( cell ) {
    this.warnings += 1;
    cell.classList.add( 'wrong' );
  }
  
  this.warning.style.display = '';
  this.hint.style.display = 'none';
};

View.prototype.warningHide = function( cell ) {
  if ( cell ) {
    this.warnings -= 1;
    cell.classList.remove( 'wrong' );
  }
  
  if ( this.warnings <= 0 ) {
    this.warnings = 0;
    this.hint.style.display = '';
    this.warning.style.display = 'none';
  }
};

View.prototype.showUserFitVariants = function() {
  this.userFitVariants.style.display = '';
};

View.prototype.hideUserFitVariants = function() {
  this.userFitVariants.style.display = 'none';
};

View.prototype.updateUserFitVarians = function( oldName, newName ) {
  for ( var i = this.userFits.length; i--; ) {
    if ( this.userFits[ i ].name === oldName ) {
      this.userFits[ i ].name = newName;
      this.userFits[ i ].textContent = newName;
    }
  }
};

module.exports = View;