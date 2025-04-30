const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './js/app.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Hinzugefügt: Korrekter publicPath für Source-Maps
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'css', to: 'css' },
        { from: 'fonts', to: 'fonts', noErrorOnMissing: true },
        { from: 'img', to: 'img', noErrorOnMissing: true }, // Hinzugefügt: Bilder kopieren
        { from: 'icon.png', to: '.', noErrorOnMissing: true },
        { from: 'favicon.ico', to: '.', noErrorOnMissing: true },
        { from: 'icon.svg', to: '.', noErrorOnMissing: true },
        { from: 'site.webmanifest', to: '.', noErrorOnMissing: true }
      ]
    })
  ]
};
