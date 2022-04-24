import { h, createContext, ComponentChildren } from "preact";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useConfig } from ".";
import { ChainConfig } from "../models";
import { hexlify } from "@ethersproject/bytes";

interface IWalletProviderContext {
  accounts: string[] | undefined;
  connect: Web3Modal["connect"];
  chainsSupported: ChainConfig[];
  currentChain: ChainConfig | undefined;
  disconnect: Web3Modal["clearCachedProvider"];
  isLoggedIn: boolean;
  rawEthereumProvider: undefined | any;
  signer: JsonRpcSigner | undefined;
  walletProvider: Web3Provider | undefined;
  web3Modal: Web3Modal | undefined;
  switchChain: (targetChain: ChainConfig) => Promise<void>;
}

const WalletProviderContext = createContext<IWalletProviderContext | null>(null);

export default function WalletProviderProvider({ children }: { children: ComponentChildren }) {

  const { bcnmyApiKeys, infuraId, rpcUrls } = useConfig();
  const [accounts, setAccounts] = useState<string[]>();
  const [currentChain, setCurrentChain] = useState<ChainConfig>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [rawEthereumProvider, setRawEthereumProvider] = useState<any>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [walletProvider, setWalletProvider] = useState<undefined | Web3Provider>();
  const [web3Modal, setWeb3Modal] = useState<undefined | Web3Modal>();

  const chainsSupported: ChainConfig[] = [
    {
      name: "Avalanche",
      image: 'https://app.1inch.io/assets/images/network-logos/avalanche.svg',
      subText: "Avalanche mainnet",
      chainId: 43114,
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      currency: "AVAX",
      nativeToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      nativeDecimal: 18,
      nativeFaucetURL: "",
      biconomy: {
        enable: false,
        apiKey: bcnmyApiKeys.avalanche,
      },
      assetSentTopicId: "0xec1dcc5633614eade4a5730f51adc7444a5103a8477965a32f2e886f5b20f694",
      networkAgnosticTransfer: false, // Set this to enable network agnostic gasless transactions
      graphURL: "https://api.thegraph.com/subgraphs/name/divyan73/hyphen-avalanche",
      explorerUrl: "https://snowtrace.io"
    },
    {
      name: "Ethereum",
      image: 'https://app.1inch.io/assets/images/network-logos/ethereum.svg',
      subText: "Ethereum Mainnet",
      chainId: 1,
      rpcUrl: rpcUrls.ethereum.mainnet,
      currency: "ETH",
      nativeToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      nativeDecimal: 18,
      nativeFaucetURL: "",
      assetSentTopicId: "0xec1dcc5633614eade4a5730f51adc7444a5103a8477965a32f2e886f5b20f694",
      biconomy: {
        enable: false,
        apiKey: bcnmyApiKeys.ethereum,
      },
      graphURL: "https://api.thegraph.com/subgraphs/name/divyan73/hyphenethereumv2",
      networkAgnosticTransfer: false,
      explorerUrl: "https://etherscan.io/",
    },
    {
      name: "Polygon",
      image: 'https://app.1inch.io/assets/images/network-logos/polygon.svg',
      subText: "Polygon Mainnet",
      chainId: 137,
      rpcUrl: "https://polygon-rpc.com/",
      currency: "MATIC",
      nativeToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      nativeDecimal: 18,
      nativeFaucetURL: "",
      biconomy: {
        enable: true,
        apiKey: bcnmyApiKeys.polygon,
      },
      assetSentTopicId: "0xec1dcc5633614eade4a5730f51adc7444a5103a8477965a32f2e886f5b20f694",
      networkAgnosticTransfer: true,
      graphURL: "https://api.thegraph.com/subgraphs/name/divyan73/hyphenpolygonv2",
      explorerUrl: "https://polygonscan.com",
    }
  ]

  useEffect(() => {
    if (
      rawEthereumProvider &&
      walletProvider &&
      currentChain &&
      accounts &&
      accounts[0] &&
      accounts[0].length > 0
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [rawEthereumProvider, walletProvider, currentChain, accounts]);

  useEffect(() => {
    if (!walletProvider) return;
    setSigner(walletProvider.getSigner());
  }, [walletProvider]);

  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        // network: "mumbai", // optional
        cacheProvider: true, // optional
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: infuraId, // required
            },
          },
        },
      })
    );
  }, []);

  // because provider does not fire events initially, we need to fetch initial values for current chain from walletProvider
  // subsequent changes to these values however do fire events, and we can just use those event handlers
  useEffect(() => {
    if (!walletProvider) return;
    (async () => {
      let { chainId } = await walletProvider.getNetwork();
      chainsSupported.map(chain => {
        if (chain.chainId === chainId) {
          setCurrentChain(chain)
        }
      })
      let accounts = await walletProvider.listAccounts();
      setAccounts(accounts.map((a) => a.toLowerCase()));
    })();
  }, [walletProvider]);

  const reinit = (changedProvider: any) => {
    setWalletProvider(new Web3Provider(changedProvider));
  };

  // setup event handlers for web3 provider given by web3-modal
  // this is the provider injected by metamask/fortis/etc
  useEffect(() => {
    if (!rawEthereumProvider) return;

    function handleAccountsChanged(accounts: string[]) {
      console.log("accountsChanged!");
      setAccounts(accounts.map((a) => a.toLowerCase()));
      reinit(rawEthereumProvider);
    }

    // Wallet documentation recommends reloading page on chain change.
    // Ref: https://docs.metamask.io/guide/ethereum-provider.html#events
    function handleChainChanged(chainId: string | number) {
      console.log("chainChanged!");
      if (typeof chainId === "string") {
        let chainIdParsed = Number.parseInt(chainId)
        chainsSupported.map(chain => {
          if (chain.chainId === chainIdParsed) {
            setCurrentChain(chain)
          }
        })
      } else {
        chainsSupported.map(chain => {
          if (chain.chainId === chainId) {
            setCurrentChain(chain)
          }
        })
      }
      reinit(rawEthereumProvider);
    }

    function handleConnect(info: { chainId: number }) {
      console.log("connect!");
      chainsSupported.map(chain => {
        if (chain.chainId === info.chainId) {
          setCurrentChain(chain)
        }
      })
      reinit(rawEthereumProvider);
    }

    function handleDisconnect(error: { code: number; message: string }) {
      console.log("disconnect");
      console.error(error);
    }

    // Subscribe to accounts change
    rawEthereumProvider.on("accountsChanged", handleAccountsChanged);

    // Subscribe to network change
    rawEthereumProvider.on("chainChanged", handleChainChanged);

    // Subscribe to provider connection
    rawEthereumProvider.on("connect", handleConnect);

    // Subscribe to provider disconnection
    rawEthereumProvider.on("disconnect", handleDisconnect);

    // Remove event listeners on unmount!
    return () => {
      rawEthereumProvider.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
      rawEthereumProvider.removeListener("networkChanged", handleChainChanged);
      rawEthereumProvider.removeListener("connect", handleConnect);
      rawEthereumProvider.removeListener("disconnect", handleDisconnect);
    };
  }, [rawEthereumProvider]);

  const connect = useCallback(async () => {
    if (!web3Modal) {
      console.error("Web3Modal not initialized.");
      return;
    }
    let provider = await web3Modal.connect();
    setRawEthereumProvider(provider);
    setWalletProvider(new Web3Provider(provider));
  }, [web3Modal]);

  const disconnect = useCallback(async () => {
    if (!web3Modal) {
      console.error("Web3Modal not initialized.");
      return;
    }
    web3Modal.clearCachedProvider();
    setRawEthereumProvider(undefined);
    setWalletProvider(undefined);
  }, [web3Modal]);

  const switchChain = useCallback(async (targetChain: ChainConfig) => {
    const chainIdHex = hexlify(targetChain.chainId);
    try {
      await rawEthereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      })
    } catch (error) {
      try {
        if (error.code === 4902) {
          await rawEthereumProvider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              blockExplorerUrls: [targetChain.explorerUrl],
              chainName: targetChain.name,
              iconUrls: [targetChain.image],
              nativeCurrency: {
                name: targetChain.name,
                symbol: targetChain.currency,
                decimals: targetChain.nativeDecimal,
              },
              rpcUrls: [targetChain.rpcUrl],
            }],
          })
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [rawEthereumProvider])

  return (
    <WalletProviderContext.Provider
      value={{
        accounts,
        connect,
        chainsSupported,
        currentChain,
        disconnect,
        isLoggedIn,
        rawEthereumProvider,
        signer,
        walletProvider,
        web3Modal,
        switchChain
      }}
    >
      {children}
    </WalletProviderContext.Provider>
  );
};

const useWalletProvider = () => useContext(WalletProviderContext);
export { WalletProviderProvider, useWalletProvider };
