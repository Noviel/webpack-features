const fs = require('fs');

const root = fs.realpathSync(process.cwd());

//const { resolve } = require('path');
const { presetReact } = require('../../../dist');

module.exports = presetReact({
  rootPath: root,
  cssPreprocessors: ['scss'],
  emotion: true,
  production: false,
  indexHtml: 'index.html',
});
