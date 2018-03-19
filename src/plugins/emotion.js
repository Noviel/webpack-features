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
    // ensure that rule.use is an array
    if (rule.use.filter) {
      const babelLoaders = rule.use.filter(
        ({ loader }) => loader === 'babel-loader'
      );
      // iterate through every babel-loader
      for (const loader of babelLoaders) {
        // add emotion plugin if one is not defined already
        if (
          !loader.options.plugins.filter(
            p => p === 'emotion' || (p && p[0] === 'emotion')
          ).length
        ) {
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
  }

  return input;
};
