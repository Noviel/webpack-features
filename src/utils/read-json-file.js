import { readFileSync } from 'fs';

export default function readJSONFile(filename) {
  const content = readFileSync(filename, 'utf-8');
  let obj = {};
  try {
    obj = JSON.parse(content);
  } catch (err) {
    console.error(`Error: ${err}`);
  }

  return obj;
}
