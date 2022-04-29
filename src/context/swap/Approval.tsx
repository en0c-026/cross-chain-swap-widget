import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import React, { createContext, ReactNode, useCallback, useContext } from 'react';
import { NATIVE_ADDRESS } from '../../constants';
import useAsync, { Status } from "../../hooks/useLoading";
import { useNotifications } from '../common/Notification';
import { useWalletProvider } from '../common/WalletProvider';
import { useDexApi } from './DexApi';
import { useTokens } from './Tokens';

interface IApprovalContext {
  checkFromTokenApproval: (amount: number) => Promise<boolean>;
  approveToken: (
    isInfiniteApproval: boolean,
    tokenAmount: number
  ) => Promise<void>;
  executeApproveToken: (
    isInfiniteApproval: boolean,
    tokenAmount: number
  ) => void;
  executeApproveTokenStatus: Status;
  executeApproveTokenError: Error | undefined;
  fetchFromTokenApproval: (amount: number) => void;
  fetchFromTokenApprovalStatus: Status;
  fetchFromTokenApprovalError: Error | undefined;
  fetchFromTokenApprovalValue: boolean | undefined;
}

const ApprovalContext = createContext<IApprovalContext | null>(null);
const ApprovalProvider = ({ children }: { children: ReactNode }) => {
  const { accounts, currentChain } = useWalletProvider()!;
  const { fromToken, tokenContract } = useTokens()!;
  const { spenderAddress, apiService } = useDexApi()!;
  const { addTxNotification } = useNotifications()!;

  const checkFromTokenApproval = useCallback(
    async (amount: number) => {
      if (
        !currentChain ||
        !spenderAddress ||
        !fromToken ||
        !accounts?.[0]
      ) {
        throw new Error("Prerequisite info missing");
      }
      if (!amount || amount <= 0) throw new Error("Invalid approval amount");

      if (fromToken.address === NATIVE_ADDRESS)
        return true;

      let tokenAllowance;
      let tokenDecimals = fromToken.decimals;
      try {
        let { allowance } = await apiService.getAllowanceAmount({
          tokenAddress: fromToken.address,
          walletAddress: accounts[0]
        });
        tokenAllowance = BigNumber.from(allowance);
      } catch (err) {
        console.error(err);
        throw err;
      }

      let rawAmount = parseUnits(amount.toString(), tokenDecimals);
      let rawAmountHexString = rawAmount.toHexString();

      if (!tokenAllowance)
        throw new Error("Unable to check for token approval");
      console.log("Token allowance is ", tokenAllowance);
      console.log("Token amount", rawAmount);
      if (tokenAllowance.lt(rawAmountHexString)) {
        return false;
      } else {
        return true;
      }
    },
    [currentChain, spenderAddress, fromToken, accounts, apiService]
  );

  const {
    execute: fetchFromTokenApproval,
    status: fetchFromTokenApprovalStatus,
    error: fetchFromTokenApprovalError,
    value: fetchFromTokenApprovalValue,
  } = useAsync(checkFromTokenApproval);


  const approveToken = useCallback(
    async (isInfiniteApproval: boolean, tokenAmount: number) => {

      if (
        !currentChain ||
        !spenderAddress ||
        !fromToken ||
        !accounts?.[0] ||
        !spenderAddress ||
        !tokenContract
      ) {
        throw new Error(
          "Unable to proceed with approval. Some information is missing. Check console for more info"
        );
      }

      try {
        let tokenDecimals = fromToken.decimals;

        // this takes a user friendly value like 0.12 ETH and then returns a BN equal to 0.12 * 10^tokenDecimals
        let rawAmount;
        if (isInfiniteApproval) {
          rawAmount = MaxUint256
        } else {
          rawAmount = parseUnits(
            tokenAmount.toString(),
            tokenDecimals
          );
        }
        let approveTx = await tokenContract.approve(
          spenderAddress,
          rawAmount
        );
        addTxNotification(
          approveTx,
          "Approval",
          `${currentChain.explorerUrl}/tx/${approveTx.hash}`
        );
        return await approveTx.wait(1);

      } catch (error: any) {
        console.error(error);
        throw error;
      }
    },
    [
      currentChain,
      spenderAddress,
      fromToken,
      accounts,
      spenderAddress,
      tokenContract,
      addTxNotification,
    ]
  );

  const {
    execute: executeApproveToken,
    status: executeApproveTokenStatus,
    error: executeApproveTokenError,
    value: executeApproveTokenResult,
  } = useAsync(approveToken);

  return (
    <ApprovalContext.Provider value={{
      approveToken,
      checkFromTokenApproval,
      fetchFromTokenApproval,
      fetchFromTokenApprovalStatus,
      fetchFromTokenApprovalError,
      fetchFromTokenApprovalValue,
      executeApproveToken,
      executeApproveTokenStatus,
      executeApproveTokenError,
    }}>
      {children}
    </ApprovalContext.Provider>
  )
}

const useApproval = () => useContext(ApprovalContext);
export { ApprovalProvider, useApproval }