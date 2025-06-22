import { useEffect } from "react";

export const CollectionHooks = {
  // 공통
  useGetAllCollections,
  useGetCollectionById,
  useGetCollections,
  useGetCollectionsByOwnerAddress,
  // Admin
  useGetOwnedCollections,
  // User
  useGetCollectionByBaseAddress,
  useGetCollectionByItemAddress,
  useGetCollectionByPropertyScrollAddress,
  useGetCollectionByTicketAddress,
};

// 공통
function useGetAllCollections() {
  useEffect(() => {
    console.log("testtest");
    // fetch("https://jsonplaceholder.typicode.com/todos/1")
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
  }, []);
}
function useGetCollectionById({ collectionId }: { collectionId: string }) {}
function useGetCollections({ collectionIds }: { collectionIds: string[] }) {}
function useGetCollectionsByOwnerAddress({
  accountAddress,
}: {
  accountAddress: string;
}) {}

// Admin
function useGetOwnedCollections() {}

// User
function useGetCollectionByBaseAddress({ objectId }: { objectId: string }) {}
function useGetCollectionByItemAddress({ objectId }: { objectId: string }) {}
function useGetCollectionByPropertyScrollAddress({
  objectId,
}: {
  objectId: string;
}) {}
function useGetCollectionByTicketAddress({ objectId }: { objectId: string }) {}
