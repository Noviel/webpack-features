import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import './global.css';
import Worker from './web.worker.js';
import TSWorker from './ts.web.worker.ts';

import { getContainer } from './lib.ts';

import('./async').then(module => module.default(42));

const worker = new Worker();

worker.postMessage({ data: [2, 2, 3, 4, 5, 7] });

worker.addEventListener('message', function(event) {
  console.log(`Got answer from WebWorker: ${event.data}`);
});

const tsworker = new TSWorker();

tsworker.postMessage({ data: [2, 2, 3, 4, 5, 7] });

tsworker.addEventListener('message', function(event) {
  console.log(`Got answer from TSWebWorker: ${event.data}`);
});

render(<App />, getContainer('app'));
