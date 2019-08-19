import * as React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Registry, TypelessContext } from 'typeless';

export function render(
  factory: React.FC,
  registry = new Registry(),
  container = document.createElement('div'),
) {
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(
      <TypelessContext.Provider value={{ registry }}>
        {React.createElement(factory)}
      </TypelessContext.Provider>,
      container,
    );
  });
}
