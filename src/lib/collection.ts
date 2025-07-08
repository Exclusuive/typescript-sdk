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

const formatLayerType = (item: any): string => {
  return item.content.fields.value.fields.type_name;
};

export const formatDynamicFields = (data: SuiDynamicFieldObjectData[]) => {
  const configs = data
    .filter((item) => {
      return item.content.type.includes('TypeConfig');
    })
    .reduce((acc, item) => {
      return { ...acc, ...formatTypeConfig(item) };
    }, {} as FormattedTypeConfig);

  return {
    configs: configs,
  };

  // return {
  //   id: data.id,
  //   cap: data.cap,
  //   name: data.objectData.content.fields.membership_type.fields.type_name,
  //   configs: data.dynamicFieldData.filter((item) => item.content.type.includes('TypeConfig')).map((item : LayerType) => {
  //     return {
  //       [item.content.fields.name.fields.type_name]: item.content.fields.value.fields.content,
  //     };
  //   }),
  //   item_types: data.dynamicFieldData.filter((item) => item.content.type.includes('ItemType')).map((item) => {
  //     return {
  //       type: item.content.fields.name.fields.type_name,
  //       collection_id: item.content.fields.value.fields.collection_id,
  //       img_url: item.content.fields.value.fields.img_url,
  //       layer_type: item.content.fields.value.fields.layer_type,
  //       description: item.content.fields.value.fields.description,
  //       attrivutes: item.content.fields.value.fields.attrivutes,
  //     };
  //   }),
  //   layer_types: data.dynamicFieldData.filter((item) => item.content.type.includes('LayerType')).map((item) => {
  //     return {
  //       type: item.content.fields.name.fields.type_name,
  //       order: item.content.fields.value.fields.order,
  //     };
  //   }),
  //   attribute_types: data.dynamicFieldData.filter((item) => item.content.type.includes('AttributeType')).map((item) => {
  //     return {
  //       type: item.content.fields.name.fields.type_name,
  //     };
  //   }),
  //   ticket_types: data.dynamicFieldData.filter((item) => item.content.type.includes('TicketType')).map((item) => {
  //     return {
  //       type: item.content.fields.name.fields.type_name,
  //     };
  //   }),
  // };
};
