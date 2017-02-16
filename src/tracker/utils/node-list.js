'use-strict';

NodeList.prototype.attr = NodeList.prototype.attr || function( name, val ) {
  for ( var i = this.length; i--; ) {
    if ( arguments.length === 2 ) {
      this[ i ].setAttribute( name, val );
    } else {
      return this[ i ].getAttribute( name );
    }
  }
};

NodeList.prototype.show = NodeList.prototype.show || function() {
  for ( var i = this.length; i--; ) {
    this[ i ].style.display = '';
  }
};

NodeList.prototype.hide = NodeList.prototype.hide || function() {
  for ( var i = this.length; i--; ) {
    this[ i ].style.display = 'none';
  }
};
