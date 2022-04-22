import { h } from 'preact';
import { Box } from 'grommet'
import Header from '../components/Header';
import Container from '../components/Container';

export default function DodoTrade() {
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

        Dodo Trade

      </Container>
    </div>
  )
}