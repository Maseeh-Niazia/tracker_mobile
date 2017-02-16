'use strict';

// Constants
var NAME = 'cm';

// Private methods
var setupFreeNameAsSuggestion = function( view, model ) {
  var name = NAME, suf = 0;;
  var element = model.objects.find( name );
  
  while ( element ) {
    name = NAME + ( suf += 1 );
    element = model.objects.find( name );
  }
  
  view.pointNameInput.value = name;
};

// Public methods
var pointNameController = function( view, model ) {
  // Setup name as suggestion for use
  setupFreeNameAsSuggestion( view, model );
  
  // Validate name
  view.pointNameInput.oninput = function( evt ) {
    var isValid = true; 
    
    // Check length of the point name
    if ( this.value.length < 2 ) {
      isValid = false;
      view.pointNameTooSmall();
    }
    
    // Check name for existance
    if ( model.objects.find( this.value ) ) {
      isValid = false;
      view.pointNameExisted();
    }
    
    // If all good
    if ( isValid === true ) {
      view.pointNameIsGood();
    }
    
    // Update button "Create"
    view.bttnCreateUpdate();
  };
};

module.exports = pointNameController;