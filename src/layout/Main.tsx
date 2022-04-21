import { h } from 'preact';
import { Router, RouteComponent } from './Router';
import { Grommet } from 'grommet';
import { theme } from '../constants';
import HyphenBridge from '../routes/HyphenBridge';
import { useConfig } from '../context';
import DodoTrade from '../routes/DodoTrade';
import Container from '../components/Container';

const Main = () => {
  const { style: { mainContainer } } = useConfig();
  return (
    <Grommet theme={theme}>
      <Container
        style={{
          align: mainContainer?.align ? mainContainer.align : 'center',
          alignContent: mainContainer?.alignContent,
          alignSelf: mainContainer?.alignSelf,
          background: mainContainer?.background ? mainContainer.background : 'dark-1',
          border: mainContainer?.border ? mainContainer.border : true,
          direction: mainContainer?.direction,
          elevation: mainContainer?.elevation,
          fill: mainContainer?.fill,
          flex: mainContainer?.flex,
          gap: mainContainer?.gap,
          height: mainContainer?.height,
          justify: mainContainer?.justify,
          margin: mainContainer?.margin,
          pad: mainContainer?.pad ? mainContainer.pad : 'medium',
          responsive: mainContainer?.responsive,
          round: mainContainer?.round ? mainContainer.round : 'medium',
          width: mainContainer?.width ? mainContainer.width : { max: 'large' }
        }}
      >
        <Router
          routes={{
            '/': <RouteComponent component={HyphenBridge} />,
            '/dodo-trade': <RouteComponent component={DodoTrade} />
          }} />
      </Container>
    </Grommet>
  );
};

export default Main;
