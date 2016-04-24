var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    'app': './app/app.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: 'dist/'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        // activate source maps via loader query
        'css?sourceMap!autoprefixer-loader!' +
        'sass?sourceMap'
      )
    }, {
      loader: "babel-loader",

      // Skip any files outside of your project's `src` directory
      include: [
        path.resolve(__dirname, "app"),
      ],

      // Only run `.js` and `.jsx` files through Babel
      test: /\.jsx?$/,

      // Options to configure babel with
      query: {
        // plugins: ['transform-runtime'],
        presets: ['es2015', 'react'],
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        // activate source maps via loader query
        'css?sourceMap!autoprefixer-loader'
      )
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=25000'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new ExtractTextPlugin('[name].css'),
    new webpack.ProvidePlugin({
      "React": "react",
    })
    // new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  }
}