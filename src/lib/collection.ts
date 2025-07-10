import type {
  CollectionSuiObjectData,
  Collection,
  FormattedTypeConfig,
  FormattedItemContentsType,
  FormattedItemType,
} from '@/types/collection';
import type { SuiDynamicFieldObjectData } from '@/types/sui';
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

const formatItemTypeContents = (item: any): FormattedItemContentsType => {
  return {
    type_name: item.content.fields.name.fields.type_name,
    name: item.content.fields.name.fields.name,
    [item.content.fields.name.fields.name]:
      item.content.fields.value.fields.content,
  };
};

const formatItemAttributes = (raw: string) => {
  const attributes = raw.split(',');
  return attributes.map((attribute) => {
    const [name, value] = attribute.split(':');
    return { name: name.trim(), value: parseInt(value.trim()) };
  });
};

export const formatDynamicFields = (data: SuiDynamicFieldObjectData[]) => {
  const base_configs = data
    .filter((item) => {
      return (
        item.content.type.includes('TypeConfig') &&
        item.content.type.includes('MembershipType')
      );
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

  const item_types = data
    .filter((item) => {
      return item.content.type.endsWith('::ItemType>');
    })
    .map((item: any) => {
      return {
        name: item.content.fields.name.fields.type_name,
        layer: item.content.fields.value.fields.layer_type.fields.type_name,
      } as FormattedItemType;
    });

  const item_configs = data
    .filter((item) => {
      return (
        item.content.type.includes('TypeConfig') &&
        item.content.type.includes('ItemType')
      );
    })
    .map((item) => {
      return formatItemTypeContents(item);
    });

  for (const item of item_types) {
    for (const entry of item_configs) {
      if (item.name === entry.type_name) {
        for (const key in entry) {
          if (key !== 'type_name' && key !== 'name') {
            item[key as keyof typeof item] = entry[key as keyof typeof entry];
          }
        }
      }
    }
  }

  return {
    configs: base_configs,
    attribute_types: attributes,
    ticket_types: ticketTypes,
    item_types: item_types,
  };
};

// PARSE RESULT

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

export const parseAddItemTypeResult = (data: any) => {
  const item_type = data.find((item: any) =>
    item.objectType.includes('::collection::ItemType')
  );

  return {
    item_type,
  };
};
