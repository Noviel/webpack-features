import createBabelEnvPresetOptions from '../lib/babel-env-preset-options';

const syntaxExtendPlugins = [
  'transform-object-rest-spread',
  'transform-class-properties',
  'syntax-dynamic-import',
];

const createPresetsList = ({ env, react, flow }) =>
  []
    .concat(env ? [['env', createBabelEnvPresetOptions(env)]] : [])
    .concat(react ? 'react' : [])
    .concat(flow ? 'flow' : []);

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
  } = {},
  { plugins = [], next }
) => {
  const { target } = env;
  const rules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,

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
              .concat(hot && react ? 'transform-es2015-classes' : [])
              .concat(hot && react ? 'transform-react-jsx-source' : []),
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
