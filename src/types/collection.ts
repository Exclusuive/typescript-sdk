import type { SuiObjectData } from "@mysten/sui/client";
import type { SuiDynamicFieldObjectData, SuiVecSet, UID } from "./sui";

export interface CollectionData {
  id: string;
  cap: string;
  objectData: CollectionSuiObjectData;
  dynamicFieldData: SuiDynamicFieldObjectData[];
}

export interface CollectionSuiObjectData extends SuiObjectData {
  type: string;
  content: {
    dataType: "moveObject";
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

export interface ItemType {
  type: string;
  fields: {
    collection_id: string;
    layer_type: LayerType;
    type_name: string;
  };
}

export interface AttributeType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}

export interface TicketType {
  type: string;
  fields: {
    collection_id: string;
    type_name: string;
  };
}
