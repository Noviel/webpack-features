const { presetReact } = require('../../../dist');
const config = require('./common');

module.exports = presetReact({
  ...config,
  ...config.react,
  production: false,
  indexHtml: './index.html',
});
