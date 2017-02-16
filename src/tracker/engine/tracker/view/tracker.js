'use strict';

// Dependency utils
var html = require( '../../../utils/html' );

// Dependency tracker
require( './tracker.less' );
var Panel = require( '../../panel/index' );
var template = html( require( './tracker.html' ) );

// Constants
var SPLITTER_SIZE = 8;
var TOOLBAR_HEIGHT = 34;
var HEADER_SECTION_HEIGHT = 34;
var VIDEO_MIN_WIDTH = 420;
var FRAME_MIN_WIDTH = 300;
var FRAME_MIN_HEIGHT = 140;
var ORIENTATION = require( '../model/orientation' );

// Modes
var MODE_WITHOUT_RIGHT = 'mode-without-right-frames';
var MODE_WITHOUT_BOTTOM = 'mode-without-bottom-frames';

// Private methods
var updateSectionsView = function( config, model ) {
  var videoWidth = Math.max( VIDEO_MIN_WIDTH, model.video.bbox.width || 0 ) + 'px';
  var videoHeight = ( model.video.bbox.height + TOOLBAR_HEIGHT ) + 'px';
  var splitterSize = SPLITTER_SIZE + 'px';
  var hasRightPanel = config.rightT.visible || config.rightB.visible;
  var hasBottomPanel = config.bottomL.visible || config.bottomR.visible;
  
  // Video panel always visible!
  this.sections.video.style.width = videoWidth;
  
  // Bottom section always ghas widhh the same as video
  this.sections.bottom.style.width = videoWidth;
  
  // No bottom and right panels
  if ( !hasBottomPanel && !hasRightPanel ) {
    // Hide splitter beetwin global left and right panels
    this.splitter.LR.style.display = 'none';
  }
  
  // No bottom panels
  if ( !hasBottomPanel ) {
    // Set video width
    this.sections.video.style.width = videoWidth;
    // Hide fully bottom panel
    this.sections.bottomL.parentNode.style.display = 'none';
    // Make video full size by height
    this.sections.video.style.height = '100%';
    // Hide splitter in left panel as unnessesary
    this.splitter.L_TB.style.display = 'none';
  }
  
  // No right panels
  if ( !hasRightPanel ) {
    // Hide fully right panel
    this.sections.right.style.display = 'none';
    // Make left panel full size by width
    this.sections.video.style.width = '100%';
    this.sections.video.parentNode.style.width = '100%';
    // Hide splitters in right panel as unnessesary
    this.splitter.LR.style.display = 'none';
    this.splitter.R_TB.style.display = 'none';
    
    // Set video dimentions
    this.sections.video.style.height = videoHeight;
    
    // Set bottom panel height
    this.sections.bottom.style.height = 'calc(100% - ' + videoHeight + ' - ' + splitterSize + ')';
  }
  
  // Has bottom panels
  if ( hasBottomPanel ) {
    this.sections.video.style.height = videoHeight;
    this.sections.bottom.style.height = 'calc(100% - ' + videoHeight + ' - ' + splitterSize + ')';
    
    if ( config.bottomL.visible && !config.bottomR.visible ) {
      this.splitter.L_B_LR.style.display = 'none';
      this.sections.bottomL.style.width = '100%';
    }
    if ( !config.bottomL.visible && config.bottomR.visible ) {
      this.splitter.L_B_LR.style.display = 'none';
      this.sections.bottomR.style.width = '100%';
    }
    if ( config.bottomL.visible && config.bottomR.visible ) {
      this.sections.bottomL.style.width = '50%';
      this.sections.bottomR.style.width = 'calc(50% - ' + splitterSize + ')';
    }
  }
  
  // Has right panels
  if ( hasRightPanel ) {
    this.sections.right.style.width = 'calc(100% - ' + videoWidth + ' - ' + splitterSize + ')';
    
    if ( config.rightT.visible && !config.rightB.visible ) {
      this.splitter.R_TB.style.display = 'none';
      this.sections.rightT.style.height = '100%';
      this.sections.rightB.style.display = 'none';
    }
    if ( !config.rightT.visible && config.rightB.visible ) {
      this.splitter.R_TB.style.display = 'none';
      this.sections.rightB.style.height = '100%';
      this.sections.rightT.style.display = 'none';
    }
  }
};

var createSectionsView = function( config, model ) {
  var panels = [ 'bottomL', 'bottomR', 'rightT', 'rightB' ];
  var section, panel, view, i
  
  for ( i = panels.length; i--; ) {
    section = this.sections[ panels[ i ] ];
    panel = config[ panels[ i ] ];
    
    if ( panel.visible ) {
      if ( !!panel.table ) {
        view = 'table';
      }
      if ( !!panel.graph ) {
        view = 'graph';
      }
      
      this.panels.push( new Panel( section, model, {
        id: panels[ i ],
        data: panel.data,
        object : panel.object,
        view: panel.data ? panel.data.view : ''
      } ) );
    }
  }
};

var clearAllSpecifiedLayouts = function( videoView ) {
  var empty = '';
  var node = videoView.videoWrapper;
  
  node.style.webkitTransform = empty;
  node.style.MozTransform = empty;
  node.style.msTransform = empty;
  node.style.OTransform = empty;
  node.style.transform = empty;
  
  node.style.webkitTransformOrigin = empty;
  node.style.MozTransformOrigin = empty;
  node.style.msTransformOrigin = empty;
  node.style.OTransformOrigin = empty;
  node.style.transformOrigin = empty;
  
  this.node.classList.remove( MODE_WITHOUT_RIGHT );
  this.node.classList.remove( MODE_WITHOUT_BOTTOM );
  
  videoView.node.removeAttribute( 'style' );
  videoView.videoWrapper.removeAttribute( 'style' );
};

var stretchVideoContainerForWindow_Width = function( videoBBox, video, screen ) {
  var videoView = video.view;
  var splitterSize = SPLITTER_SIZE + 'px';
  var node = videoView.videoWrapper;
  var s = screen.width / videoBBox.width;
  var scale = 'scale(' + s + ', ' + s + ')';
  var origin = '0 0 0';
  
  video.model.updateScale( s );
  
  // Set transform on video frame
  node.style.webkitTransform = scale;
  node.style.MozTransform = scale;
  node.style.msTransform = scale;
  node.style.OTransform = scale;
  node.style.transform = scale;
  
  node.style.webkitTransformOrigin = origin;
  node.style.MozTransformOrigin = origin;
  node.style.msTransformOrigin = origin;
  node.style.OTransformOrigin = origin;
  node.style.transformOrigin = origin;
  
  // Set correct class
  this.node.classList.add( MODE_WITHOUT_RIGHT );
  
  // Set correct css width / height
  var width = ( videoBBox.width * s ) + 'px';
  var height = ( videoBBox.height * s + TOOLBAR_HEIGHT ) + 'px';
  
  this.sections.bottom.style.width = width;
  this.sections.right.style.width = 'calc(100% - ' + width + ' - ' + splitterSize + ')';
  this.sections.bottom.style.height = 'calc(100% - ' + height + ' - ' + splitterSize + ')';
  
  videoView.node.style.width = width;
  videoView.node.style.height = height;
  videoView.holder.style.width = width;
  videoView.holder.style.height = height;
  videoView.videoWrapper.style.width = videoBBox.width + 'px';
  videoView.videoWrapper.style.height = videoBBox.height + 'px';
};

var stretchVideoContainerForWindow_Height = function( videoBBox, video, screen ) {
  var videoView = video.view;
  var splitterSize = SPLITTER_SIZE + 'px';
  var node = videoView.videoWrapper;
  var s = ( screen.height - TOOLBAR_HEIGHT - HEADER_SECTION_HEIGHT ) / videoBBox.height;
  var scale = 'scale(' + s + ', ' + s + ')';
  var origin = '0 0 0';
  
  video.model.updateScale( s );
  
  // Set transform on video frame
  node.style.webkitTransform = scale;
  node.style.MozTransform = scale;
  node.style.msTransform = scale;
  node.style.OTransform = scale;
  node.style.transform = scale;
  
  node.style.webkitTransformOrigin = origin;
  node.style.MozTransformOrigin = origin;
  node.style.msTransformOrigin = origin;
  node.style.OTransformOrigin = origin;
  node.style.transformOrigin = origin;
  
  // Set correct class
  this.node.classList.add( MODE_WITHOUT_BOTTOM );
  
  // Set correct css width / height
  var width = Math.max( videoBBox.width * s, VIDEO_MIN_WIDTH ) + 'px';
  var height = ( videoBBox.height * s + TOOLBAR_HEIGHT  ) + 'px';
  
  this.sections.bottom.style.width = width;
  this.sections.right.style.width = 'calc(100% - ' + width + ' - ' + splitterSize + ')';
  this.sections.bottom.style.height = 'calc(100% - ' + height + ' - ' + splitterSize + ')';
  
  videoView.node.style.width = width;
  videoView.node.style.height = height;
  videoView.holder.style.width = width;
  videoView.holder.style.height = height;
  videoView.videoWrapper.style.width = Math.max( videoBBox.width, VIDEO_MIN_WIDTH / s ) + 'px';
  videoView.videoWrapper.style.height = videoBBox.height + 'px';
};

var hideSection_Right = function() {
  this.node.classList.add( MODE_WITHOUT_RIGHT );
};

var hideSection_Bottom = function() {
  this.node.classList.add( MODE_WITHOUT_BOTTOM );
};

var getBBoxFor = function( node ) {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
};

// View constructor
var View = function( config, model ) {
  this.holder = document.body || document.querySelector( 'body' );
  this.node = template.querySelector( 'div' ).cloneNode( true );

  this.sections = {
    'header'  : this.node.querySelector( '.tracker > .section-h' ),
    'video'   : this.node.querySelector( '.tracker > .section-l > .section-t' ),
    'right'   : this.node.querySelector( '.tracker > .section-r' ),
    'rightT'  : this.node.querySelector( '.tracker > .section-r > .section-t' ),
    'rightB'  : this.node.querySelector( '.tracker > .section-r > .section-b' ),
    'bottom'  : this.node.querySelector( '.tracker > .section-l > .section-b' ),
    'bottomL' : this.node.querySelector( '.tracker > .section-l > .section-b > .section-l' ),
    'bottomR' : this.node.querySelector( '.tracker > .section-l > .section-b > .section-r' )
  };
  
  this.splitter = {
    'LR'      : this.node.querySelector( '.tracker > .splitter.vertical' ),
    'L_TB'    : this.node.querySelector( '.tracker > .section-l > .splitter.horizontal' ),
    'R_TB'    : this.node.querySelector( '.tracker > .section-r > .splitter.horizontal' ),
    'L_B_LR'  : this.node.querySelector( '.tracker > .section-l > .section-b > .splitter.vertical' )
  };
  
  this.mainChilds = [
    this.node.querySelector( '.tracker > .section-h' ),
    this.node.querySelector( '.tracker > .section-r' ),
    this.node.querySelector( '.tracker > .section-l' ),
    this.node.querySelector( '.tracker > .splitter.vertical' )
  ];

  this.panels = [];
  
  // Adjust sections sizes according to its visibility and video section sizes
  updateSectionsView.call( this, config, model );
  
  // Create panels
  createSectionsView.call( this, config, model );
};

View.prototype.draw = function() {
  this.holder.appendChild( this.node );
};

View.prototype.hide = function() {
  for ( var i = this.mainChilds.length; i--; ) {
    this.mainChilds[ i ].style.display = 'none';
  }
};

View.prototype.show = function() {
  for ( var i = this.mainChilds.length; i--; ) {
    this.mainChilds[ i ].style.display = '';
  }
};

View.prototype.updateLayout = function( config, model, video, screen ) {
  // Remove layout classes
  video.model.clearScale();
  clearAllSpecifiedLayouts.call( this, video.view );
  
  // Update sections view
  updateSectionsView.call( this, config, model );
  
  // Get bbox model of left and right sections
  var bboxSR = getBBoxFor( this.sections.right );
  var bboxSB = getBBoxFor( this.sections.bottom );
  
  // Check, if video can be fully placed on screen by width
  if ( model.video.bbox.width > screen.width ) {
    stretchVideoContainerForWindow_Width.call( this, model.video.bbox, video, screen );
  }
  
  // Check, if video can be fully placed on screen by height
  if ( model.video.bbox.height + TOOLBAR_HEIGHT + HEADER_SECTION_HEIGHT > screen.height ) {
    stretchVideoContainerForWindow_Height.call( this, model.video.bbox, video, screen );
  }
  
  // Check, if sufficient space for right section
  if ( bboxSR.width < FRAME_MIN_WIDTH ) {
    hideSection_Right.call( this );
  }
  
  // Check, if sufficient space for bottom section
  if ( bboxSB.height < FRAME_MIN_HEIGHT ) {
    hideSection_Bottom.call( this );
  }
};

module.exports = View;