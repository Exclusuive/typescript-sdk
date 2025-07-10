import { COLLECTION_EVENTS, COLLECTION_MODULE_STRUCTS } from '@/move/registry';
import {
  parseCollectionObjectData,
  parseDynamicBaseTypeField,
  formatDynamicFields,
} from '@/lib/collection';
import type { CollectionData, FormattedCollection } from '@/types/collection';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SuiDynamicFieldObjectData } from '@/types/sui';

export const collectionFetcher = {
  getAllCollections,
  getCollectionsByIds,
  getCollectionById,
  getCollectionsByOwnerAddress,

  getCollectionByMembershipId,
  getCollectionByItemId: () => {},
  getCollectionByAttributeScrollId,
  getCollectionByTicketId,
};

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

async function getAllCollections(): Promise<FormattedCollection[]> {
  try {
    const data = await client.queryEvents({
      query: {
        MoveEventType: COLLECTION_EVENTS.CollectionCreated,
      },
      order: 'ascending',
      limit: 20,
    });

    const collectionIds = data.data.flatMap((item) => {
      const content = item.parsedJson;
      if (
        content &&
        typeof content === 'object' &&
        content !== null &&
        'id' in content &&
        typeof content.id === 'string'
      ) {
        return [content.id as string];
      }
      return [];
    });

    const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
      Promise.all(
        collectionIds.map((id) =>
          client.getObject({
            id,
            options: {
              showType: true,
              showContent: true,
            },
          })
        )
      ),
      Promise.all(
        collectionIds.map((id) =>
          client
            .getDynamicFields({ parentId: id }) // line break
            .then((data) => {
              const dynamicFieldObjectIds = data.data.map((d) => {
                return d.objectId;
              });

              return client.multiGetObjects({
                ids: dynamicFieldObjectIds,
                options: { showContent: true, showType: true },
              });
            })
        )
      ),
    ]);

    const collections = collectionIds.map((id, i) => {
      if (!objectDataArray[i].data) return;

      const collectionObjectData = parseCollectionObjectData(
        objectDataArray[i].data
      );

      if (!collectionObjectData) return;

      const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
        if (!d.data) return null;
        return parseDynamicBaseTypeField(d.data);
      });

      const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
        (value) => value !== null
      );

      if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
        return;
      }

      const formattedCollection = formatDynamicFields(
        filteredDynamicFieldDatas
      );

      console.log(formattedCollection);

      return {
        id,
        name: collectionObjectData.content.fields.membership_type.fields
          .type_name,
        cap: '',
        configs: formattedCollection.configs,
        layer_types:
          collectionObjectData.content.fields.layer_order.fields.contents.map(
            (item) => {
              return item.fields.type_name;
            }
          ),
        attribute_types: formattedCollection.attribute_types,
        ticket_types: formattedCollection.ticket_types,
      } as FormattedCollection;
    });

    const collectionsWithoutNull = collections.flatMap((c) => {
      if (!c) return [];
      return c;
    });

    return collectionsWithoutNull;
  } catch (e) {
    return [];
  }
}

async function getCollectionsByIds({
  ids,
}: {
  ids: string[];
}): Promise<FormattedCollection[]> {
  return [];
}
async function getCollectionById({
  id,
}: {
  id: string;
}): Promise<FormattedCollection> {
  try {
    const objectDataArray = await client.getObject({
      id,
      options: {
        showType: true,
        showContent: true,
      },
    });

    const dynamicFieldDatasArray = await client
      .getDynamicFields({ parentId: id })
      .then((data: { data: { objectId: string }[] }) => {
        const dynamicFieldObjectIds = data.data.map((d) => d.objectId);

        return client.multiGetObjects({
          ids: dynamicFieldObjectIds,
          options: { showContent: true, showType: true },
        });
      });

    if (!objectDataArray.data) return {} as FormattedCollection;

    const collectionObjectData = parseCollectionObjectData(
      objectDataArray.data
    );

    if (!collectionObjectData) return {} as FormattedCollection;

    const parsedDynamicFieldDatas = dynamicFieldDatasArray.map((d: any) => {
      if (!d.data) return null;
      return parseDynamicBaseTypeField(d.data);
    });

    const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
      (value: any) => value !== null
    ) as SuiDynamicFieldObjectData[];

    const formattedCollection = formatDynamicFields(filteredDynamicFieldDatas);

    return {
      id,
      cap: '',
      name: collectionObjectData.content.fields.membership_type.fields
        .type_name,
      configs: formattedCollection.configs,
      layer_types:
        collectionObjectData.content.fields.layer_order.fields.contents.map(
          (item) => {
            return item.fields.type_name;
          }
        ),
      attribute_types: formattedCollection.attribute_types,
      ticket_types: formattedCollection.ticket_types,
      item_types: formattedCollection.item_types,
    } as FormattedCollection;
  } catch (e) {
    return {} as FormattedCollection;
  }
}
// TODO: 코드 정리하기
async function getCollectionsByOwnerAddress({
  owner,
}: {
  owner: string;
}): Promise<FormattedCollection[]> {
  try {
    const data = await client.getOwnedObjects({
      owner,
      filter: { StructType: COLLECTION_MODULE_STRUCTS.CollectionCap },
      options: {
        showType: true,
        showContent: true,
      },
    });

    const capIds = data.data.flatMap((item) => {
      const content = item.data?.content;
      if (
        content &&
        'fields' in content &&
        content.fields !== null &&
        'id' in content.fields &&
        typeof content.fields.id === 'object' &&
        content.fields.id !== null &&
        'id' in content.fields.id &&
        typeof content.fields.id.id === 'string'
      ) {
        return [content.fields.id.id];
      }
      return [];
    });
    const collectionIds = data.data.flatMap((item) => {
      const content = item.data?.content;
      if (
        content &&
        'fields' in content &&
        'collection_id' in content.fields &&
        typeof content.fields.collection_id === 'string'
      ) {
        return [content.fields.collection_id];
      }
      return [];
    });

    const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
      Promise.all(
        collectionIds.map((id) =>
          client.getObject({
            id,
            options: {
              showType: true,
              showContent: true,
            },
          })
        )
      ),
      Promise.all(
        collectionIds.map((id) =>
          client
            .getDynamicFields({ parentId: id }) // line break
            .then((data) => {
              const dynamicFieldObjectIds = data.data.map((d) => {
                return d.objectId;
              });

              return client.multiGetObjects({
                ids: dynamicFieldObjectIds,
                options: { showContent: true, showType: true },
              });
            })
        )
      ),
    ]);

    const collections = collectionIds.map((id, i) => {
      if (!objectDataArray[i].data) return;

      const collectionObjectData = parseCollectionObjectData(
        objectDataArray[i].data
      );

      if (!collectionObjectData) return;

      const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
        if (!d.data) return null;
        return parseDynamicBaseTypeField(d.data);
      });

      const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
        (value) => value !== null
      );

      if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
        return;
      }

      const formattedCollection = formatDynamicFields(
        filteredDynamicFieldDatas
      );

      return {
        id,
        cap: capIds[i],
        name: collectionObjectData.content.fields.membership_type.fields
          .type_name,
        configs: formattedCollection.configs,
        layer_types:
          collectionObjectData.content.fields.layer_order.fields.contents.map(
            (item) => {
              return item.fields.type_name;
            }
          ),
        attribute_types: formattedCollection.attribute_types,
        ticket_types: formattedCollection.ticket_types,
        item_types: formattedCollection.item_types,
      } as FormattedCollection;
    });

    const collectionsWithoutNull = collections.flatMap((c) => {
      if (!c) return [];
      return c;
    });

    return collectionsWithoutNull;
  } catch (e) {
    return [];
  }
}

async function getCollectionByMembershipId({
  id,
}: {
  id: string;
}): Promise<CollectionData> {
  return {} as CollectionData;
}
async function getCollectionByItemId({
  id,
}: {
  id: string;
}): Promise<CollectionData> {
  return {} as CollectionData;
}
async function getCollectionByAttributeScrollId({
  id,
}: {
  id: string;
}): Promise<CollectionData> {
  return {} as CollectionData;
}
async function getCollectionByTicketId({
  id,
}: {
  id: string;
}): Promise<CollectionData> {
  return {} as CollectionData;
}
