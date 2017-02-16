'use strict';

// Dependency model
var Video = require( './video' );
var Matrix = require( './matrix' );

// Dependency Tools
var Axes = require( './tools/axes' );
var Tape = require( './tools/tape' );
var Protractor = require( './tools/protractor' );

// Dependency objects
var Element = {
  'point': require( './objects/point' ),
  'vector': require( './objects/vector' ),
  'point-model': require( './objects/point-model' ),
  'point-place': require( './objects/point-place' ),
  'point-center-of-mass': require( './objects/point-center-of-mass' )
};
var ElementModelDefault = require( './objects/point-model-default' );

// Private methods
var createObjects = function( objects, dt, frameStart ) {
  for ( var element, i = 0, l = objects.length; i < l; i++ ) {
    element = new Element[ objects[ i ].type ]( objects[ i ], this.matrix, dt, frameStart );
    this.objects.push( element );
  }
  
  this.objects.find = findObject;
};

var findObject = function( name ) {
  var object = null, i;
  
  for ( i = this.length; i--; ) {
    if ( this[ i ].name === name ) {
      object = this[ i ];
      break;
    }
  }
  
  return object;
};

// Model constructor 
var Model = function( config, model ) {
  // Name of application
  this.name = config.application.name;
  
  // Basic tools
  this.axis = new Axes( model.axis || {} );
  this.tape = new Tape( model.tape || {} );
  this.protractor = new Protractor( model.protractor || {} );
  
  // Video model
  this.video = new Video( model.video );
  
  //  Matrix model
  this.matrix = new Matrix( model.matrix );
  
  // List of all objects
  this.objects = [];
  
  // Create model of all objects
  createObjects.call( this, model.objects, this.video.frameStep, this.video.frameStart );
};

Model.prototype.createNewParticalModelAnalytic = function() {
  var model = new ElementModelDefault( this.video.frameStart, this.video.frames.length - 1 );
  var Point = Element[ model.type ];
  var object = new Point( model, this.matrix, this.video.frameStep, this.video.frameStart, Point.ANALYTIC );

  this.objects.push( object );

  return object;
};

Model.prototype.createNewParticalModelDynamic = function() {
  var model = new ElementModelDefault( this.video.frameStart, this.video.frames.length - 1 );
  var Point = Element[ model.type ];

  var object = new Point( model, this.matrix, this.video.frameStep, this.video.frameStart, Point.DYNAMIC );

  this.objects.push( object );

  return object;
};

Model.prototype.createPointCenterOfMass = function( name, points, color ) {
  var elements = [], i;
  
  for ( i = points.length; i--; ) {
    elements.push( this.objects.find( points[ i ] ) );
  }
  
  var point = new Element[ 'point-center-of-mass' ]( name, elements, this.matrix, this.video.frameStep, color );
  
  this.objects.push( point );
  
  return point;
};

Model.prototype.axisChangeOrigin = function( ops ) {
  var dx = this.matrix.x0 - ops.xorigin;
  var dy = this.matrix.y0 - ops.yorigin;
  var v = this.matrix.getModelVector( dx, dy )
  
  this.matrix.x0 = ops.xorigin;
  this.matrix.y0 = ops.yorigin;
  
  for ( var i = this.objects.length; i--; ) {
    this.objects[ i ].axisChangeOrigin( v.dx, v.dy );
  }
};

module.exports = Model;