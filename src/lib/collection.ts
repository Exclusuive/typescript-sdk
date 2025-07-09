import type {
  CollectionSuiObjectData,
  Collection,
  CollectionData,
  FormattedCollection,
  LayerType,
  TypeConfig,
  FormattedTypeConfig,
} from '@/types/collection';
import type { SuiDynamicFieldObjectData } from '@/types/sui';
// import { StoreObjectData } from "@/types/store";
import type { SuiObjectData } from '@mysten/sui/client';

export const parseCollectionObjectData = (
  data: SuiObjectData
): CollectionSuiObjectData | null => {
  const { objectId, version, digest, type, content } = data;

  if (!content || !('fields' in content)) return null;

  const collctionData: CollectionSuiObjectData = {
    objectId,
    version,
    digest,
    type: type!,
    content: {
      dataType: content.dataType,
      type: content.type,
      hasPublicTransfer: content.hasPublicTransfer,
      fields: content.fields as Collection,
    },
  };

  // console.log(collctionData);
  return collctionData;
};

// export const parseStoreObjectData = (
//   data: SuiObjectData
// ): StoreObjectData | null => {
//   const { objectId, version, digest, type, content } = data;

//   if (!content || !("fields" in content)) return null;

//   const storeData: StoreObjectData = {
//     objectId,
//     version,
//     digest,
//     type: type!,
//     content: {
//       dataType: content.dataType,
//       type: content.type,
//       hasPublicTransfer: content.hasPublicTransfer,
//       fields: content.fields as any,
//     },
//   };

//   // console.log(collctionData);
//   return storeData;
// };

export const parseDynamicBaseTypeField = (
  data: SuiObjectData
): SuiDynamicFieldObjectData | null => {
  const { objectId, version, digest, type, content } = data;

  if (!content || !('fields' in content)) return null;

  const parsed: SuiDynamicFieldObjectData = {
    objectId,
    version,
    digest,
    type: type!,
    content: {
      dataType: content.dataType,
      type: content.type,
      hasPublicTransfer: content.hasPublicTransfer,
      fields: content.fields as any,
    },
  };

  // console.log("dynamic", parsed);

  return parsed;
};

const formatTypeConfig = (item: any): FormattedTypeConfig => {
  return {
    [item.content.fields.name.fields.name]:
      item.content.fields.value.fields.content,
  };
};

const formatAttributeType = (item: any): string => {
  return item.content.fields.name.fields.type_name;
};

const formatTicketType = (item: any): string => {
  return item.content.fields.name.fields.type_name;
};

export const formatDynamicFields = (data: SuiDynamicFieldObjectData[]) => {
  const configs = data
    .filter((item) => {
      return item.content.type.includes('TypeConfig');
    })
    .reduce((acc, item) => {
      return { ...acc, ...formatTypeConfig(item) };
    }, {} as FormattedTypeConfig);

  const attributes = data
    .filter((item) => {
      return item.content.type.includes('AttributeType');
    })
    .map((item) => {
      return formatAttributeType(item);
    });

  const ticketTypes = data
    .filter((item) => {
      return item.content.type.includes('TicketType');
    })
    .map((item) => {
      return formatTicketType(item);
    });

  return {
    configs: configs,
    attribute_types: attributes,
    ticket_types: ticketTypes,
  };
};

export const parseCreateCollectionResult = (data: any) => {
  const collection = data.find(
    (item: any) =>
      item.objectType.includes('::collection::Collection') &&
      !item.objectType.includes('::collection::CollectionCap')
  );

  const cap = data.find((item: any) =>
    item.objectType.includes('::collection::CollectionCap')
  );

  return {
    collection,
    cap,
  };
};
