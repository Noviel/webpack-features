import { getTargetValue } from './targets';

module.exports = ({ target, production }) => {
  const autoPrefixerOptions = target.value
    ? {
        [target.name]: getTargetValue(target),
      }
    : {};
  return {
    plugins: [require('precss'), require('autoprefixer')(autoPrefixerOptions)],
    sourceMap: !production,
  };
};

exports.default = module.exports;
