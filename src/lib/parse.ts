import type { MoveStruct, MoveValue, SuiParsedData } from "@mysten/sui/client";

function parseSuiParsedData(data: SuiParsedData): any {
  if (data.dataType === "moveObject") {
    return {
      type: data.type,
      hasPublicTransfer: data.hasPublicTransfer,
      parsedFields: parseMoveStruct(data.fields),
    };
  } else if (data.dataType === "package") {
    return {
      packageType: "package",
      disassembledKeys: Object.keys(data.disassembled),
    };
  }
}

function isStructWithTypeAndFields(
  struct: any
): struct is { fields: Record<string, MoveValue>; type: string } {
  return (
    struct &&
    typeof struct === "object" &&
    "fields" in struct &&
    "type" in struct &&
    typeof struct.fields === "object" &&
    !Array.isArray(struct.fields) &&
    typeof struct.type === "string" &&
    struct.fields
  );
}

function parseMoveStruct(struct: MoveStruct, depth = 0): any {
  if (Array.isArray(struct)) {
    return struct.map((value) => parseMoveValue(value, depth + 1));
  }

  if (struct && typeof struct === "object") {
    if (
      isStructWithTypeAndFields(struct)
      // "fields" in struct &&
      // typeof struct.fields === "object" &&
      // struct.fields &&
      // "type" in struct &&
      // typeof struct.type === "string" &&
      // struct.type
    ) {
      const parsedFields: Record<string, any> = {};
      for (const key in struct.fields) {
        parsedFields[key] = parseMoveValue(struct.fields[key], depth + 1);
      }
      return {
        type: struct.type,
        fields: parsedFields,
      };
    } else {
      const flatObject: Record<string, any> = {};
      for (const key in struct) {
        flatObject[key] = parseMoveValue(struct[key], depth + 1);
      }
      return flatObject;
    }
  }

  return struct;
}

function parseMoveValue(value: MoveValue, depth = 0): any {
  if (value === null) return null;

  if (Array.isArray(value)) {
    return value.map((v) => parseMoveValue(v, depth + 1));
  }

  if (typeof value === "object") {
    // struct 또는 id-object 또는 variant 등 추론
    if ("fields" in value || "type" in value) {
      return parseMoveStruct(value as MoveStruct, depth + 1);
    }
    if ("id" in value && typeof value.id === "string") {
      return { id: value.id };
    }
    return parseMoveStruct(value as MoveStruct, depth + 1);
  }

  // number, string, boolean
  return value;
}
