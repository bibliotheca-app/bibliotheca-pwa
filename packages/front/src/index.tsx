import { register } from 'bibliotheca/serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import { startHmr, Hmr, DefaultTypelessProvider } from 'typeless';

const MOUNT_NODE = document.getElementById('app');

if (!MOUNT_NODE) {
  throw new Error('<div id="app" /> not found');
}

const render = () => {
  const App = require('./bibliotheca/components/App').App;
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  ReactDOM.render(
    <Hmr>
      <DefaultTypelessProvider>
        <App />
      </DefaultTypelessProvider>
    </Hmr>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  module.hot.accept('./bibliotheca/components/App', () => {
    startHmr();
    render();
  });
}
render();
register({});
