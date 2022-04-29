import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ERC20Abi, NATIVE_ADDRESS } from "../../constants";
import useAsync, { Status } from "../../hooks/useLoading";
import { IToken } from "../../models";
import formatBalance from "../../utils/formatBalance";
import { useWalletProvider } from "../common/WalletProvider";
import { useDexApi } from "./DexApi";

interface IBalance {
  userRawBalance: BigNumber;
  formattedBalance: string;
}

interface ITokensContext {
  fromToken: IToken | undefined;
  toToken: IToken | undefined;
  fromTokenList: IToken[] | undefined;
  toTokenList: IToken[] | undefined;
  fromTokenBalance: IBalance | undefined;
  getFromTokenBalanceStatus: Status;
  setFromToken: (token: IToken) => void;
  setToToken: (token: IToken) => void;
  tokenContract: Contract | undefined;
  switchTokens: () => void;
}


const TokensContext = createContext<ITokensContext | null>(null);


export const TokensProvider = ({ children }: { children: ReactNode }) => {

  const { currentChain, walletProvider, accounts, signer } = useWalletProvider()!;
  const { apiService } = useDexApi()!;
  const [tokenList, setTokenList] = useState<IToken[]>();
  const [fromToken, setFromToken] = useState<IToken>();
  const [toToken, setToToken] = useState<IToken>();


  useEffect(() => {
    if (!currentChain) return;
    setTokenList(undefined);
    (async () => {
      const { tokens } = await apiService.getTokenList();
      let tokensValues = Object.values(tokens)
      setTokenList(tokensValues);

      console.log("tokensValues =>", tokensValues)
      setFromToken(tokensValues.find(token => token.symbol === currentChain?.currency))
      if (currentChain.name === 'Avalanche') {
        setToToken(tokensValues.find(token => token.symbol === 'USDT.e'))
      } else {
        setToToken(tokensValues.find(token => token.symbol === 'DAI'))
      }
    })()
  }, [apiService.currenChainId])

  const fromTokenList = useMemo(() => {
    if (!tokenList || !toToken) return
    return tokenList.filter(token => token.symbol !== toToken.symbol)
  }, [tokenList, toToken])

  const toTokenList = useMemo(() => {
    if (!tokenList || !fromToken) return
    return tokenList.filter(token => token.symbol !== fromToken.symbol)
  }, [tokenList, fromToken])

  const tokenContract = useMemo(() => {
    if (!fromToken || !currentChain || !signer) return;
    return new Contract(
      fromToken.address,
      ERC20Abi,
      signer
    );
  }, [fromToken, currentChain, signer]);

  const getFromTokenBalance = useCallback(async () => {
    if (
      !accounts ||
      !fromToken ||
      !tokenContract ||
      !walletProvider
    ) {
      throw new Error("There is no pre-data to recover balance");
    }
    let formattedBalance: string;
    let userRawBalance: BigNumber;

    if (fromToken.address === NATIVE_ADDRESS) {
      userRawBalance = await walletProvider.getBalance(accounts[0])
      formattedBalance = formatBalance(userRawBalance)
    } else {
      userRawBalance = await tokenContract.balanceOf(accounts[0])
      formattedBalance = formatBalance(userRawBalance)
    }

    return { formattedBalance, userRawBalance }
  }, [
    accounts,
    fromToken,
    tokenContract,
    walletProvider
  ])

  const {
    execute: updateFromTokenBalance,
    value: fromTokenBalance,
    status: getFromTokenBalanceStatus,
    //error: getFromTokenBalanceError
  } = useAsync(getFromTokenBalance)

  useEffect(() => {
    updateFromTokenBalance();
  }, [getFromTokenBalance, updateFromTokenBalance])

  const switchTokens = useCallback(() => {
    if (!toToken || !fromToken) throw new Error("");

    setFromToken(toToken)
    setToToken(fromToken)
  }, [fromToken, toToken])

  
  return (
    <TokensContext.Provider
      value={{
        fromToken,
        fromTokenList,
        toToken,
        toTokenList,
        fromTokenBalance,
        getFromTokenBalanceStatus,
        setFromToken,
        setToToken,
        tokenContract,
        switchTokens
      }}>
      {children}
    </TokensContext.Provider>
  )
}
export const useTokens = () => useContext(TokensContext);
