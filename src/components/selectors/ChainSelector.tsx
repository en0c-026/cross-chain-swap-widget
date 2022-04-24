import { Avatar, Select, Text } from 'grommet'
import { h } from 'preact'
import { ChainConfig } from '../../models'
import Container from '../Container'

interface ChainSelectorProps {
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
        pad: { vertical: 'xsmall', left: 'small', right: 'none'}
      }}
    >
      <Avatar size='xsmall' src={image} />
      <Text size='small'>{name}</Text>
    </Container>
  )
}


export default function ChainSelector({
  currentChain,
  chainsSupported,
  switchChain
}: ChainSelectorProps) {
  return (
    <Select
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