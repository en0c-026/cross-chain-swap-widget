import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import OneInchApi from "../../services/oneInchApi";
import { useWalletProvider } from "../common/WalletProvider";
import { useConfig } from "..";
// import { BigNumber } from "@ethersproject/bignumber";
// import { Contract } from "@ethersproject/contracts";
// import { JsonRpcProvider } from "@ethersproject/providers";
// import { formatEther, formatUnits, parseUnits } from "@ethersproject/units";
// import { ERC20Abi, NATIVE_ADDRESS } from "../../constants";
// import useAsync, { Status } from "../../hooks/useLoading";
// import { IToken, ITransaction } from "../../models";
// import formatBalance from "../../utils/formatBalance";
// import formatDecimals from "../../utils/formatDecimals";


interface IDexApiContext {
  apiService: OneInchApi;
  spenderAddress: string | undefined;
}

const DexApiContext = createContext<IDexApiContext | null>(null);

export default function DexApiProvider({ children }: { children: ReactNode }) {
  const { swapApiBaseUrl, defaultChainId, debug } = useConfig();
  const { currentChain } = useWalletProvider()!;
  const apiService = useRef<OneInchApi>(new OneInchApi({
    baseUrl: swapApiBaseUrl,
    chainId: defaultChainId,
    debug: debug
  })).current;
  const [spenderAddress, setSpenderAddress] = useState<string>();


  useEffect(() => {
    if (!apiService || !currentChain) return;
    apiService.setCurrentChainId(currentChain.chainId);
    (async () => {
      const { address } = await apiService.getSpenderApprove();
      setSpenderAddress(address)
    })();
  }, [currentChain])

  
  // const approve = useCallback(async () => {
  //   if (
  //     !tokenContract ||
  //     !spenderApprove ||
  //     !fromTokenAmount ||
  //     !fromToken
  //   ) return
  //   let parsedFromAmount = formatUnits(fromTokenAmount, fromToken?.decimals);
  //   return await tokenContract.approve(spenderApprove, parsedFromAmount);
  // }, [tokenContract, spenderApprove, accounts, fromTokenAmount])

  // const swap = useCallback(async () => {
  //   if (
  //     !fromToken ||
  //     !signer ||
  //     !txData ||
  //     !walletProvider
  //   ) {
  //     throw new Error("asd");
  //   }

  //   let txResponse;

  //   if (fromToken.address === NATIVE_ADDRESS) {
  //     txResponse = await signer.sendTransaction(txData)
  //     walletProvider.once(txResponse.hash, (result) => {
  //       console.log(result)
  //     })
  //   } else {
  //     let fromTokenAmountNumber = new Number(fromTokenAmount).valueOf();
  //     let allowanceAmountNumber = new Number(allowanceAmount).valueOf();
  //     if (allowanceAmountNumber > fromTokenAmountNumber) {
  //       txResponse = await signer.sendTransaction(txData)
  //       walletProvider.once(txResponse.hash, (result) => {
  //         console.log(result)
  //       })
  //     } else {
  //       let txApprove = await approve();
  //       walletProvider.once(txApprove.hash, async () => {
  //         txResponse = await signer.sendTransaction(txData)
  //         walletProvider.once(txResponse.hash, (result) => {
  //           console.log(result)
  //         })
  //       })
  //     }
  //   }

  // }, [fromToken, signer, txData, walletProvider, approve])

  

  //
  // useEffect(() => {
  //   if (
  //     !fromToken ||
  //     !toToken ||
  //     !accounts ||
  //     fromTokenAmount === '0'
  //   ) return;
  //   (async () => {
  //     // parse FromTokenAmount for call api
  //     let parsedFromAmount = parseUnits(fromTokenAmount, fromToken.decimals).toString()
  //     // call api
  //     let result = await oneInchApi.getBestQuote({
  //       fromTokenAddress: fromToken.address,
  //       toTokenAddress: toToken.address,
  //       amount: parsedFromAmount,
  //     })
  //     // setToTokenAmount
  //     let formattedToAmount = formatDecimals(formatUnits(result.toTokenAmount, toToken.decimals));
  //     setToTokenAmount(formattedToAmount)

  //   })()
  //     .catch(({ data: {
  //       error,
  //       description
  //     } }) => {
  //       setError({
  //         error: error,
  //         description: description
  //       });
  //       setToTokenAmount('0')
  //     });
  // }, [fromToken, fromTokenAmount, toToken])

  // 
  // useEffect(() => {
  //   if (
  //     fromToken &&
  //     toToken &&
  //     accounts &&
  //     fromTokenAmount !== '0' &&
  //     toTokenAmount !== '0' &&
  //     fromToken !== toToken
  //   ) {
  //     (async () => {
  //       // parse FromTokenAmount for call api
  //       const parsedFromAmount = parseUnits(fromTokenAmount, fromToken.decimals).toString()
  //       // call api
  //       const result = await oneInchApi.getSwapData({
  //         fromTokenAddress: fromToken.address,
  //         toTokenAddress: toToken.address,
  //         amount: parsedFromAmount,
  //         fromAddress: accounts[0],
  //         slippage: slippage,
  //       })
  //       setTxData(result.tx)
  //       setIsSwapReady(true)
  //     })()
  //       .catch(({ data: {
  //         error,
  //         description
  //       } }) => {
  //         setError({
  //           error: error,
  //           description: description
  //         })
  //         setTxData(undefined)
  //         setIsSwapReady(false)
  //       });
  //   }
  // }, [fromToken, fromTokenAmount, toToken, toTokenAmount, accounts])


  return (
    <DexApiContext.Provider
      value={{
        apiService,
        spenderAddress
      }}
    >
      {children}
    </DexApiContext.Provider>
  )
}

export const useDexApi = () => useContext(DexApiContext);