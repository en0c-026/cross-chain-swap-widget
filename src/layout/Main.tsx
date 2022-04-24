import { h } from 'preact';
import { Router, RouteComponent } from './Router';
import { Grommet } from 'grommet';
import { theme } from '../constants';
import HyphenBridge from '../routes/HyphenBridge';
import { useConfig, useTheme } from '../context';
import OneInchTrade from '../routes/OneInchTrade';
import Container from '../components/Container';
import AccountManager from '../components/AccountManager';
import SwapSettings from '../routes/SwapSettings';
import { useWalletProvider } from '../context/WalletProvider';
import ChainSelector from '../components/selectors/ChainSelector';
import ThemeSelector from '../components/selectors/ThemeSelector';


const Main = () => {
  const { style: { mainContainer } } = useConfig();
  const { themeMode, setThemeMode } = useTheme()!;
  const { chainsSupported, currentChain, switchChain } = useWalletProvider()!;
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
          pad: mainContainer?.pad ? mainContainer.pad : 'small',
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
              <ChainSelector
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
            '/': <RouteComponent component={HyphenBridge} />,
            '/1inch-trade': <RouteComponent component={OneInchTrade} />,
            '/swap-settings': <RouteComponent component={SwapSettings} />
          }} />
      </Container>
    </Grommet>
  );
};

export default Main;
