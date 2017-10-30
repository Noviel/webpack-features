export default (
  { target, production },
  { extractStatic = false } = {},
  state
) => {
  const babelLoaders = state.loaders(({ loader }) => loader === 'babel-loader');

  for (const loader of babelLoaders) {
    loader.options.plugins.unshift([
      'emotion',
      {
        extractStatic,
      },
    ]);
  }
};
