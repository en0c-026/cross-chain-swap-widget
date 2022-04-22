import { h, createContext, ComponentChildren } from 'preact';
import { Configurations } from '../models';
import { useContext } from 'preact/hooks';
import WalletProviderProvider from './WalletProvider';
import SwapProvider from './Swap';

const ConfigContext = createContext<Configurations>({} as Configurations);

interface Props {
  children: ComponentChildren;
  config: Configurations;
}

export const WidgetProviders = ({ children, config }: Props) => {

  return (
    <ConfigContext.Provider value={config}>
      <WalletProviderProvider>
        <SwapProvider>
          {children}
        </SwapProvider>
      </WalletProviderProvider>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);