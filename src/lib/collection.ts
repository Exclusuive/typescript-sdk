import type { CollectionSuiObjectData, Collection } from "@/types/collection";
import type { SuiDynamicFieldObjectData } from "@/types/sui";
// import { StoreObjectData } from "@/types/store";
import type { SuiObjectData } from "@mysten/sui/client";

export const parseCollectionObjectData = (
  data: SuiObjectData
): CollectionSuiObjectData | null => {
  const { objectId, version, digest, type, content } = data;

  if (!content || !("fields" in content)) return null;

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

  if (!content || !("fields" in content)) return null;

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
