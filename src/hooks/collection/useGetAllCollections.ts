import type { FormattedCollection } from '@/types/collection';
import { useEffect, useState } from 'react';
import { collectionFetcher } from '@/api/collection';

export function useGetAllCollections() {
  const [collections, setCollections] = useState<FormattedCollection[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { getAllCollections } = collectionFetcher;

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    getAllCollections()
      .then((collections) => {
        setCollections(collections);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
}
