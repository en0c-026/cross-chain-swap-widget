import { h } from 'preact'
import Container from './Container'
import { Button, Text } from 'grommet'
import { useWalletProvider } from '../context/WalletProvider'

export default function AccountManager() {
  const { connect, disconnect, isLoggedIn, accounts } = useWalletProvider()!;
  return (
    <Container
      style={{
        direction: 'row',
        gap: 'small',
        align: 'center'
      }}
    >
      <Text>
        {isLoggedIn &&
          accounts &&
          (`${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 6)}`)
        }
      </Text>
      {isLoggedIn ?
        (
          <Button
            onClick={() => {
              disconnect()
              window.location.reload()
            }}
            label="Disconnect"
          />
        ) : (
          <Button onClick={() => connect()}
            label="Connect"
          />
        )

      }
    </Container>
  )
}