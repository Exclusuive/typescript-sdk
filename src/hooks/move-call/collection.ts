import {
  COLLECTION_MODULE_FUNCTIONS,
  COLLECTION_MODULE_STRUCTS,
  MODULE,
  ORIGIN_PACKAGE_ID,
  UPGRADED_PACKAGE_ID,
} from '@/move/registry';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/dist/cjs/transactions';
import { toast } from 'sonner';

export function useCreateCollection() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const { COLLECTION } = MODULE;
  const { new_collection, register_layer_type, register_type_config } =
    COLLECTION_MODULE_FUNCTIONS;
  const { MembershipType, Collection } = COLLECTION_MODULE_STRUCTS;

  const createCollection = ({
    collectionName,
    bannerImgURL,
    description,
    layers,
  }: {
    collectionName: string;
    bannerImgURL: string;
    description: string;
    layers: string[];
  }) => {
    if (!account) return;
    toast.dismiss();
    toast.loading('Loading...');

    const tx = new Transaction();
    const [col, cap] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      function: new_collection,
      arguments: [tx.pure.string(collectionName)],
    });

    layers.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        function: register_layer_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      function: COLLECTION_MODULE_FUNCTIONS.register_type_config,
      typeArguments: [`${ORIGIN_PACKAGE_ID}::${COLLECTION}::${MembershipType}`],
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(collectionName),
        tx.pure.string('img_url'),
        tx.pure.string(bannerImgURL),
      ],
    });

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      function: register_type_config,
      typeArguments: [`${ORIGIN_PACKAGE_ID}::${COLLECTION}::${MembershipType}`],
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(collectionName),
        tx.pure.string('description'),
        tx.pure.string(description),
      ],
    });

    tx.moveCall({
      package: '0x2',
      module: 'transfer',
      function: 'public_share_object',
      typeArguments: [`${ORIGIN_PACKAGE_ID}::${COLLECTION}::${Collection}`],
      arguments: [tx.object(col)],
    });

    tx.transferObjects([cap], tx.pure.address(account.address));

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success(`Success! digset: ${data.digest}`);
          setTimeout(() => {
            console.log('refetch');
          }, 1000);
        },
        onError: (err) => {
          toast.dismiss();
          toast.error(`Success! Error: ${err}`);
        },
      }
    );
  };
  return {
    createCollection,
  };
}
