const fs = require('fs');
const { react } = require('../../../dist');

const root = fs.realpathSync(process.cwd());

module.exports = react(
  {
    rootPath: root,
    cssPreprocessors: ['scss'],
    emotion: true,
    production: true,
    types: 'typescript',
    wasm: true,
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
