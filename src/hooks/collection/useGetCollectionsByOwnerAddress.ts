import type { FormattedCollection } from '@/types/collection';
import { useEffect, useState } from 'react';
import { collectionFetcher } from '@/api/collection';

export function useGetCollectionsByOwnerAddress({ owner }: { owner: string }) {
  const [collections, setCollections] = useState<FormattedCollection[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { getCollectionsByOwnerAddress } = collectionFetcher;

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    getCollectionsByOwnerAddress({ owner })
      .then((collections) => {
        setCollections(collections);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [owner, refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
}
