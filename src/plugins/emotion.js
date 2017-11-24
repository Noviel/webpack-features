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

export default ({ extractStatic = false }: Options = {}) => (
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
      },
    ]);
  }

  return input;
};
