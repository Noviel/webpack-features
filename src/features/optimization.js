export default (
  env,
  {
    minimize = env.production && env.target.name === 'browsers',
    split = minimize,
  } = {}
) => {
  const optimization = {
    minimize,
  };

  if (split) {
    optimization.runtimeChunk = { name: 'runtime' };
    optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        commons: {
          test: /\.jsx?$/,
          chunks: 'all',
          minChunks: 2,
          name: 'common',
          enforce: true,
        },
      },
    };
  }

  return { optimization };
};
