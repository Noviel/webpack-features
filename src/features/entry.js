const builtinEntries = {
  hotMiddleware: 'webpack-hot-middleware/client',
  polyfill: '@babel/polyfill',
};

export default (
  { target, production },
  {
    entries,
    polyfill = target.name === 'browsers' && target.value === 'legacy',
    hotMiddleware = false,
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
        .concat(hotMiddleware ? builtinEntries.hotMiddleware : [])
        .concat(entries[curr]);

      return acc;
    }, {}),
  };
};
