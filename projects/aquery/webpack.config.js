const {  name } = require('./package');
const camelCase = require('lodash.camelcase');

const packageName = camelCase(name.replace('@ampify/plugin-', ''));

module.exports = {
  entry: {
    [packageName]: './src'
  },
  output: {
    library: 'aQuery',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'aquery.js'
  }
};
