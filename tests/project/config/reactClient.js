const { presetReact } = require('../../../dist');

module.exports = presetReact({
  cssPreprocessors: ['scss'],
  emotion: true,
  production: true,
});
