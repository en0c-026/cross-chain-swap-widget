import axios, { AxiosError, AxiosInstance } from 'axios';

export interface DodoRequest {
  fromTokenAddress: string;
  fromTokenDecimals: number;
  toTokenAddress: string;
  toTokenDecimals: number;
  fromAmount: string;
  slippage: number;
  userAddr: string;
  chainId: number;
  rpc: string;
  deadLine?: number;
  source?: string;
}

export interface DodoResponse {
  status: number;
  data: {
    resAmount: string;
    resPricePerToToken: string;
    resPricePerFromToken: string;
    priceImpact: string;
    targetApproveAddr: string;
    to: string;
    data: string;
  }
}

export interface DodoApiBase {
  getDodoRoute: (params: DodoRequest) => Promise<DodoResponse>;
}

interface Options {
  baseUrl: string;
  debug?: boolean;
}

interface RequestParams {
  path: string;
  method: 'GET';
  requestData: DodoRequest;
}

export default class DodoApiRouter implements DodoApiBase {
  private readonly client: AxiosInstance;

  constructor({ baseUrl, debug }: Options) {
    this.client = axios.create({ baseURL: baseUrl });

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

  public async getDodoRoute(params: DodoRequest): Promise<DodoResponse> {

    return await this.callApi<DodoResponse>({
        path: '/getdodoroute',
        method: 'GET',
        requestData: params
      });
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
