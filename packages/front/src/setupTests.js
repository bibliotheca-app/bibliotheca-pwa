const registerRequireContextHook = require('babel-plugin-require-context-hook/register');

registerRequireContextHook();

const noop = () => {};
Object.defineProperty(window, 'scroll', { value: noop, writable: true });

export {}
