//const { resolve } = require('path');
const { presetReact } = require('../../../dist');

module.exports = presetReact(
  {
    distPath: '/',
    cssPreprocessors: ['scss'],
    emotion: true,
    production: false,
    indexHtml: 'index.html',
  },
  {
    entry: {
      hot: true,
      express: false,
    },
  }
);
