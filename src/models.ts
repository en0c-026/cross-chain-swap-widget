import { BoxProps } from "grommet";

interface InfraConfigurations {
  element?: Element;
}

export interface AppConfigurations {
  debug: boolean;
  swapApiBaseUrl: string;
  defaultChainId: number;
  infuraId: string;
  rpcUrls: {
    ethereum: {
      mainnet: string;
      rinkeby: string;
    }
  };
  style: StyleConfig;
  targetId: string;
}

export type Configurations = InfraConfigurations & AppConfigurations;

export type CustomBox = Omit<
  BoxProps,
  'a11yTitle' |
  'gridArea' |
  'onClick' |
  'basis' |
  'animation' |
  'focusIndicator' |
  'hoverIndicator' |
  'tag' |
  'as' |
  'wrap'>

export interface StyleConfig {
  header?: CustomBox;
  mainContainer?: CustomBox;
}

export interface ILiquidtySource {
  id: string;
  title: string;
  img: string;
}

export interface IToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}
export interface IPreset {
  complexityLevel: number;
  mainRouteParts: number;
  parts: number;
  virtualParts: number;
}

export interface ITransaction {
  from: string,
  to: string,
  data: string,
  value: string,
  gasPrice: string,
  gas: string
}