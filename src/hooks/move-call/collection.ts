import {
  COLLECTION_MODULE_STRUCTS,
  MODULE,
  UPGRADED_PACKAGE_ID,
  COLLECTION_MODULE_FUNCTIONS,
} from '@/move/registry';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import {
  parseAddItemTypeResult,
  parseCreateCollectionResult,
} from '@/lib/collection';
import { SuiTransactionBlockResponse } from '@mysten/sui/dist/cjs/client';

export function useCreateCollection() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    collection: {
      objectId: string;
    };
    cap: {
      objectId: string;
    };
  } | null>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const { COLLECTION } = MODULE;

  const createCollection = ({
    name,
    imgUrl,
    description,
    layers,
  }: {
    name: string;
    imgUrl?: string;
    description?: string;
    layers?: string[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();
    const [col, cap] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.new_collection,
      arguments: [tx.pure.string(name)],
    });

    layers?.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_layer_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    if (imgUrl) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('img_url'),
          tx.pure.string(imgUrl),
        ],
      });
    }

    if (description) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('description'),
          tx.pure.string(description),
        ],
      });
    }

    tx.moveCall({
      package: '0x2',
      module: 'transfer',
      function: 'public_share_object',
      typeArguments: [COLLECTION_MODULE_STRUCTS.Collection],
      arguments: [tx.object(col)],
    });

    tx.transferObjects([cap], tx.pure.address(account.address));

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data: SuiTransactionBlockResponse) => {
          const { collection, cap } = parseCreateCollectionResult(
            data.objectChanges
          );

          setResult({
            collection,
            cap,
          });
          setIsPending(false);
        },
        onError: (err: any) => {
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      }
    );
  };

  return {
    createCollection,
    isPending,
    error,
    result,
  };
}

export function useUpdateCollection() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    description?: string;
    img_url?: string;
    layer_types?: string[];
    attribute_types?: string[];
    ticket_types?: string[];
  } | null>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const { COLLECTION } = MODULE;

  const updateCollection = ({
    col,
    cap,
    name,
    img_url,
    description,
    layer_types,
    attribute_types,
    ticket_types,
  }: {
    col: string;
    cap: string;
    name: string;
    img_url?: string;
    description?: string;
    layer_types?: string[];
    attribute_types?: string[];
    ticket_types?: string[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    layer_types?.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_layer_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    attribute_types?.forEach((attribute) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_attribute_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(attribute)],
      });
    });

    ticket_types?.forEach((ticket) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_ticket_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(ticket)],
      });
    });

    if (img_url) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.update_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('img_url'),
          tx.pure.string(img_url),
        ],
      });
    }

    if (description) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.update_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('description'),
          tx.pure.string(description),
        ],
      });
    }

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          setIsPending(false);
          setResult({
            description: description,
            img_url: img_url,
            layer_types: layer_types,
            attribute_types: attribute_types,
            ticket_types: ticket_types,
          });
        },
        onError: (err: any) => {
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      }
    );
  };

  return {
    updateCollection,
    isPending,
    error,
    result,
  };
}

export function useAddItemType() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    name: string;
    address: string;
    img_url: string;
    layer: string;
    description?: string;
    attributes?: string;
  } | null>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const { COLLECTION } = MODULE;

  const addItemType = ({
    col,
    cap,
    layer,
    name,
    img_url,
    description,
    attributes,
  }: {
    col: string;
    cap: string;
    layer: string;
    name: string;
    img_url: string;
    description?: string;
    attributes?: {
      name: string;
      value: string;
    }[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.register_item_type,
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(layer),
        tx.pure.string(name),
        tx.pure.string(img_url),
      ],
    });

    if (description) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.ItemType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('description'),
          tx.pure.string(description),
        ],
      });
    }

    if (attributes) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.ItemType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string('attributes'),
          tx.pure.string(
            attributes
              .map((attribute) => `${attribute.name}:${attribute.value}`)
              .join(',')
          ),
        ],
      });
    }

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (res: SuiTransactionBlockResponse) => {
          const { item_type } = parseAddItemTypeResult(res.objectChanges);

          setResult({
            name,
            address: item_type.objectId,
            img_url: img_url,
            layer: layer,
            description: description,
            attributes: attributes
              ? attributes
                  .map((attribute) => `${attribute.name}:${attribute.value}`)
                  .join(',')
              : '',
          });
          setIsPending(false);
        },
        onError: (err: any) => {
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      }
    );
  };

  return {
    addItemType,
    isPending,
    error,
    result,
  };
}
