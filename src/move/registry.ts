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
  // Entry
  create_collection: "create_collection",
  create_market: "create_market",
  // Mint
  mint_character: "mint_character",
  mint_item: "mint_item",
  mint_ticket: "mint_ticket",
  // New
  new: "new",
  new_market: "new_market",
  new_character: "new_character",
  new_item: "new_item",
  new_attribute_scroll: "new_attribute_scroll",
  new_ticket: "new_ticket",
  // Register Type
  register_layer_type: "register_layer_type",
  register_item_type: "register_item_type",
  register_attribute_type: "register_attribute_type",
  register_ticket_type: "register_ticket_type",
  register_config_to_type: "register_config_to_type",
  // Update Type
  update_layer_order: "update_layer_order",
  update_config_to_type: "update_config_to_type",
  // Market
  register_listing_to_market: "register_listing_to_market",
  register_purchase_condition_to_listing:
    "register_purchase_condition_to_listing",
  stock_product_to_listing: "stock_product_to_listing",
  // Item
  equip_item_to_character: "equip_item_to_character",
  store_item_to_item_bag: "store_item_to_item_bag",
  retrieve_item_from_item_bag: "retrieve_item_from_item_bag",
  attach_attribute_to_item: "attach_attribute_to_item",
  // Ticket
  store_ticket_to_ticket_bag: "store_ticket_to_ticket_bag",
  retrieve_ticket_from_ticket_bag: "retrieve_ticket_from_ticket_bag",
  // Purchase
  new_purchase_request: "new_purchase_request",
  consume_ticket: "consume_ticket",
  add_balance_to_market: "add_balance_to_market",
  confirm_purchase_request: "confirm_purchase_request",
} as const;

export const COLLECTION_MODULE_FUNCTIONS = Object.fromEntries(
  Object.entries(COLLECTION_MODULE_FUNCTION_NAMES).map(([key, func]) => [
    key,
    `${UPGRADED_PACKAGE_ID}::${MODULE.COLLECTION}::${func}`,
  ])
) as Record<keyof typeof COLLECTION_MODULE_FUNCTION_NAMES, string>;

const COLLECTION_MODULE_STRUCT_NAMES = {
  // Collection
  Collection: "Collection",
  CollectionCap: "CollectionCap",
  // Market
  Market: "Market",
  MarketCap: "MarketCap",
  Listing: "Listing",
  PurchaseCondition: "PurchaseCondition",
  PurchaseRequest: "PurchaseRequest",
  // Type
  CharacterType: "CharacterType",
  LayerType: "LayerType",
  ItemType: "ItemType",
  AttributeType: "AttributeType",
  TicketType: "TicketType",
  TypeConfig: "TypeConfig",
  // Objects
  Membership: "Membership",
  ItemSocket: "ItemSocket",
  Item: "Item",
  AttributeScroll: "AttributeScroll",
  Attribute: "Attribute",
  Ticket: "Ticket",
  // Keys
  TypeKey: "TypeKey",
  ItemBagKey: "ItemBagKey",
  TicketBagKey: "TicketBagKey",
  ProductKey: "ProductKey",
  TypeConfigKey: "TypeConfigKey",
  // Event
  CollectionCreated: "CollectionCreated",
  MarketCreated: "MarketCreated",
  MembershipCreated: "MembershipCreated",
  ItemCreated: "ItemCreated",
  TicketCreated: "TicketCreated",
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
