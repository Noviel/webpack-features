const { react } = require('../../../dist');

module.exports = react({
  cssPreprocessors: ['scss'],
  emotion: true,
  production: true,
});
