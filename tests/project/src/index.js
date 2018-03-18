import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import './global.css';
import Worker from './web.worker.js';

import { getContainer } from './lib.ts';

import('./async').then(module => module.default(42));

const worker = new Worker();

worker.postMessage({ data: [2, 2, 3, 4, 5, 7] });

worker.addEventListener('message', function(event) {
  console.log(`Got answer from WebWorker: ${event.data}`);
});

render(<App />, getContainer('app'));
