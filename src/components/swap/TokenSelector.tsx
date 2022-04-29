import { Avatar, Select, Text, TextInput } from 'grommet';
import React, { useState }from 'react'
import { IToken } from '../../models';
import CustomTooltip from '../common/CustomTooltip';
import Container from '../Container';

const OptionLabel = ({
  id,
  image,
  symbol,
  sizeText
}: {
  id?: string;
  image?: string;
  symbol?: string;
  sizeText?: string;
}) => {
  return (
    <Container
      id={id}
      style={{
        direction: 'row',
        gap: 'small',
        align: 'center',
        pad: { vertical: 'xsmall', left: 'small' },
      }}
    >
      <Avatar size='xsmall' src={image} />
      <Text size={sizeText ? sizeText : 'small'}>{symbol}</Text>
    </Container>
  )
}

const TokenAmount = ({
  isLoggedIn,
  tokenAmount,
  setTokenAmount,
}: {
  isLoggedIn: boolean;
  tokenAmount?: string;
  setTokenAmount?: (amount: string) => void;
}) => {

  const handleOnChange = (e: any) => {
    if (!setTokenAmount) return;
    setTokenAmount(e.target.value);
  }

  return (
    <Container
      style={{
        alignSelf: 'end',
        pad: { right: 'small' }
      }}>
      {
        !setTokenAmount ? (
          <Text>{tokenAmount}</Text>
        ) : (
          <TextInput
            plain='full'
            disabled={!isLoggedIn}
            textAlign='end'
            placeholder='0.00'
            type="string"
            value={tokenAmount}
            onChange={handleOnChange}
          />
        )
      }
    </Container>
  )
}

export const TokenSelector = ({
  isLoggedIn,
  token,
  tokenList,
  setToken,
  tokenAmount,
  setTokenAmount
}: {
  isLoggedIn: boolean;
  token: IToken;
  tokenList: IToken[];
  setToken: (token: IToken) => void;
  tokenAmount?: string;
  setTokenAmount?: (amount: string) => void;
}) => {
  const [filteredTokens, setFilteredTokens] = useState(tokenList);

  const handleOnChange = (value: { option: IToken }) => {
    setToken(value.option)
  }

  const handleOnSearch = (path: string) => {
    // The line below escapes regular expression special characters:
    // [ \ ^ $ . | ? * + ( )
    const escapedText = path.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create the regular expression with modified value which
    // handles escaping special characters. Without escaping special
    // characters, errors will appear in the console
    const exp = new RegExp(escapedText, 'i');
    setFilteredTokens(tokenList.filter((o) => exp.test(o.symbol)));
  }

  return (
    <Container
      style={{
        direction: 'row',
        justify: 'between'
      }}
    ><div data-tip data-for="tokenSelect">
        <Select
          disabled={!isLoggedIn}
          dropHeight="small"
          value={<OptionLabel
            image={token.logoURI}
            symbol={token.symbol}
            sizeText={"medium"}
          />}
          options={filteredTokens}
          onChange={handleOnChange}
          onClose={() => setFilteredTokens(tokenList)}
          onSearch={handleOnSearch}
        >
          {(
            (option, _) => (
              <OptionLabel
                key={option.symbol}
                image={option.logoURI}
                symbol={option.symbol}
              />
            )
          )}
        </Select>
        {!isLoggedIn && (
          <CustomTooltip
            id="tokenSelect"
            text="Please connect to wallet"
          />
        )}
      </div>
      
      <TokenAmount
        isLoggedIn={isLoggedIn}
        tokenAmount={tokenAmount}
        setTokenAmount={setTokenAmount}
      />
    </Container>
  )
}