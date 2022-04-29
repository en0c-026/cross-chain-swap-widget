import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

export default function formatBalance(balance: BigNumber): string {
  return new Number(formatEther(balance)).toFixed(6)
}