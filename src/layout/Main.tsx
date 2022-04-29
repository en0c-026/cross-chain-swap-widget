import React from 'react';
import { Router, RouteComponent } from './Router';
import { Grommet } from 'grommet';
import { theme } from '../constants';
import { useConfig, useTheme } from '../context';
import { useWalletProvider } from '../context/common/WalletProvider';
import { Bridge } from '../routes/Bridge';
import { Swap } from '../routes/Swap';
import Container from '../components/Container';
import { AccountManager } from '../components/common/AccountManager';
import { NetworkSelector } from '../components/common/NetworkSelector';
import { ThemeSelector } from '../components/common/ThemeSelector';
//import SwapSettings from '../routes/SwapSettings';


const Main = () => {
  const { style: { mainContainer } } = useConfig();
  const { themeMode, setThemeMode } = useTheme()!;
  const { chainsSupported, currentChain, switchChain, isLoggedIn } = useWalletProvider()!;
  return (
    <Grommet theme={theme} themeMode={themeMode}>
      <Container
        style={{
          align: mainContainer?.align,
          alignContent: mainContainer?.alignContent,
          alignSelf: mainContainer?.alignSelf,
          background: mainContainer?.background ? mainContainer.background : 'c1',
          border: mainContainer?.border ? mainContainer?.border : true,
          direction: mainContainer?.direction,
          elevation: mainContainer?.elevation ? mainContainer?.elevation : 'small',
          fill: mainContainer?.fill,
          focusIndicator: mainContainer?.focusIndicator,
          flex: mainContainer?.flex,
          gap: mainContainer?.gap ? mainContainer.gap : 'small',
          height: mainContainer?.height,
          justify: mainContainer?.justify,
          margin: mainContainer?.margin,
          pad: mainContainer?.pad ? mainContainer.pad : 'medium',
          responsive: mainContainer?.responsive,
          round: mainContainer?.round ? mainContainer.round : 'medium',
          width: mainContainer?.width ? mainContainer.width : { max: '450px' }
        }}
      >
        <Container
          style={{
            align: 'center',
            direction: 'row',
            justify: 'between'
          }}>
          <ThemeSelector
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />
          {
            currentChain &&
            (
              <NetworkSelector
                isLoggedIn={isLoggedIn}
                currentChain={currentChain}
                chainsSupported={chainsSupported}
                switchChain={switchChain}
              />
            )
          }
          <AccountManager />
        </Container>
        <Router
          routes={{
            '/': <RouteComponent component={Bridge} />,
            '/1inch-trade': <RouteComponent component={Swap} />,
          }} />
      </Container>
    </Grommet>
  );
};

export default Main;
