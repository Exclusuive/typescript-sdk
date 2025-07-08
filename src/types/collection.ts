import type { SuiObjectData } from '@mysten/sui/client';
import type { SuiDynamicFieldObjectData, SuiVecSet, UID } from './sui';

export interface CollectionData {
  id: string;
  cap: string;
  objectData: CollectionSuiObjectData;
  dynamicFieldData: SuiDynamicFieldObjectData[];
}

export interface CollectionSuiObjectData extends SuiObjectData {
  type: string;
  content: {
    dataType: 'moveObject';
    type: string;
    hasPublicTransfer: boolean;
    fields: Collection;
  };
  // display: DisplayFieldsResponse;
}

export type Collection = {
  id: UID;
  membership_type: MembershipType;
  layer_order: SuiVecSet<LayerType>;
  balance: string;
  version: string;
};

// ==================================
// ============ Collection Metadata Type
// ==================================

export interface TypeConfig {
  type: string;
  fields: {
    id: {
      id: string;
    };
    name: {
      type: string;
      fields: {
        name: string;
        type_name: string;
      };
    };
    value: {
      type: string;
      fields: {
        content: string;
      };
    };
  };
}
export interface MembershipType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}
export interface LayerType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}

export interface FormattedCollection {
  id: string;
  name: string;
  cap?: string;
  configs?: FormattedTypeConfig;
  item_types?: FormattedItemType[];
  layer_types?: string[];
  attribute_types?: FormattedAttributeType[];
  ticket_types?: FormattedTicketType[];
}

export interface FormattedTypeConfig {
  [key: string]: string;
}

export interface FormattedItemType {
  type: string;
  collection_id: string;
  img_url: string;
  layer_type: string;
  description?: string;
  attrivutes?: Record<string, string>;
}

export interface FormattedAttributeType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}

export interface FormattedTicketType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}
