import { h } from 'preact'
import Container from './Container'
import { Button, Text } from 'grommet'
import { useWalletProvider } from '../context/WalletProvider'

const ButtonTitle = ({title}: { title: string}) => {
  return (
    <Container style={{
      background: 'c3',
      round: 'small',
      pad: { horizontal: 'small', vertical: 'xxsmall'},
      direction: 'row'
    }}>
      <Text size='small'>
        {title}
      </Text>
    </Container>
  )
}


export default function AccountManager() {
  const { connect, disconnect, isLoggedIn, accounts } = useWalletProvider()!;

  return (
    <Container
      style={{
        direction: 'row',
        gap: 'xsmall',
        align: 'center',
      }}
    >
      <Text
      size='small'
      >
        {isLoggedIn &&
          accounts &&
          (`${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`)
        }
      </Text>
      {isLoggedIn ?
        (
          <Button
            size='small'
            onClick={() => {
              disconnect()
              window.location.reload()
            }}
            label={<ButtonTitle title={"Disconnect"} />}
            plain
          />
        ) : (
          <Button
            size='small'
            onClick={() => connect()}
            label={<ButtonTitle title={"Connect"} />}
            plain
          />
        )
          
      }
    </Container>
  )
}