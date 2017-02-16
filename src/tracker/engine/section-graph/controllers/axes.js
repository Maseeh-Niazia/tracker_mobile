'use strict';

// Dependency utils
var events = require( '../../../utils/events' );

// Constants
var MOUSEUP = events.user.mouseup;
var MOUSEDOWN = events.user.mousedown;

// Private methods
var initChangeVaribale = function( bttns, view, model, axis ) {
  for ( var i = bttns.length; i--; ) {
    bindChangeVariable( bttns[ i ], view, model, axis );
  }
};

var bindChangeVariable = function( bttn, view, model, axis ) {
  bttn.node.addEventListener( MOUSEDOWN, function( evt ) {
    evt.preventDefault();
    evt.stopPropagation();
  }, false );
  
  bttn.node.addEventListener( MOUSEUP, function( evt ) {
    view.setCurrentVariable( bttn.name, axis );
    model.changeAxis( axis, bttn.name );
    view.createChart( model );
    
    events.fire( 'GRAPH_CHANGE_AXIS:' + model.frame );
  }, false );
};

var showAxis_X_Variables = function( view ) {
  var label = view[ view.AXIS.axisX ];
  var bttn = label.bttnCurrent.node;
  var menu = label.selectMenu;
  
  return function( evt ) {
    view.showVariableOptions( view.AXIS.axisX );
    
    var left = bttn.offsetWidth / 2 - menu.offsetWidth / 2;
    menu.style.top = 0 - menu.offsetHeight - 10 + 'px';
    menu.style.left = left + 'px';
    
    evt.preventDefault();
    evt.stopPropagation();
  };  
};

var showAxis_Y_Variables = function( view ) {
  var label = view[ view.AXIS.axisY ];
  var bttn = label.bttnCurrent.node;
  var menu = label.selectMenu;
  
  return function( evt ) {
    view.showVariableOptions( view.AXIS.axisY );
    
    var top = bttn.offsetHeight / 2 - menu.offsetHeight / 2;
    menu.style.left = bttn.offsetWidth + 6 + 'px';
    menu.style.top = top + 'px';
    
    evt.preventDefault();
    evt.stopPropagation();
  };  
};

// Public method
module.exports = function( model, view ) {
  var axisX = view[ view.AXIS.axisX ];
  var axisY = view[ view.AXIS.axisY ];
  
  // Show select axis menu
  axisX.bttnCurrent.node.addEventListener( MOUSEUP, showAxis_X_Variables( view ), false );
  axisY.bttnCurrent.node.addEventListener( MOUSEUP, showAxis_Y_Variables( view ), false );
  
  // Change variable
  initChangeVaribale( axisX.bttnsOption, view, model, view.AXIS.axisX );
  initChangeVaribale( axisY.bttnsOption, view, model, view.AXIS.axisY );
};