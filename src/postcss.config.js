import { getBrowsers } from './targets';

module.exports = ({ target, production }) => ({
  plugins: [
    require('precss'),
    require('autoprefixer')({
      browsers: getBrowsers(target.browsers) || '',
    }),
  ],
});

exports.default = module.exports;
