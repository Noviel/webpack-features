const hotReloadEntry = 'webpack-hot-middleware/client';
const reactHotEntry = 'react-hot-loader/patch';
const polyfillEntry = 'babel-polyfill';

export default (
  { target, production },
  entries,
  {
    polyfill = target.browsers === 'legacy',
    hot = !!(!production && target.browsers),
    react = true,
  } = {}
) => {
  const result = {};

  Object.keys(entries).forEach(v => {
    result[v] = []
      .concat(polyfill ? polyfillEntry : [])
      .concat(hot && react ? reactHotEntry : [])
      .concat(hot ? hotReloadEntry : [])
      .concat(entries[v]);
  });

  return result;
};
