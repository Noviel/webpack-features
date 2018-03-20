export default (
  env,
  { inline = false, experimental = false },
  { plugins = [], next }
) => {
  const result = {
    module: {
      rules: [
        {
          test: /\.wasm$/,
        },
      ],
    },
  };

  // override Webpack default type
  if (!experimental) {
    result.module.rules[0].type = 'javascript/auto';
    result.module.rules[0].use = {
      loader: require.resolve('./awasm-loader'),
      options: {
        inline,
      },
    };
  }

  return next(env, plugins, result);
};
