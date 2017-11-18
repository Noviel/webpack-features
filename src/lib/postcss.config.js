import { getTargetValue } from './targets';

module.exports = ({ target, production }) => ({
  plugins: [
    require('precss'),
    require('autoprefixer')({
      browsers: getTargetValue(target),
    }),
  ],
  sourceMap: !production,
});

exports.default = module.exports;
