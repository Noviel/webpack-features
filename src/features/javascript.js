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

export const createTestRegExpWithTS = exclude =>
  includeExclude(`\\.worker`, `\\.(j|t)sx?`, exclude);

export default (
  env,
  {
    eslint = true,
    flow = false,
    typescript = false,
    modules = false,
    react = true,
    webWorkers = true,
    syntaxExtend = true,
    hot = !env.production && env.target.name === 'browsers',
    babelPlugins = [],
    exclude = /node_modules/,
    tsOptions = {},
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

  const tsLoader = {
    loader: 'ts-loader',
    options: {
      configFile: tsConfigFile(typescript),
      ...tsOptions,
    },
  };

  const migrationTS = typescript === 'migration';
  const strictTS = typescript && !migrationTS;

  const testCreator = migrationTS ? createTestRegExpWithTS : createTestRegExp;
  const standardRegexp = migrationTS ? /\.jsx?/ : /\.(j|t)sx?/;

  const rules = [
    {
      test: webWorkers ? testCreator(true) : standardRegexp,
      exclude,
      use: []
        .concat(babelLoader)
        .concat(migrationTS ? tsLoader : [])
        .concat(eslint ? eslintLoader : []),
    },
  ];

  if (strictTS) {
    rules.push({
      test: /\.tsx?/,
      exclude,
      use: [].concat(tsLoader).concat(eslint ? eslintLoader : []),
    });
  }

  if (webWorkers) {
    rules.unshift({
      test: testCreator(false),
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

  const extensions = ['.js', '.jsx'].concat(typescript ? ['.ts', '.tsx'] : []);

  return next(env, plugins, {
    module: { rules },
    resolve: {
      extensions,
    },
  });
};
