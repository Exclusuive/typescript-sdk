import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSlushWallet } from "@mysten/slush-wallet";
import MainPage from "./MainPage";

const { networkConfig } = createNetworkConfig({
  // localnet: { url: getFullnodeUrl("localnet") },
  // mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: "https://rpc-testnet.suiscan.xyz:443" },
});
const queryClient = new QueryClient();
registerSlushWallet("Exclusuive");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          autoConnect={true}
          slushWallet={{
            name: "Exclusuive",
          }}
        >
          <MainPage />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
