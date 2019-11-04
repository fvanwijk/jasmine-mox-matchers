const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const params = {
  production: {
    mode: 'production',
    output: 'jasmine-mox-matchers.min',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          include: /\.min\.js$/
        })
      ]
    }
  },
  development: {
    mode: 'development',
    output: 'jasmine-mox-matchers',
    devtool: 'inline-source-map'
  }
};

function getConfig(env) {
  return {
    mode: params[env].mode,
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
      rules: [
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

module.exports = [getConfig('development'), getConfig('production')];
