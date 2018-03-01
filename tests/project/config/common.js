const { resolve } = require('path');

module.exports = {
  rootPath: resolve(__dirname, '..'),
  react: {
    entry: {
      index: './src/index.js',
    },
    template: './src/index.html',
    cssPreprocessors: ['scss'],
    emotion: true,
  },
};
