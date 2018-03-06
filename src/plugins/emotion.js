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
  for (const rule of input.module.rules) {
    if (rule.use.filter) {
      const babelLoaders = rule.use.filter(
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
    }
  }

  return input;
};
