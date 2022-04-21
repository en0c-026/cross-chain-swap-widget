import { h, createContext, ComponentChildren } from 'preact';
import { Configurations } from '../models';
import { useContext, useRef } from 'preact/hooks';
import DodoApiRouter from '../services/dodoApi';

const ConfigContext = createContext<Configurations>({} as Configurations);
const ServiceContext = createContext<DodoApiRouter | undefined>(undefined);

interface Props {
  children: ComponentChildren;
  config: Configurations;
}

export const WidgetProviders = ({ children, config }: Props) => {
  const services = useRef(new DodoApiRouter({
    baseUrl: config.dodoRouterApiUrl,
    debug: config.debug
  }));
  return (
    <ConfigContext.Provider value={config}>
      <ServiceContext.Provider value={services.current}>
          {children}
      </ServiceContext.Provider>
    </ConfigContext.Provider>
  );
};

export const useService = () => useContext(ServiceContext)!;
export const useConfig = () => useContext(ConfigContext);