// @flow
import type { Env } from '../lib/types';

type Options = {
  extractStatic?: boolean,
};

type Input = {
  module: {
    rules: any,
  },
};

export default ({ extractStatic = false, ...options }: Options = {}) => (
  { target, production }: Env,
  input: Input
) => {
  const babelLoaders = input.module.rules[0].use.filter(
    ({ loader }) => loader === 'babel-loader'
  );

  for (const loader of babelLoaders) {
    loader.options.plugins.unshift([
      'emotion',
      {
        extractStatic,
        hoist: production,
        sourceMap: !production,
        autoLabel: !production,
        ...options,
      },
    ]);
  }

  return input;
};
