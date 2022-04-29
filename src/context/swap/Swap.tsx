//import AwesomeDebouncePromise from "awesome-debounce-promise";
import React from 'react';
import { formatUnits, parseUnits } from "@ethersproject/units";
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAsync, { Status } from "../../hooks/useLoading";
import { useNotifications } from "../common/Notification";
import { useWalletProvider } from "../common/WalletProvider";
import { useApproval } from "./Approval";
import { useDexApi } from "./DexApi";
import { useTokens } from "./Tokens";
import formatDecimals from '../../utils/formatDecimals';


export enum ValidationErrors {
  INVALID_AMOUNT,
  AMOUNT_LT_MIN,
  AMOUNT_GT_MAX,
  INADEQUATE_BALANCE,
  SWAP_DATA_NOT_LOADED,
  BALANCE_NOT_LOADED,
}

interface ISwapContext {
  swapAmount: number | null | undefined;
  swapAmountInputValue: string | undefined;
  changeSwapAmountInputValue: (amount: string) => void;
  receiveAmount: string | undefined;
  //fetchTransactionFeeStatus: Status;
  //fetchTransactionFeeError: Error | undefined;
  //estimateGas: number | undefined;
  //swapAmountValidationErrors: ValidationErrors[];
  // receiver address
  receiver: { receiverAddress: string; isReceiverValid: boolean };
  changeReceiver: (event: FormEvent<HTMLInputElement>) => void;
  //swap stuff
  executeSwap: (receiverAddress: string) => void;
  executeSwapError: Error | undefined;
  executeSwapStatus: Status;
  executeSwapValue: any;
  //pre swap stuff
  executeFetchSwapData: () => void;
  executeFetchSwapDataError: Error | undefined;
  executeFetchSwapDataStatus: Status;
  executeFetchSwapDataValue: any;
  // check receival stuff
  //checkReceival: () => Promise<string | null>;
  // exti stuff
  setExitHash: (exitHash: string | undefined) => void;
  exitHash: string | undefined;
  getExitInfoFromHash: (exitHash: string) => Promise<string>;
  slippage: number;
  setSlippage: (slippage: number) => void;
}

const SwapContext = createContext<ISwapContext | null>(null);

// const getTokenGasPrice = (
//   tokenAddress: string,
//   networkId: number,
//   fetchOptions: any
// ) =>
//   fetch(
//     `${config.hyphen.baseURL}${config.hyphen.getTokenGasPricePath}?tokenAddress=${tokenAddress}&networkId=${networkId}`,
//     fetchOptions
//   );
//const getTokenGasPriceDebounced = AwesomeDebouncePromise(getTokenGasPrice, 500);

const SwapProvider = ({ children }: { children: ReactNode }) => {
  const { fromToken, fromTokenBalance, toToken } = useTokens()!;
  const { accounts, currentChain, signer, walletProvider } = useWalletProvider()!;
  const { addTxNotification } = useNotifications()!;
  const { apiService } = useDexApi()!;
  const [receiveAmount, setReceiveAmount] = useState<string>();
  // exit hash for last transaction
  const [exitHash, setExitHash] = useState<string>();
  const [slippage, setSlippage] = useState<number>(1);
  const {
    executeApproveToken,
    executeApproveTokenError,
    executeApproveTokenStatus,
    fetchFromTokenApproval,
    fetchFromTokenApprovalError,
    fetchFromTokenApprovalStatus,
    fetchFromTokenApprovalValue,
  } = useApproval()!;

  const [errors, setErrors] = useState<ValidationErrors[]>([]);

  const [swapAmountInputValue, setSwapAmountInputValue] = useState<string>("");

  const [receiver, setReceiver] = useState<{
    receiverAddress: string;
    isReceiverValid: boolean;
  }>({
    receiverAddress: "",
    isReceiverValid: false,
  });

  useEffect(() => {
    if (accounts) {
      setReceiver({
        receiverAddress: accounts[0],
        isReceiverValid: true,
      });
    }
  }, [accounts]);

  // reset the input after conditions change
  useEffect(() => {
    setSwapAmountInputValue("");
  }, [currentChain, fromToken, toToken]);

  const swapAmount = useMemo(
    () => parseFloat(swapAmountInputValue),
    [swapAmountInputValue]
  );

  // Fetch token approval when conditions change
  useEffect(() => {
    if (
      errors.length === 0 ||
      (executeApproveTokenStatus === Status.SUCCESS && errors.length === 0)
    ) {
      fetchFromTokenApproval(swapAmount);
    }
  }, [
    fetchFromTokenApproval,
    swapAmount,
    errors,
    executeApproveTokenStatus,
  ]);

  // useEffect(() => {
  //   console.log({
  //     fetchSelectedTokenApprovalStatus,
  //     fetchSelectedTokenApprovalValue,
  //     fetchSelectedTokenApprovalError,
  //   });
  // }, [
  //   fetchSelectedTokenApprovalStatus,
  //   fetchSelectedTokenApprovalValue,
  //   fetchSelectedTokenApprovalError,
  // ]);

  const changeSwapAmountInputValue = (amount: string) => {
    const regExp = /^((\d+)?(\.\d{0,4})?)$/;
    // match any number of digits, and after that also optionally match, one decimal point followed by any number of digits
    // having the string input value and number value seperate allows for the validation logic to run without intefering each other
    let status = regExp.test(amount);

    if (status) {
      // validation must run in the same function where transferAmount is being changed
      // this is to prevent a re-render in the middle which will fire fetchTransactionFee
      // even if there are errors, because errors would be populated next render, when its too late
      validateSwapAmount(parseFloat(amount));
      setSwapAmountInputValue(amount);
    }
  };

  // const calculateTransactionFee = useCallback(async () => {
  //   const fetchOptions = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json;charset=utf-8",
  //     },
  //   };

  //   if (!fromChain || !selectedToken || !toChain || !transferAmount)
  //     throw new Error("App not initialised");

  //   if (isNaN(transferAmount)) throw new Error("Transfer amount is invalid");
  //   console.log("calculate fee for amount", transferAmount);

  //   let fixedDecimalPoint =
  //     selectedToken[fromChain.chainId].fixedDecimalPoint ||
  //     DEFAULT_FIXED_DECIMAL_POINT;

  //   let lpFeeAmountRaw = (LP_FEE_FRACTION * transferAmount) / 100;
  //   let lpFeeProcessedString;

  //   lpFeeProcessedString = lpFeeAmountRaw.toFixed(fixedDecimalPoint);

  //   let fetchResponse = await getTokenGasPriceDebounced(
  //     selectedToken[toChain.chainId].address,
  //     toChain.chainId,
  //     fetchOptions
  //   );

  //   // Check the balance again using tokenAmount
  //   // let userBalanceCheck = await checkUserBalance(amount);

  //   // if (!userBalanceCheck) return;
  //   // if (!config.isNativeAddress(selectedToken.address)) {
  //   //   await checkTokenApproval(amount);
  //   // }

  //   if (!fetchResponse || !fetchResponse.json) {
  //     throw new Error(`Invalid response`);
  //   }

  //   let response = await fetchResponse.json();

  //   if (!response || !response.tokenGasPrice) {
  //     throw new Error(
  //       `Unable to get token gas price for ${selectedToken.symbol}`
  //     );
  //   }

  //   console.log(
  //     `Token gas price for ${selectedToken.symbol} is ${response.tokenGasPrice}`
  //   );

  //   let tokenGasPrice = response.tokenGasPrice;

  //   if (!tokenGasPrice) {
  //     throw new Error(
  //       "Error while getting selectedTokenConfig and tokenGasPrice from hyphen API"
  //     );
  //   }

  //   let overhead = selectedToken[fromChain.chainId].transferOverhead;
  //   let decimal = selectedToken[fromChain.chainId].decimal;

  //   if (!overhead || !decimal) {
  //     throw new Error(
  //       "Error while getting token overhead gas and decimal from config"
  //     );
  //   }

  //   let transactionFeeRaw = BigNumber.from(overhead).mul(tokenGasPrice);

  //   let transactionFee = formatRawEthValue(
  //     transactionFeeRaw.toString(),
  //     decimal
  //   );

  //   let transactionFeeProcessedString = toFixed(
  //     transactionFee,
  //     fixedDecimalPoint
  //   );

  //   let amountToGet =
  //     transferAmount -
  //     parseFloat(transactionFee) -
  //     parseFloat(lpFeeProcessedString);

  //   let amountToGetProcessedString = toFixed(
  //     amountToGet.toString(),
  //     fixedDecimalPoint
  //   );

  //   if (amountToGet <= 0) throw new Error("Amount too low");

  //   return {
  //     lpFeeProcessedString,
  //     transactionFeeProcessedString,
  //     amountToGetProcessedString,
  //   };
  // }, [fromChain, toChain, selectedToken, transferAmount]);

  // const {
  //   execute: fetchTransactionFee,
  //   error: fetchTransactionFeeError,
  //   status: fetchTransactionFeeStatus,
  //   value: transactionFee,
  // } = useAsync(calculateTransactionFee);

  // this is a function, and not an effect being run on transferAmount
  // because we need this effect to run synchronously, in the sense that
  // it should always run together with updating transferAmount, so that
  // we don't trigger another render in the middle

  const validateSwapAmount = useCallback(
    (amount: number) => {
      let newErrors: ValidationErrors[] = [];

      if (!fromTokenBalance)
        newErrors.push(ValidationErrors.BALANCE_NOT_LOADED);

      // we are not doing the below line, and doing the dumber version to keep TS happy
      // if (errors.length > 0) return errors;
      if (!fromTokenBalance || amount === undefined) {
        setErrors(newErrors);
        return;
      }

      // if (amount < poolInfo.minDepositAmount) {
      //   newErrors.push(ValidationErrors.AMOUNT_LT_MIN);
      // }

      // if (amount > poolInfo.maxDepositAmount) {
      //   newErrors.push(ValidationErrors.AMOUNT_GT_MAX);
      // }

      if (amount > Number(fromTokenBalance.formattedBalance)) {
        newErrors.push(ValidationErrors.INADEQUATE_BALANCE);
      }

      if (isNaN(amount)) {
        newErrors.push(ValidationErrors.INVALID_AMOUNT);
      }

      // Don't reassign errors array if both new and old are empty
      // This prevents duplicate fetching of transaction fees
      setErrors((oldErrors) => {
        if (newErrors.length === 0 && oldErrors.length === 0) {
          return oldErrors;
        } else return newErrors;
      });
    },
    [fromTokenBalance]
  );

  // both pool info and selected token balance upon changing
  // can make the preexisting errors stale
  // so validate once more when this happens
  // useEffect(() => {
  //   if (poolInfo && selectedTokenBalance) {
  //     validateTransferAmount(transferAmount);
  //   }
  // }, [poolInfo, selectedTokenBalance, transferAmount, validateTransferAmount]);

  // useEffect(() => {
  //   if (errors.length === 0) {
  //     fetchTransactionFee();
  //   }
  // }, [errors, fetchTransactionFee]);


  useEffect(() => {
    if (
      !fromToken ||
      !toToken ||
      !accounts ||
      !swapAmountInputValue ||
      swapAmountInputValue === '0' ||
      swapAmountInputValue === '0.' ||
      swapAmountInputValue === '0.0'
    ) {
      setReceiveAmount(undefined)
      return
    };
    (async () => {
      const amount = parseUnits(
        swapAmount.toString(),
        fromToken.decimals
      );
      console.log("parsedAmount =>", amount.toString())
      console.log("swapAmountInputValue =>", swapAmountInputValue)

      let result = await apiService.getBestQuote({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amount.toString(),
      })
      // setToTokenAmount
      let formattedToAmount = formatDecimals(formatUnits(result.toTokenAmount, toToken.decimals));
      setReceiveAmount(formattedToAmount)

    })();
  }, [fromToken, swapAmountInputValue, toToken])



  const getSwapData = useCallback(async () => {
    if (!swapAmount || errors.length > 0) {
      throw new Error("Invalid transfer amount");
    }
    if (!fromToken || !toToken) {
      throw new Error("Prerequisites missing");
    }
    if (fromToken === fromToken) {
      throw new Error("Same tokens swaps are not allowed, please change one.");
    }

    if (!accounts || !accounts[0]) throw new Error("Wallet not connected");

    const amount = parseUnits(
      swapAmount.toString(),
      fromToken.decimals
    );

    console.log("Total amount to  be transfered: ", amount.toString());

    let swapData = await apiService.getSwapData({
      fromTokenAddress: fromToken.address,
      toTokenAddress: toToken.address,
      amount: amount.toString(),
      fromAddress: accounts[0],
      slippage: slippage,
    });

    // if (transferStatus.code === RESPONSE_CODES.ALLOWANCE_NOT_GIVEN) {
    //   throw new Error("Approval not given for token");
    // }

    // if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_NETWORK) {
    //   throw new Error("Target chain id is not supported yet");
    // }

    // if (transferStatus.code === RESPONSE_CODES.NO_LIQUIDITY) {
    //   throw new Error(
    //     `No liquidity available for ${transferAmount} ${selectedToken.symbol}`
    //   );
    // }

    // if (transferStatus.code === RESPONSE_CODES.UNSUPPORTED_TOKEN) {
    //   throw new Error("Requested token is not supported yet");
    // }

    // if (transferStatus.code !== RESPONSE_CODES.OK) {
    //   throw new Error(
    //     `Error while doing preDeposit check ${transferStatus.message}`
    //   );
    // }

    return swapData;
  }, [
    swapAmount,
    fromToken,
    toToken,
    accounts,
    apiService,
    errors
  ]);

  const {
    execute: executeFetchSwapData,
    error: executeFetchSwapDataError,
    status: executeFetchSwapDataStatus,
    value: executeFetchSwapDataValue,
  } = useAsync(getSwapData);

  const swap = useCallback(
    async (receiverAddress) => {
      // showFeedbackMessage("Checking approvals and initiating deposit transaction");
      if (!executeFetchSwapDataValue?.tx)
        throw new Error("fetch swap data not completed");
      if (!signer || !currentChain)
        throw new Error("Prerequisites missing from chain");

      let swapTx = await signer.sendTransaction(executeFetchSwapDataValue.tx);

      addTxNotification(
        swapTx,
        "Swap",
        `${currentChain.explorerUrl}/tx/${swapTx.hash}`
      );
      return swapTx;

    },
    [
      signer,
      currentChain,
      signer,
      executeFetchSwapDataValue,
      addTxNotification,
    ]
  );

  const {
    execute: executeSwap,
    error: executeSwapError,
    status: executeSwapStatus,
    value: executeSwapValue,
  } = useAsync(swap);

  // const checkReceival = useCallback(async () => {
  //   if (!executeDepositValue?.hash)
  //     throw new Error("Deposit transaction unsuccesful");

  //   const data = await hyphen.checkDepositStatus({
  //     depositHash: executeDepositValue.hash,
  //     fromChainId: fromChain?.chainId,
  //   });
  //   if (data.statusCode === 1 && data.exitHash && data.exitHash !== "") {
  //     // Exit hash found but transaction is not yet confirmed
  //     console.log(`Exit hash on chainId ${data.toChainId} is ${data.exitHash}`);
  //     return data.exitHash;
  //   } else if (data.statusCode === 2 && data.exitHash && data.exitHash !== "") {
  //     console.log("Funds transfer successful");
  //     console.log(`Exit hash on chainId ${data.toChainId} is ${data.exitHash}`);
  //     return data.exitHash;
  //   } else {
  //     return null;
  //   }
  // }, [executeDepositValue?.hash, fromChain, hyphen]);

  const getExitInfoFromHash = useCallback(
    async (hash) => {
      if (!walletProvider)
        throw new Error("Prerequisites missing");
      let receipt;
      try {
        receipt = await walletProvider.getTransactionReceipt(hash);
      } catch (e) {
        throw new Error("Cannot get transaction");
      }

      // if (!receipt?.logs) throw new Error("No error logs");

      // let lpManagerInterface = new ethers.utils.Interface(lpmanagerABI);

      // let tokenReceipt = receipt.logs.find(
      //   (receiptLog) => receiptLog.topics[0] === toChain.assetSentTopicId
      // );

      // if (!tokenReceipt) {
      //   throw new Error("No valid receipt log data");
      // }

      // const data = lpManagerInterface.parseLog(tokenReceipt);

      // if (!data?.args?.transferredAmount) throw new Error("Invalid log data");

      // let amount = data.args.transferredAmount;

      // let processedAmount = ethers.utils.formatUnits(
      //   amount,
      //   selectedToken[fromChain.chainId].decimal
      // );

      // processedAmount = toFixed(
      //   processedAmount,
      //   selectedToken[fromChain.chainId].fixedDecimalPoint ||
      //   DEFAULT_FIXED_DECIMAL_POINT
      // );

      return receipt;
    },
    [walletProvider]
  );

  const changeReceiver = useCallback((event: FormEvent<HTMLInputElement>) => {
    setReceiver({
      receiverAddress: event.currentTarget.value,
      isReceiverValid: true,
    });
  }, []);

  return (
    <SwapContext.Provider
      value={{
        swapAmount,
        swapAmountInputValue,
        changeSwapAmountInputValue,
        receiveAmount,
        //estimateGas,
        //swapAmountValidationErrors,
        receiver,
        changeReceiver,
        executeSwap,
        executeSwapError,
        executeSwapStatus,
        executeSwapValue,
        executeFetchSwapData,
        executeFetchSwapDataError,
        executeFetchSwapDataStatus,
        executeFetchSwapDataValue,
        //checkReceival,
        setExitHash,
        exitHash,
        getExitInfoFromHash,
        slippage,
        setSlippage,
      }}>
      {children}
    </SwapContext.Provider>
  );
};

const useSwap = () => useContext(SwapContext);
export { SwapProvider, useSwap };
