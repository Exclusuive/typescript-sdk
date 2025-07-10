import type { FormattedCollection } from '@/types/collection';
import { useEffect, useState } from 'react';
import { collectionFetcher } from '@/api/collection';

export function useGetCollectionById({ id }: { id: string }) {
  const [collection, setCollection] = useState<FormattedCollection>();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { getCollectionById } = collectionFetcher;

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    getCollectionById({ id })
      .then((collection) => {
        setCollection(collection);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [id, refetchSwitch]);

  return {
    collection,
    isPending,
    error,
    refetch,
  };
}
