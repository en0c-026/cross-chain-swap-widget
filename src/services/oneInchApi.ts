import axios, { AxiosError, AxiosInstance } from 'axios';
import { ILiquidtySource, IToken, IPreset, ITransaction } from '../models';

interface ApproveDataReq {
  tokenAddress: string;
  amount: string;
}
interface ApproveDataRes {
  data: string;
  gasPrice: string;
  to: string;
  value: string;
}
interface AllowanceAmountReq {
  tokenAddress: string;
  walletAddress: string;
}

interface LiquiditySourcesRes {
  protocols: ILiquidtySource[];
}

interface TokenListRes {
  tokens: { [key: string]: IToken }
}
interface PresetsRes {
  MAX_RESULT: IPreset[]; 
  LOWEST_GAS: IPreset[]
}

interface BestQuoteReq {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  protocols?: string;
  fee?: string;
  gasLimit?: string;
  connectorTokens?: number;
  complexityLevel?: number;
  mainRouteParts?: number;
  parts?: number;
  gasPrice?: string;
}

interface BestQuoteRes{
  fromToken: IToken;
  toToken: IToken;
  fromTokenAmount: string;
  toTokenAmount: string;
  protocols: any;
  estimateGas: number;
}

interface SwapDataReq {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromAddress: string;
  slippage: number;
  protocols?: string;
  destReceiver?: string;
  referrerAddress?: string;
  fee?: number;
  gasPrice?: string;
  disableEstimate?: boolean;
  permit?: string;
  burnChi?: boolean;
  allowPartiall?: boolean;
  parts?: number;
  mainRouteParts?: number;
  connectorTokens?: number;
  complexityLevel?: number;
  gasLimit?: string;
}

interface SwapDataRes {
  fromToken: IToken;
  toToken: IToken;
  fromTokenAmount: string;
  toTokenAmount: string;
  protocols: any;
  tx: ITransaction
}

export interface swapApiBase {
  setCurrentChainId: (chainId: string | number) => void;
  healthCheck: () => Promise<{ status: string }>;
  getSpenderApprove: () => Promise<{ address: string }>
  getApproveData: (params: ApproveDataReq) => Promise<ApproveDataRes>;
  getAllowanceAmount: (params: AllowanceAmountReq) => Promise<{ allowance: string; }>;
  getLiquiditySources: () => Promise<LiquiditySourcesRes>;
  getTokenList: () => Promise<TokenListRes>;
  getPresets: () => Promise<PresetsRes>;
  getBestQuote: (params: BestQuoteReq) => Promise<BestQuoteRes>;
  getSwapData: (params: SwapDataReq) => Promise<SwapDataRes>;
}

interface Options {
  baseUrl: string;
  chainId: number | string;
  debug?: boolean;
}

interface RequestParams {
  path: string;
  method: 'GET' | 'POST';
  requestData?: any;
}

export default class OneInchApi implements swapApiBase {
  private readonly client: AxiosInstance;
  public currenChainId: number;

  constructor({ baseUrl, chainId, debug }: Options) {
    this.client = axios.create({ baseURL: baseUrl });

    if (typeof chainId === 'string') {
      this.currenChainId = parseInt(chainId);
    } else {
      this.currenChainId = chainId;
    }

    this.client.interceptors.response.use(
      undefined,
      (error: AxiosError) => {
        console.log(`Failed to call API`, error.response?.status, error.response?.data);
        return Promise.reject(error);
      });
    if (debug) {
      this.useDebugLogs();
    }

  }


  public setCurrentChainId(newChainId: string | number) {
    if (!newChainId) {
      throw new Error("chainId is not defined");
    }
    if (typeof newChainId === 'string') {
      this.currenChainId = parseInt(newChainId);
    } else {
      this.currenChainId = newChainId;
    }
  }


  // public async getDodoRoute(params: DodoRequest): Promise<DodoResponse> {

  //   return await this.callApi<DodoResponse>({
  //       path: '/getdodoroute',
  //       method: 'GET',
  //       requestData: params
  //     });
  // }


  public async healthCheck(): Promise<{ status: string }> {
    return await this.callApi<{ status: string }>({
      path: `/${this.currenChainId}/healthcheck`,
      method: 'GET'
    })
  }

  public async getSpenderApprove(): Promise<{ address: string }> {
    return await this.callApi<{ address: string }>({
      path: `/${this.currenChainId}/approve/spender`,
      method: 'GET'
    })
  }

  public async getApproveData(params: ApproveDataReq): Promise<ApproveDataRes> {
    return await this.callApi<ApproveDataRes>({
      path: `/${this.currenChainId}/approve/transaction`,
      method: 'GET',
      requestData: params
    })
  }

  public async getAllowanceAmount(params: AllowanceAmountReq): Promise<{ allowance: string }> {
    return await this.callApi<{ allowance: string }>({
      path: `/${this.currenChainId}/approve/allowance`,
      method: 'GET',
      requestData: params
    })
  }

  public async getLiquiditySources(): Promise<LiquiditySourcesRes> {
    return await this.callApi<LiquiditySourcesRes>({
      path: `/${this.currenChainId}/liquidity-sources`,
      method: 'GET',
    })
  }

  public async getTokenList(): Promise<TokenListRes> {
    return await this.callApi<TokenListRes>({
      path: `/${this.currenChainId}/tokens`,
      method: 'GET',
    })
  }

  public async getPresets(): Promise<PresetsRes> {
    return await this.callApi<PresetsRes>({
      path: `/${this.currenChainId}/presets`,
      method: 'GET',
    })
  }

  public async getBestQuote (params: BestQuoteReq): Promise<BestQuoteRes> {
    return await this.callApi<BestQuoteRes>({
      path: `/${this.currenChainId}/quote`,
      method: 'GET',
      requestData: params
    })
  }

  public async getSwapData(params: SwapDataReq): Promise<SwapDataRes> {
    return await this.callApi<SwapDataRes>({
      path: `/${this.currenChainId}/swap`,
      method: 'GET',
      requestData: params
    })
  }
  /**
   * Helper with saint defaults to perform an HTTP call.
   * @param request A request to perform.
   */
  private callApi<T>(request: RequestParams): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client
        .request<T>({
          url: request.path,
          method: request.method,
          params: request.requestData,
          responseType: 'json'
        })
        .then((response) =>
          response?.status && response.status >= 200 && response.status < 400
            ? resolve(response?.data)
            : reject(response?.data)
        )
        .catch((error: AxiosError) => reject(error.response ?? error.message));
    });
  }

  private useDebugLogs() {
    this.client.interceptors.request.use((config) => {
      console.info('Calling API', config.url, config.params);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        console.info('Got response from API', response.config.url, response.data);
        return response;
      },
      (error: AxiosError) => {
        console.info('There was an error calling API',
          error.request?.url, error.response?.status, error.message);
        return Promise.reject(error);
      });
  }

}
