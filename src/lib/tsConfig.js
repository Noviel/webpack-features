import path from 'path';

export const tsConfigFile = (type = 'migration') =>
  path.resolve(__dirname, `../../${type}.tsconfig.json`);
