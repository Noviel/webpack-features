const { presetReact } = require('../../../dist');
const config = require('./common');

module.exports = presetReact({
  ...config,
  ...config.react,
  production: true,
  publicPath: './dist/',
  distPath: './static/dist/',
});
