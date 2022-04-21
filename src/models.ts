import { BoxProps } from "grommet";

interface InfraConfigurations {
  element?: Element;
}

export interface AppConfigurations {
  debug: boolean;
  targetId: string;
  dodoRouterApiUrl: string;
  style: StyleConfig;
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

