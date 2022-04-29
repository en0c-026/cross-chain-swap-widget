import { Avatar, Select, Text } from 'grommet'
import React from 'react'
import { ChainConfig } from '../../models'
import Container from '../Container'

interface NetworkSelectorProps {
  isLoggedIn: boolean;
  currentChain: ChainConfig;
  chainsSupported: ChainConfig[];
  switchChain: (targetChain: ChainConfig) => Promise<void>;
}

const OptionLabel = ({
  image,
  name
}: {
  image: string;
  name: string;
}) => {
  return (
    <Container
      style={{
        direction: 'row',
        gap: 'xsmall',
        align: 'center',
        pad: { vertical: 'xsmall', left: 'small', right: 'none' }
      }}
    >
      <Avatar size='xsmall' src={image} />
      <Text size='small'>{name}</Text>
    </Container>
  )
}


export const NetworkSelector = ({
  isLoggedIn,
  currentChain,
  chainsSupported,
  switchChain
}: NetworkSelectorProps) => {
  return (
    <Select
      disabled={!isLoggedIn}
      id="select-chain"
      size='small'
      name="select-chain"
      value={
        <OptionLabel
          image={currentChain.image}
          name={currentChain.name}
        />}
      options={chainsSupported.filter(chain => chain.chainId !== currentChain.chainId)}
      onChange={({ option }) => switchChain(option)}
    >
      {
        ({ image, name }: ChainConfig, _) => (
          <OptionLabel
            image={image}
            name={name}
          />
        )}
    </Select>
  )
}