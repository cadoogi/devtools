const { name } = require('./package');

const packageName = name.replace(/\-(.)/g, ($, $1) => $1.toUpperCase());

module.exports = {
  entry: {
    [packageName]: './src'
  },
  output: {
    library: '[name]',
    libraryTarget: 'window',
    filename: '[name].js'
  }
};