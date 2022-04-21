import { Avatar, Box, Button, Text } from 'grommet'
import { h } from 'preact'
import { useConfig } from '../context';
import { useRouter } from '../layout/Router'
import Container from './Container';

const ButtonTitle = ({ path, label }) => (
  <Container
    style={{
      align: 'center',
      border: true,
      direction: 'row',
      gap: 'xsmall',
      margin: 'xsmall',
      pad: { vertical: 'xsmall', horizontal: 'small' },
      round: 'xsmall'
    }}>
    <Avatar size='small' src={path} />
    <Text size="small">{label}</Text>
  </Container>
);

export default function Header() {
  const { setRoute } = useRouter();
  const { style: { header } } = useConfig();
  return (
    <Container
      style={{
        align: header?.align ? header.align : 'center',
        alignContent: header?.alignContent,
        alignSelf: header?.alignSelf,
        background: header?.background,
        border: header?.border ? header.border : true,
        direction: 'row',
        elevation: header?.elevation,
        fill: header?.fill,
        flex: header?.flex,
        gap: header?.gap ? header.gap : 'small',
        height: header?.height,
        justify: header?.justify,
        margin: header?.margin,
        pad: header?.pad ? header.pad : { horizontal: 'large' },
        responsive: header?.responsive,
        round: header?.round,
        width: header?.width
      }}
    >
      <Button
        label={
          <ButtonTitle path='https://raw.githubusercontent.com/en0c-026/cross-chain-swap-widget/master/dev/hyphen-logo.png' label='Hyphen Bridge' />
        }
        onClick={() => setRoute('/')}
        plain
      />
      <Button
        label={
          <ButtonTitle path='https://raw.githubusercontent.com/en0c-026/cross-chain-swap-widget/master/dev/dodo-logo.png' label='DODO Trade' />
        }
        onClick={() => setRoute('/dodo-trade')}
        plain
      />
    </Container >
  )
}