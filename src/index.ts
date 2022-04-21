import { h, render } from 'preact';
import { App } from './App';
import loader from './utils/loader';
import { Configurations } from './models';

/**
 * Default configurations that are overridden by
 * parameters in embedded script.
 */
const defaultConfig: Configurations = {
  debug: false,
  infuraId: '',
  rpcUrls: {
    ethereum: {
      mainnet: '',
      rinkeby: '',
    }
  },
  dodoRouterApiUrl: 'https://route-api.dodoex.io/dodoapi',
  style: {},
  targetId: 'cross-chain-swap-widget'
};

// main entry point - calls loader and render Preact app into supplied element
loader(
  window,
  defaultConfig,
  window.document.currentScript,
  (el, config) => render(h(App, { ...config, element: el }), el));
