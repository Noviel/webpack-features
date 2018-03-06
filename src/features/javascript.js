import createBabelEnvPresetOptions from '../lib/babelEnvPresetOptions';

import { includeExclude } from '../lib/regexp';

const syntaxExtendPlugins = [
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-decorators',
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  '@babel/plugin-syntax-dynamic-import',
];

const createPresetsList = ({ env, react, flow }) =>
  []
    .concat(
      env ? [['@babel/preset-env', createBabelEnvPresetOptions(env)]] : []
    )
    .concat(react ? '@babel/preset-react' : [])
    .concat(flow ? '@babel/preset-flow' : []);

/* eslint-disable no-useless-escape */
export const createTestRegExp = exclude =>
  includeExclude(`\.worker`, `\.jsx?`, exclude);
/* eslint-enable no-useless-escape */

export default (
  env,
  {
    eslint = true,
    flow = true,
    modules = false,
    react = true,
    webWorkers = true,
    syntaxExtend = true,
    hot = !env.production && env.target.name === 'browsers',
    babelPlugins = [],
    exclude = /node_modules/,
  } = {},
  { plugins = [], next }
) => {
  const { target } = env;

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      presets: createPresetsList({
        env: { target, modules },
        react,
        flow,
      }),
      plugins: []
        .concat(hot && react ? 'react-hot-loader/babel' : [])
        .concat(syntaxExtend ? syntaxExtendPlugins : [])
        .concat(babelPlugins)
        .concat(hot && react ? '@babel/transform-classes' : [])
        .concat(hot && react ? '@babel/transform-react-jsx-source' : []),
    },
  };

  const eslintLoader = {
    loader: 'eslint-loader',
    options: typeof eslint === 'object' ? eslint : {},
  };

  const rules = [
    {
      test: webWorkers ? createTestRegExp(true) : /\.jsx?/,
      exclude,
      use: [].concat(babelLoader).concat(eslint ? eslintLoader : []),
    },
  ];

  if (webWorkers) {
    rules.unshift({
      test: createTestRegExp(false),
      exclude,
      use: {
        loader: 'worker-loader',
        options: {
          inline: !env.production,
          publicPath: env.publicPath,
          name: `[name].[hash].js`,
        },
      },
    });
  }

  return next(env, plugins, { module: { rules } });
};
