import React, { useEffect } from 'react';
import { Anchor, Button, Text } from 'grommet'
import Container from '../components/Container';
import { useWalletProvider } from '../context/common/WalletProvider';
import { NATIVE_ADDRESS } from '../constants';
import { Unsorted } from 'grommet-icons';
import { Header } from '../components/common/Header';
import { TokenSelector } from '../components/swap/TokenSelector';
import { Status } from '../hooks/useLoading';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTokens } from '../context/swap/Tokens';
import { useApproval } from '../context/swap/Approval';
import { useSwap } from '../context/swap/Swap';

const SwapButton = ({
  isSwapReady,
  swap
}: {
  isSwapReady: boolean;
  swap: () => Promise<void>;
}) => {
  return (
    <Container
      style={{
        pad: { vertical: 'small' }
      }}
    >
      <Button
        disabled={!isSwapReady}
        label={'Swap'}
        onClick={() => {
          swap()
        }}
      />
    </Container>
  )
}

const TokenName = ({
  name,
  address,
  explorerUrl,
}: {
  name: string,
  address: string,
  explorerUrl: string;
}) => {
  if (address === NATIVE_ADDRESS) {
    return <Text weight='normal' size="small">{name}</Text>
  } else {
    return <Anchor
      label={<Text weight='normal' size="small">{name}</Text>}
      href={`${explorerUrl}token/${address}`}
      target='_blank'
    />
  }
}

export const Swap = () => {
  const { isLoggedIn, currentChain } = useWalletProvider()!;
  const { swapAmountInputValue, changeSwapAmountInputValue, receiveAmount } = useSwap()!;
  const {
    fromToken,
    setFromToken,
    fromTokenList,
    toToken,
    setToToken,
    toTokenList,
    fromTokenBalance,
    getFromTokenBalanceStatus,
    switchTokens
  } = useTokens()!;

  return (
    <Container
      style={{}}
    >
      <Header />
      <Container style={{}}>
        <Container
          style={{
            background: 'c2',
            round: 'medium',
            pad: 'small',
            gap: 'small',
            margin: {
              top: 'small'
            }
          }}
        >
          <Text
            weight='normal'
            size="small"
            alignSelf='center'
          >
            You buy
          </Text>
          {
            fromTokenList && fromToken ? (
              <TokenSelector
                isLoggedIn={isLoggedIn}
                token={fromToken}
                tokenList={fromTokenList}
                setToken={setFromToken}
              tokenAmount={swapAmountInputValue}
              setTokenAmount={changeSwapAmountInputValue}
              />
            ) : (
              <Skeleton
                width='100%'
                height='100%'
                enableAnimation
              />
            )
          }
          <Container
            style={{
              direction: 'row',
              justify: 'between',
              pad: {
                horizontal: 'small'
              }
            }}
          >
            {
              currentChain &&
              fromToken &&
              (
                <TokenName
                  name={fromToken.name}
                  address={fromToken.address}
                  explorerUrl={currentChain.explorerUrl}
                />
              )
            }
            <Container
              style={{
                gap: 'xsmall',
                direction: 'row'
              }}>
              {
                getFromTokenBalanceStatus &&
                  getFromTokenBalanceStatus === Status.SUCCESS ? (
                  < Text weight='normal' size="small">
                    Balance: {fromTokenBalance?.formattedBalance || ""}
                  </Text>
                ) : (
                  <Skeleton />
                )
              }
            </Container>
          </Container>
        </Container>
        <Button
          alignSelf='center'
          plain
          label={<Unsorted size='36px' />}
          onClick={() => {
            changeSwapAmountInputValue('0')
            switchTokens()
          }}
        />
        <Container
          style={{
            background: 'c1',
            round: 'medium',
            border: true,
            pad: 'small',
            gap: 'small',

          }}
        >

          <Text
            weight='normal'
            size="small"
            alignSelf='center'
          >
            You sell
          </Text>
          {
            toTokenList &&
            toToken &&
            (
              <TokenSelector
                isLoggedIn={isLoggedIn}
                token={toToken}
                tokenList={toTokenList}
                setToken={setToToken}
                tokenAmount={receiveAmount}
              />
            )
          }
          <Container
            style={{
              direction: 'row',
              justify: 'start',
              pad: {
                horizontal: 'small'
              }
            }}
          >
            {
              currentChain &&
              toToken &&
              (
                <TokenName
                  name={toToken.name}
                  address={toToken.address}
                  explorerUrl={currentChain.explorerUrl}
                />
              )
            }
          </Container>
        </Container>
        {/* <SwapButton
              isSwapReady={isSwapReady}
              swap={swap}
            /> */}
      </Container>
    </Container >
  )
}