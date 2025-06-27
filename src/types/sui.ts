import type { MoveStruct, SuiObjectData } from "@mysten/sui/client";

export interface UID {
  id: string;
}

export interface SuiVecSet<T> {
  type: string;
  fields: {
    contents: T[];
  };
}

export interface SuiDynamicFieldObjectData extends SuiObjectData {
  content: {
    dataType: "moveObject";
    hasPublicTransfer: boolean;
    type: string;
    fields: {
      id: {
        id: string;
      };
      name: {
        type: string;
        fields: MoveStruct;
      };
      value: {
        type: string;
        fields: MoveStruct;
      };
    };
  };
}
