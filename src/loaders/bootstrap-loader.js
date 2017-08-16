export default function (configFile, env = {}, replacer) {
  if (typeof configFile !== 'string') {
    throw new Error('configFile must be a string. ' +
    `Instead got ${typeof configFile}`);
  }

  const { production = true } = env;
  const loader = `bootstrap-loader/lib/bootstrap.loader?` + 
    `${production ? 'extractStyles&' : ''}` +
    `configFilePath=${configFile}` +
    `!bootstrap-loader/no-op.js`;

  if (typeof replacer === 'function') {
    return replacer(loader, env);
  }

  return loader;
}
