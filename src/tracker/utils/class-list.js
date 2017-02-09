if ( !( 'classList' in SVGElement.prototype ) ) {
  
  Object.defineProperty( SVGElement.prototype, 'classList', {
    get: function() {
      var rspaces = /\s+/g;
      var self = this;
      var implement;
      
      var classlist = function() {
        return self.className.baseVal.trim().split( rspaces );
      };

      var update = function( fn ) {
        return function( value ) {
          var classes = classlist();
          var index = classes.indexOf( value );
          
          fn( classes, index, value );
          self.className = classes.join( ' ' );
          
          implement.length = classes.length;
        };
      };
      
      implement = {
        
        length: ( function() {
          return classlist().length;
        } )(),
        
        add: update( function( classes, index, value ) {
          ~index || classes.push( value );
        } ),
        
        remove: update( function( classes, index ) {
          ~index && classes.splice( index, 1 );
        } ),
        
        toggle: update( function( classes, index, value ) {
          ~index ? classes.splice( index, 1 ) : classes.push( value );
        } ),
        
        contains: function( value ) {
          return !!~classlist().indexOf(value);
        },

        item: function(i) {
          return classlist()[ i ] || null;
        }
      };
      
      return implement;
    }
  } );
};
