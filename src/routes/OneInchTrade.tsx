import { h } from 'preact';
import { Box } from 'grommet'
import Header from '../components/Header';
import Container from '../components/Container';

export default function OneInchTrade() {
  return (
    <div>
      <Header />
      <Container
        style={{
          align: 'center',
          border: true,
          pad: 'small',
          gap: 'small'
          
        }}
      >

      </Container>
    </div>
  )
}