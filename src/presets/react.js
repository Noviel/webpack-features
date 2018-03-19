import base from './base';

module.exports = (
  presetOptions = {},
  featureOptions = {},
  webpackOptions = {}
) =>
  base(
    {
      ...presetOptions,
      frameworks: ['react'],
    },
    featureOptions,
    webpackOptions
  );
