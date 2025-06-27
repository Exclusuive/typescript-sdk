import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useGetCollectionsByOwnerAddress } from "exclusuive-sdk";
import ReactJson from "react-json-view";

function MainPage() {
  const account = useCurrentAccount();

  const { collections, isPending, error } = useGetCollectionsByOwnerAddress({
    owner: account ? account.address : "",
  });

  if (!account) {
    return (
      <div className="flex items-center justify-center p-8">
        Please Connect Wallet
        <ConnectButton />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading...
        <ConnectButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        Error: {JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="flex">
      <div>Testsetsetse</div>
      <ReactJson src={collections} collapsed={false} theme="monokai" />
    </div>
  );
}

export default MainPage;
