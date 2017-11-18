export default (env, { limit = 10000, name, ...rest } = {}) => {
  if (!name) {
    if (env.production) {
      name = 'media/[name].[hash:8].[ext]';
    } else {
      name = '[name].[ext]';
    }
  }

  const rules = [
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: {
        loader: 'url-loader',
        options: {
          publicPath: env.publicPath,
          limit,
          name,
          emitFile: env.target.name === 'browsers',
          ...rest,
        },
      },
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: env.publicPath,
          limit,
          name,
          emitFile: env.target.name === 'browsers',
          ...rest,
        },
      },
    },
  ];

  return { module: { rules } };
};
