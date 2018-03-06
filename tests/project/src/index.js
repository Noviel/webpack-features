import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import './global.css';
/*eslint-disable import/no-webpack-loader-syntax */
import Worker from './web.worker.js';

const worker = new Worker();

worker.postMessage({ data: [1, 2, 3, 4, 5, 7] });

worker.addEventListener('message', function(event) {
  console.log(`Got answer from WebWorker: ${event.data}`);
});

render(<App />, document.getElementById('app'));
