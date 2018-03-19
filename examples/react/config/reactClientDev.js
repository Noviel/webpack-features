const fs = require('fs');

const root = fs.realpathSync(process.cwd());

//const { resolve } = require('path');
const { react } = require('../../../dist');

module.exports = react(
  {
    rootPath: root,
    cssPreprocessors: ['scss'],
    emotion: true,
    production: false,
    indexHtml: 'index.html',
    types: 'typescript',
  },
  {
    javascript: {
      tsOptions: {
        configFile: '../../../migration.tsconfig.json',
      },
    },
  }
);
