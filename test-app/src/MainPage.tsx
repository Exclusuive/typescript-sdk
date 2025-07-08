import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { useGetAllCollections } from 'exclusuive-typescript-sdk';

function MainPage() {
  const account = useCurrentAccount();

  const { collections, isPending, error } = useGetAllCollections();

  console.log(collections);

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
    </div>
  );
}

export default MainPage;
