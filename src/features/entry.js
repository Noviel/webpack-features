const builtinEntries = {
  hot: {
    express: 'webpack-hot-middleware/client',
    react: 'react-hot-loader/patch',
  },
  polyfill: '@babel/polyfill',
};

export default (
  { target, production },
  {
    entries,
    polyfill = target.name === 'browsers' && target.value === 'legacy',
    hot = !production && target.name === 'browsers',
    react = true,
    express = false,
  } = {}
) => {
  if (Array.isArray(entries) || typeof entries === 'string') {
    entries = {
      index: entries,
    };
  } else if (!entries || typeof entries !== 'object') {
    throw new Error(`'entries' should be an object, an array or a string`);
  }

  return {
    entry: Object.keys(entries).reduce((acc, curr) => {
      acc[curr] = []
        .concat(polyfill ? builtinEntries.polyfill : [])
        .concat(hot && react ? builtinEntries.hot.react : [])
        .concat(hot && express ? builtinEntries.hot.express : [])
        .concat(entries[curr]);

      return acc;
    }, {}),
  };
};
