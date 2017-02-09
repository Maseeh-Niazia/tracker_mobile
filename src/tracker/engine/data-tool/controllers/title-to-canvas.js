'use strict';

module.exports = function( ctx, w, h, model ) {
  var textTemp = model.name + ' (' + model.x + ', ' + model.y + ')';
  var isSub = false;
  var label;
  var text;
  
  // Save context
  ctx.save();
  
  // Calc size
  var bbox = ctx.measureText( textTemp );
  var x =  w / 2 - bbox.width / 2;
  
  // Draw text
  text = model.name + ' (';
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText( text, x, 16 );

  x += ctx.measureText( text ).width;

  label = model.x.split( '_');
  
  text = label[ 0 ];
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText( text, x, 16 );

  x += ctx.measureText( text ).width;

  if ( label [ 1 ] ) {
    text = label[ 1 ];
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText( text, x, 20 );

    x += ctx.measureText( text ).width;
  }

  text = ', ';
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText( text, x, 16 );

  x += ctx.measureText( text ).width;

  label = model.y.split( '_');

  text = label[ 0 ];
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText( text, x, 16 );

  x += ctx.measureText( text ).width;

  if ( label [ 1 ] ) {
    text = label[ 1 ];
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText( text, x, 20 );

    x += ctx.measureText( text ).width;
  }

  text = ')';
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText( text, x, 16 );

  // Restore context
  ctx.restore();
};