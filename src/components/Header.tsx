import { Avatar, Button, Text } from 'grommet'
import { h } from 'preact'
import { useConfig } from '../context';
import { useRouter } from '../layout/Router'
import Container from './Container';


const ButtonTitle = ({ active, path, label }) => (
  <Container
    style={{
      align: 'center',
      direction: 'row',
      gap: 'xsmall',
      pad: { vertical: 'xxsmall', horizontal: 'xsmall' },
      round: 'small',
      border: active ? true : false,
      elevation: active ? 'small' : 'none',
    }}>
    <Avatar size='small' src={path} />
    <Text size="small">{label}</Text>
  </Container>
);

export default function Header() {
  const { setRoute, route } = useRouter();
  const { style: { header } } = useConfig();
  return (
    <Container
      style={{
        align: header?.align ? header.align : 'center',
        alignContent: header?.alignContent,
        alignSelf: header?.alignSelf,
        background: header?.background,
        border: header?.border,
        direction: 'row',
        elevation: header?.elevation,
        fill: header?.fill,
        focusIndicator: header?.focusIndicator,
        flex: header?.flex,
        gap: header?.gap ? header.gap : 'xsmall',
        height: header?.height,
        justify: header?.justify ? header.justify : 'between',
        margin: header?.margin,
        pad: header?.pad,
        responsive: header?.responsive,
        round: header?.round,
        width: header?.width
      }}
    >
      <Container
        style={{
          direction: 'row',
          gap: 'xsmall'
        }}>
        <Button
          label={
            <ButtonTitle
              active={route === '/' ? true : false}
              path='https://raw.githubusercontent.com/en0c-026/cross-chain-swap-widget/master/dev/hyphen-logo.png'
              label='Hyphen Bridge'
            />
          }
          onClick={() => setRoute('/')}
          plain
        />
        <Button
          label={
            <ButtonTitle
              active={route === '/1inch-trade' ? true : false}
              path='https://raw.githubusercontent.com/en0c-026/cross-chain-swap-widget/master/dev/1inch-logo.png'
              label='1inch Swap'
            />
          }
          onClick={() => setRoute('/1inch-trade')}
          plain
        />
      </Container>

    </Container >
  )
}