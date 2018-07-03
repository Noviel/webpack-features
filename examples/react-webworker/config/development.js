const fs = require('fs');
const { react } = require('../../../dist');

const root = fs.realpathSync(process.cwd());

module.exports = react(
  {
    debug: true,
    rootPath: root,
    cssPreprocessors: ['scss'],
    emotion: true,
    production: false,
    indexHtml: 'index.html',
    types: 'typescript',
    wasm: 'builtin',
    babelPolyfill: 'usage',
  },
  {
    javascript: {
      eslint: true,
      tsOptions: {
        configFile: '../../../migration.tsconfig.json',
      },
    },
  }
);
