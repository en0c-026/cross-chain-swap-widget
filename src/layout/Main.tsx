import { h } from 'preact';
import { Router, RouteComponent } from './Router';
import { Grommet } from 'grommet';
import { theme } from '../constants';
import HyphenBridge from '../routes/HyphenBridge';
import { useConfig, useTheme } from '../context';
import OneInchTrade from '../routes/OneInchTrade';
import Container from '../components/Container';
import AccountManager from '../components/AccountManager';
import { useSwap } from '../context/Swap';

const Main = () => {
  const { style: { mainContainer } } = useConfig();
  const { themeMode } = useTheme()!;
  const swapProvider = useSwap();
  return (
    <Grommet theme={theme} themeMode={themeMode}>
      <Container
        style={{
          align: mainContainer?.align ? mainContainer.align : 'center',
          alignContent: mainContainer?.alignContent,
          alignSelf: mainContainer?.alignSelf,
          background: mainContainer?.background ? mainContainer.background : 'c1',
          border: mainContainer?.border ? mainContainer.border : true,
          direction: mainContainer?.direction,
          elevation: mainContainer?.elevation,
          fill: mainContainer?.fill,
          flex: mainContainer?.flex,
          gap: mainContainer?.gap ? mainContainer.gap : 'small',
          height: mainContainer?.height,
          justify: mainContainer?.justify,
          margin: mainContainer?.margin,
          pad: mainContainer?.pad ? mainContainer.pad : 'medium',
          responsive: mainContainer?.responsive,
          round: mainContainer?.round ? mainContainer.round : 'medium',
          width: mainContainer?.width ? mainContainer.width : { max: 'large' }
        }}
      >
        <button onClick={() => {
           console.log(swapProvider)
          // swapApi.healthCheck().then(resp => console.log(resp))
          // swapApi.getSpenderApprove().then(resp => console.log(resp))
          // swapApi.getApproveData({
          //   tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          //   amount: '1000000000'
          // }).then(resp => console.log(resp))
          // swapApi.getAllowanceAmount({
          //   tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          //   walletAddress: '0xa5Cf4DDFe4BfDbE712bD2f54EAadaCebb809fAED'
          // })
          // swapApi.getLiquiditySources().then(resp => console.log(resp))
          // swapApi.getTokenList().then(resp => console.log(Object.values(resp.tokens)))
          // swapApi.getPresets().then(resp => console.log(resp))
          // swapApi.getBestQuote({
          //   fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          //   toTokenAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
          //   amount: '10000000000000000'
          // }).then(resp => console.log(resp))

          // swapApi.getSwapData({
          //   fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          //   toTokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          //   amount: '1000000000000000000',
          //   fromAddress: '0xeC30d02f10353f8EFC9601371f56e808751f396F',
          //   slippage: 1
          // }).then(resp => console.log(resp))
        }}>
          console healthcheck
        </button>
        <AccountManager />
        <Router
          routes={{
            '/': <RouteComponent component={HyphenBridge} />,
            '/1inch-trade': <RouteComponent component={OneInchTrade} />
          }} />
      </Container>
    </Grommet>
  );
};

export default Main;
