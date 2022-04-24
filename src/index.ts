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
  defaultChainId: 1,
  infuraId: '',
  rpcUrls: {
    ethereum: {
      mainnet: '',
    }
  },
  bcnmyApiKeys: {
    avalanche: '',
    ethereum: '',
    polygon: ''
  },
  swapApiBaseUrl: 'https://api.1inch.io/v4.0',
  style: {},
  targetId: 'cross-chain-swap-widget'
};

// main entry point - calls loader and render Preact app into supplied element
loader(
  window,
  defaultConfig,
  window.document.currentScript,
  (el, config) => render(h(App, { ...config, element: el }), el));
