import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';
import './global.css';
import Worker from './web.worker.js';

import('./async').then(module => module.default(42));

const worker = new Worker();

worker.postMessage({ data: [2, 2, 3, 4, 5, 7] });

worker.addEventListener('message', function(event) {
  console.log(`Got answer from WebWorker: ${event.data}`);
});

const hotRender = () =>
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('app')
  );

module.hot &&
  module.hot.accept('./components/App', () => {
    hotRender();
  });

render(<App />, document.getElementById('app'));
