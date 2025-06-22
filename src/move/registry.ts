export const ORIGIN_PACKAGE_ID = "0x123456..."; // Optional: 패키지 ID
export const UPGRADED_PACKAGE_ID = "0x123456..."; // Optional: 패키지 ID

export const MODULE = {
  COLLECTION: "collection",
  MEMBERSHIP_POLICY: "membership_policy",
} as const;

// =====================================
// ================== Collection Module
// =====================================
const COLLECTION_MODULE_FUNCTION_NAMES = {
  CREATE_COLLECTION: "create_collection",
} as const;

export const COLLECTION_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(COLLECTION_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.COLLECTION}::${func}`,
  ])
) as Record<keyof typeof COLLECTION_MODULE_FUNCTION_NAMES, string>;

const COLLECTION_MODULE_STRUCT_NAMES = {
  COLLECTION: "Collection",
} as const;

export const COLLECTION_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(COLLECTION_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.COLLECTION}::${struct}`,
  ])
) as Record<keyof typeof COLLECTION_MODULE_STRUCT_NAMES, string>;

// =====================================
// ================== Membership Policy Module
// =====================================
const MEMBERSHIP_POLICY_MODULE_FUNCTION_NAMES = {
  NEW: "new",
} as const;

export const MEMBERSHIP_POLICY_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(MEMBERSHIP_POLICY_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.MEMBERSHIP_POLICY}::${func}`,
  ])
) as Record<keyof typeof MEMBERSHIP_POLICY_MODULE_FUNCTION_NAMES, string>;

const MEMBERSHIP_POLICY_MODULE_STRUCT_NAMES = {
  MEMBERSHIP_POLICY: "MembershipPolicy",
} as const;

export const MEMBERSHIP_POLICY_MODULE_STRUCTS = Object.fromEntries(
  Object.entries(MEMBERSHIP_POLICY_MODULE_STRUCT_NAMES).map(([key, struct]) => [
    key,
    `${ORIGIN_PACKAGE_ID}::${MODULE.MEMBERSHIP_POLICY}::${struct}`,
  ])
) as Record<keyof typeof MEMBERSHIP_POLICY_MODULE_STRUCT_NAMES, string>;
