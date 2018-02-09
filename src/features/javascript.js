import createBabelEnvPresetOptions from '../lib/babelEnvPresetOptions';

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

export default (
  env,
  {
    eslint = true,
    flow = true,
    modules = false,
    react = true,
    syntaxExtend = true,
    hot = !env.production && env.target.name === 'browsers',
    babelPlugins = [],
    exclude = /node_modules/,
  } = {},
  { plugins = [], next }
) => {
  const { target } = env;
  const rules = [
    {
      test: /\.jsx?$/,
      exclude,

      use: []
        .concat({
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
        })
        .concat(
          eslint
            ? {
                loader: 'eslint-loader',
                options: typeof eslint === 'object' ? eslint : {},
              }
            : []
        ),
    },
  ];

  return next(env, plugins, { module: { rules } });
};
