const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // Geändert von inline-source-map zu eval-source-map
  devServer: {
    static: './dist',
    hot: true
  }
});
