import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Configurations } from '../models';
import { NotificationsProvider } from './common/Notification';
import WalletProviderProvider from './common/WalletProvider';
import { ApprovalProvider } from './swap/Approval';
import DexApiProvider from './swap/DexApi';
import { SwapProvider } from './swap/Swap';
import { TokensProvider } from './swap/Tokens';

interface IThemeContext {
  themeMode: 'dark' | 'light';
  setThemeMode: (value: 'dark' | 'light') => void;
}

const ConfigContext = createContext<Configurations>({} as Configurations);
const ThemeContext = createContext<IThemeContext | null>(null);

interface Props {
  children: ReactNode;
  config: Configurations;
}

export const WidgetProviders = ({ children, config }: Props) => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('light');

  if (config.style.themeMode) {
    setThemeMode(config.style.themeMode)
  }
  return (
    <ConfigContext.Provider value={config}>
      <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
        <WalletProviderProvider>
          <NotificationsProvider>
            <DexApiProvider>
              <TokensProvider>
                <ApprovalProvider>
                  <SwapProvider>
                    {children}
                  </SwapProvider>
                </ApprovalProvider>
              </TokensProvider>
            </DexApiProvider>
          </NotificationsProvider>
        </WalletProviderProvider>
      </ThemeContext.Provider>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
export const useTheme = () => useContext(ThemeContext);
