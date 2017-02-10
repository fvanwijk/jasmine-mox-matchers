const path = require('path');
const webpack = require('webpack');

const params = {
  production: {
    output: 'jasmine-mox-matchers.min',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        include: /\.min\.js$/,
        compress: { warnings: false }
      })
    ]
  },
  development: {
    output: 'jasmine-mox-matchers',
    devtool: 'inline-source-map'
  }
};

function getConfig(env) {
  return {
    entry: {
      [params[env].output]: path.join(__dirname, '/src/jasmine-mox-matchers.js')
    },
    devtool: params[env].devtool,
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      library: 'jasmineMoxMatchers',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/
        }
      ]
    },
    plugins: params[env].plugins
  };
}

module.exports = [
  getConfig('development'),
  getConfig('production')
];
