const path = require('path');
const fs = require('fs');

const data = `// @flow
export * from '../src';
`;

fs.writeFileSync(
  path.resolve(process.cwd(), './dist/index.js.flow'),
  data,
  'utf8'
);
