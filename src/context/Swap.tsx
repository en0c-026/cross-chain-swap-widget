import { h, createContext, ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { useConfig } from ".";
import { IToken } from "../models";
import OneInchApi from "../services/oneInchApi";
import { useWalletProvider } from "./WalletProvider";

interface ISwapContext {
  oneInchApi: OneInchApi | undefined;
  allowanceAmount: string | undefined;
  tokenList: IToken[] | undefined;
  spenderApprove: string | undefined;
  fromToken: IToken | undefined;
  toToken: IToken | undefined;
  fromTokenAmount: string | undefined;
  toTokenAmount: string | undefined;
  slippage: number | undefined;
  setFromToken: (token: IToken) => void;
  setToToken: (token: IToken) => void;
  setFromTokenAmount: (amount: string) => void;
  setToTokenAmount: (amount: string) => void;
  setSlippage: (slipagge: number) => void;
}

const SwapContext = createContext<ISwapContext | null>(null);

export default function SwapProvider({ children }: { children: ComponentChildren }) {
  const { currentChain, accounts } = useWalletProvider()!;
  const { swapApiBaseUrl, defaultChainId, debug } = useConfig();
  const [oneInchApi, setOneInchApi] = useState<OneInchApi | undefined>();
  const [allowanceAmount, setAllowanceAmount] = useState<string | undefined>();
  const [tokenList, setTokenList] = useState<IToken[] | undefined>();
  const [spenderApprove, setSpenderApprove] = useState<string | undefined>();
  const [fromToken, setFromToken] = useState<IToken | undefined>();
  const [toToken, setToToken] = useState<IToken | undefined>();
  const [fromTokenAmount, setFromTokenAmount] = useState<string | undefined>();
  const [toTokenAmount, setToTokenAmount] = useState<string | undefined>();
  const [slippage, setSlippage] = useState<number | undefined>();

  useEffect(() => {
    setOneInchApi(new OneInchApi({
      baseUrl: swapApiBaseUrl,
      chainId: defaultChainId,
      debug: debug
    })
    );
  }, [])

  useEffect(() => {
    if (!oneInchApi || !currentChain) return;
    oneInchApi.setCurrentChainId(currentChain.chainId);
  }, [currentChain])

  useEffect(() => {
    if (!oneInchApi) return;
    (async () => {
      const { tokens } = await oneInchApi.getTokenList();
      const { address } = await oneInchApi.getSpenderApprove();
      setTokenList(Object.values(tokens));
      setSpenderApprove(address);
    })();
  }, [oneInchApi])

  useEffect(() => {
    if (!oneInchApi || !accounts || !toToken) return;
    (async () => {
      const { allowance } = await oneInchApi.getAllowanceAmount({ tokenAddress: toToken.address, walletAddress: accounts[0] })
      setAllowanceAmount(allowance);
    })();
  }, [accounts, toToken])

  return (
    <SwapContext.Provider
      value={{
        oneInchApi,
        allowanceAmount,
        tokenList,
        spenderApprove,
        fromToken,
        toToken,
        fromTokenAmount,
        toTokenAmount,
        slippage,
        setFromToken,
        setToToken,
        setFromTokenAmount,
        setToTokenAmount,
        setSlippage,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = () => useContext(SwapContext);