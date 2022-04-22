import { h, createContext, ComponentChildren } from 'preact';
import { Configurations } from '../models';
import { useContext, useState } from 'preact/hooks';
import WalletProviderProvider from './WalletProvider';
import SwapProvider from './Swap';

interface IThemeContext {
  themeMode: 'dark' | 'light';
  setThemeMode: (value: 'dark' | 'light') => void;
}

const ConfigContext = createContext<Configurations>({} as Configurations);
const ThemeContext = createContext<IThemeContext | null>(null);

interface Props {
  children: ComponentChildren;
  config: Configurations;
}

export const WidgetProviders = ({ children, config }: Props) => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');
  if (config.style.themeMode) {
    setThemeMode(config.style.themeMode)
  }
  return (
    <ConfigContext.Provider value={config}>
      <ThemeContext.Provider value={{ themeMode, setThemeMode}}>
        <WalletProviderProvider>
          <SwapProvider>
            {children}
          </SwapProvider>
        </WalletProviderProvider>
      </ThemeContext.Provider>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
export const useTheme = () => useContext(ThemeContext);