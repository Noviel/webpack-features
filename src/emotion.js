export default ({ target, production }, { extractStatic } = {}, state) => {
  const babelLoaders = state.loaders(({ loader }) => loader === 'babel-loader');

  for (const loader of babelLoaders) {
    loader.options.plugins.unshift([
      'emotion',
      {
        extractStatic:
          extractStatic !== undefined
            ? extractStatic
            : target.browsers && production,
      },
    ]);
  }
};
