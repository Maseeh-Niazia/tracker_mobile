'use strict';

// Dependency
var path = require( 'path' );
var webpack = require( 'webpack' );

// Private methods
var getApplicationName = function( src ) {
  console.log( src )
  console.log( '!!!!! >> ', src.split( '\/' )[ 4 ] );
  return src.split( '\/' )[ 4 ];
};

// Public register task method
module.exports = function( ops ) {
  var plugins = [], regExp;
  
  // Build plugin options, need to ignore other apps dynamic requires
  if ( ops.params && ops.params.exclude ) {
    regExp = ops.params.exclude( getApplicationName( ops.src ) );
  }

  if ( regExp ) {
    plugins.push( new webpack.IgnorePlugin( regExp ) );
  } else
  if ( ops.regExp ) {
    plugins.push( new webpack.IgnorePlugin( ops.regExp ) );
  }

  // Return new config
  return {
    cache: true,
    entry: ops.entry,
    output: {
      path: path.resolve( __dirname, '../build' ),
      filename: '[name].js'
    },
    externals: {
    },
    resolve: {
      root: 'src',
      extensions: [ '', '.js' ]
    },
    warnings: false,
    plugins: plugins,
    module: {
      loaders: [
        {
          test: /\.css\.svg$/,
          loader: 'url?limit=100000&mimetype=image/svg+xml'
        },
        {
          test: /\.jpg$/,
          loader: 'url?limit=100000&mimetype=image/jpeg'
        },
        {
          test: /\.woff$/,
          loader: 'url?limit=100000&mimetype=application/x-font-woff'
        },
        {
          test: /\.gif$/,
          loader: 'url?limit=100000&mimetype=image/gif'
        },
        {
          test: /^((?!css\.svg).)*(\.svg)$|\.html$/,
          loader: 'raw'
        },
        {
          test: /\.less$|\.css$/,
          loader: 'style!css!less'
        }
      ]
    }
  };
};