export default ({ extractStatic = false } = {}) => (
  { target, production },
  result
) => {
  const babelLoaders = result.module.rules[0].use.filter(
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

  return result;
};
