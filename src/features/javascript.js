import merge from 'deepmerge';

import createBabelEnvPresetOptions from '../lib/babelEnvPresetOptions';

import { includeExclude } from '../lib/regexp';
import { tsConfigFile } from '../lib/tsConfig';

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

export const createTestRegExp = exclude =>
  includeExclude(`\\.worker`, `\\.jsx?`, exclude);

export const createTestRegExpTS = exclude =>
  includeExclude(`\\.worker`, `\\.tsx?`, exclude);

export default (
  env,
  {
    eslint = true,
    flow = false,
    typescript = false,
    modules = false,
    react = false,
    webWorkers = true,
    syntaxExtend = true,
    polyfill = env.target.name === 'browsers' && env.target.value === 'legacy'
      ? 'entry'
      : false,
    hot = !env.production && env.target.name === 'browsers',
    babelPlugins = [],
    exclude = /node_modules/,
    tsOptions = {},
  } = {},
  { plugins = [], next }
) => {
  const { target } = env;

  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      presets: createPresetsList({
        env: { target, modules, polyfill },
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
    loader: require.resolve('eslint-loader'),
    options: typeof eslint === 'object' ? eslint : {},
  };

  if (typescript === true) {
    typescript = 'strict';
  }

  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: merge(
      {
        configFile: tsConfigFile(typescript),
      },
      tsOptions
    ),
  };

  const migrationTS = typescript === 'migration';

  const rules = [
    {
      test: webWorkers ? createTestRegExp(true) : /\.jsx?/,
      exclude,
      use: [].concat(babelLoader).concat(eslint ? eslintLoader : []),
    },
  ];

  if (typescript) {
    rules.push({
      test: webWorkers ? createTestRegExpTS(true) : /\.tsx?/,
      exclude,
      // use babel-loader only for `migration` mode
      // in `strict` mode should be used pure TypeScript
      use: [].concat(migrationTS ? babelLoader : []).concat(tsLoader),
    });
  }

  if (webWorkers) {
    const webWorkerLoader = {
      loader: require.resolve('worker-loader'),
      options: {
        inline: !env.production,
        publicPath: env.publicPath,
        name: `[name].[hash].js`,
      },
    };

    rules.unshift({
      test: createTestRegExp(false),
      exclude,
      use: webWorkerLoader,
    });
    if (typescript) {
      rules.unshift({
        test: createTestRegExpTS(false),
        exclude,
        use: [webWorkerLoader]
          .concat(migrationTS ? babelLoader : [])
          .concat(tsLoader),
      });
    }
  }

  const extensions = ['.js', '.jsx'].concat(typescript ? ['.ts', '.tsx'] : []);

  return next(env, plugins, {
    module: { rules },
    resolve: {
      extensions,
    },
  });
};
