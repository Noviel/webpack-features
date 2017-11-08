import createBabelEnvPresetOptions from './babel-env-preset-options';

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

const createEslintLoader = options => ({
  loader: 'eslint-loader',
  options: typeof options === 'object' ? options : {},
});

const createBabelLoader = (
  { target, production },
  { modules, react, flow, plugins, syntaxExtend, hot }
) => ({
  loader: 'babel-loader',
  options: {
    babelrc: false,
    presets: createPresetsList({ env: { ...target, modules }, react, flow }),
    plugins: []
      .concat(hot && react ? 'react-hot-loader/babel' : [])
      .concat(syntaxExtend ? syntaxExtendPlugins : [])
      .concat(plugins)
      .concat(hot && react ? 'transform-es2015-classes' : [])
      .concat(hot && react ? 'transform-react-jsx-source' : []),
  },
});

module.exports = (
  { target, production },
  {
    eslint = true,
    flow = true,
    modules = false,
    react = true,
    syntaxExtend = true,
    hot = !production && !!target.browsers,
    plugins = [],
  } = {},
  state
) => {
  state.addRules({
    test: /\.jsx?$/,
    exclude: /node_modules/,

    use: []
      .concat(
        createBabelLoader(
          {
            target,
            production,
          },
          { modules, react, flow, plugins, syntaxExtend, hot }
        )
      )
      .concat(eslint ? createEslintLoader(eslint) : []),
  });
};
