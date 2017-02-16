// Make panels separator draggable
var DIRECTIONS = {
  'vertical' : 'vertical',
  'horisontal' : 'horisontal'
};

var makeResizable = function( node, dependentNode, direction ) {
  var resizer = document.createElement( 'div' );
  resizer.className = 'resizer ' + direction;
  var listener = direction === DIRECTIONS.vertical ? initVerticalDrag : initHorisontalDrag;

  node.appendChild( resizer );
  resizer.addEventListener( 'mousedown', listener, false );

  var startX, startY,
    startWidth, startHeight,
    minWidth, minHeight,
    dependentWidth, dependentHeight,
    dependentMinWidth, dependentMinHeight;

  function initVerticalDrag( e ) {
    startX = e.clientX;
    var nodeStyle = document.defaultView.getComputedStyle( node ),
      dependentNodeStyle = document.defaultView.getComputedStyle( dependentNode );

    minWidth = parseInt( nodeStyle.minWidth, 10 ) || 0;
    dependentMinWidth = parseInt( dependentNodeStyle.minWidth, 10 ) || 0;
    startWidth = parseInt( nodeStyle.width, 10 );
    dependentWidth = parseInt( dependentNodeStyle.width, 10 );
    addListeners( doVerticalDrag );
  }

  function initHorisontalDrag( e ) {
    startY = e.clientY;

    var nodeStyle = document.defaultView.getComputedStyle( node ),
      dependentNodeStyle = document.defaultView.getComputedStyle( dependentNode );

    minHeight = parseInt( nodeStyle.minHeight, 10 ) || 0;
    dependentMinHeight = parseInt( dependentNodeStyle.minHeight, 10 ) || 0;
    startHeight = parseInt( nodeStyle.height, 10 );
    dependentHeight = parseInt( dependentNodeStyle.height, 10 );
    addListeners( doHorisontalDrag );
  }

  function addListeners( listener ) {
    document.addEventListener( events.user.mousemove, listener, false );
    document.addEventListener( events.user.mouseup, stopDrag.bind( this, listener ), false );
  }

  function doVerticalDrag( e ) {
    e.preventDefault();

    var distance = e.clientX - startX,
      nodeWidth = startWidth + distance,
      dependentNodeWidth = dependentWidth - distance;

    if ( nodeWidth >= minWidth && dependentNodeWidth >= dependentMinWidth ) {
      node.style.width = nodeWidth + 'px';
      dependentNode.style.width = dependentNodeWidth + 'px';
    }
  }

  function doHorisontalDrag( e ) {
    e.preventDefault();
    var distance = e.clientY - startY,
      nodeHeight = startHeight + distance,
      dependentNodeHeight = dependentHeight - distance;

    if ( nodeHeight >= minHeight && dependentNodeHeight >= dependentMinHeight ) {
      node.style.height = (startHeight + distance) + 'px';
      dependentNode.style.height = (dependentHeight - distance) + 'px';
    }
  }

  function stopDrag( listener, e ) {
    document.removeEventListener( events.user.mousemove, listener );
    document.removeEventListener( events.user.mouseup, stopDrag, false );
  }
};

/*
 // Add resizer block to sections
  makeResizable( this.sections.topL, this.sections.topR, DIRECTIONS.vertical );
  makeResizable( this.sections.video, this.sections.leftB, DIRECTIONS.horisontal );
  makeResizable( this.sections.bottomL, this.sections.bottomR, DIRECTIONS.vertical );
  makeResizable( this.sections.rightT, this.sections.rightB, DIRECTIONS.horisontal );
*/