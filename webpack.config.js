var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var ENV = process.env.NODE_ENV;
var isProd = ENV === 'prod';

module.exports = function makeWebpackConfig() {
  var config = {};
  var plugins = [];
  var outputFileName = 'vue-image-compare';

  if (isProd) {
    outputFileName += '.min.js';
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    );
  } else {
    outputFileName += '.js';
  }

  var config = {
    entry: './src/index.js',
    output: {
      path: './dist/',
      filename: outputFileName,
      library: 'VueImageCompare',
      libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
      extensions: [
        '.vue',
        '.js'
      ]
    },
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue'
        },
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        }
      ]
    },
    plugins: plugins.concat([
      new webpack.LoaderOptionsPlugin({
        vue: {
          postcss: [
            autoprefixer({
              browsers: ['last 2 versions', 'ie >= 10']
            })
          ],
          loaders: {
            scss: 'vue-style!css!sass'
          }
        }
      })
    ])
  };

  return config;
}();
