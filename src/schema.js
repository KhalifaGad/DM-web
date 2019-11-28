import { gql } from 'apollo-server'

const typeDefs = gql `

#<------------------------- Mutation, Query & Subscription ------------------------->
type Query {
  orders(areYouStore: Boolean!, orderStatus: OrderStatus,
  skip: Int, first: Int): [Order]!
  ordersByMonth(createdAt: String, acceptingDate: String, refusingingDate: String,
  deliveringDate: String): [Order]!
  ordersOfStore:[Order]!
  ordersOfPharmacy:[Order]!
  order(id: ID!): Order
  drugs(skip: Int, first: Int, name: String, onlyCash: Boolean!,storeId: ID): [Drug]!
  drugsHaveStores(skip: Int, first: Int): [Drug]!
  drug(drugQueryInput: DrugQueryInput!, onlyCash: Boolean!): [Drug]!
  stores(city: String, area: String, storeName_contains: String): [Store]!
  store(id: ID, storeName: String): Store
  pharmacy: Pharmacy!
  topDrugsSelling: JSON!
  drugsWithoutStores: [Drug]!
  pharmacyFromCode(code: String!): Pharmacy
  checkPharmacyEmail(email: String!): Boolean!
  isBlackListed: Boolean!
  admin_ordersInADay(date: String!): [Order]!
  admin_topDrugsSelling: JSON!
  admin_monthTopDrugsSelling(month: String!): JSON!
  admin_fromMonthTopDrugsSelling(month: String!): JSON!
  admin_fromToMonthTopDrugsSelling(from: String!, to: String!): JSON!
  admin_topDrugsSellingByValue: JSON!
  admin_monthTopDrugsSellingByValue(month: String!): JSON!
  admin_fromToMonthTopDrugsSellingByValue(from: String!, to: String!): JSON!
  admin_fromMonthTopDrugsSellingByValue(month: String!): JSON!
  admin_totalSales: Float!
  admin_totalSalesThisMonth: Float!
  admin_pharmaciesCount: Int!
  admin_storesCount: Int!
  admin_ordersCount: Int!
  admin_pendingOrdersCount: Int!
  admin_deliveriedOrdersCount: Int!
  admin_topPharmacies: JSON!
  admin_orders: [Order]!
  admin_order(code: String!): Order!
  admin_pharmacies: [Pharmacy]!
  admin_pharmacy(id: ID!): Pharmacy!
  admin_store(id: ID!): Store!
  admin_stores: [Store]!
  admin_pharmacyOrders(id: ID!): [Order]!
  admin_storeOrders(id: ID!): [Order]!
  admin_isBlackListed(pharmacyId: ID!): Boolean!
  admin_getDrugsWtihSellingValue: JSON!
  admin_drug(id: ID!): Drug!
}

type Mutation {
  addStore(firstName: String!,
    lastName: String!,
    email: String!,
    password: String!,
    storeName: String!,
    city: String!, 
    area: String!, 
    street: String!, 
    birthday: Date, 
    phone: String!): Store!

  updateStore(firstName: String,
    lastName: String,
    email: String,
    password: String,
    storeName: String,
    city: String, 
    area: String, 
    street: String, 
    birthday: Date, 
    phone: String): Store!  

  addStoreLogoURL(storeId: ID!, url: String!): Store

  login(email: String!, password: String!, areYouStore: Boolean!): AuthPayload!
  
  storeVerification(code: String!): Boolean
  
  pharmacyVerification(code: String!): Boolean
  
  addPharmacy(firstName: String!,
    lastName: String!,
    pharmacyName: String!,
    email: String!,
    password: String!,
    lat: Float!,
    long: Float!,
    city: String!,
    area: String!,
    street: String!,
    wallet: Float!,
    phone: String!): Pharmacy!

  updatePharmacy(firstName: String,
    lastName: String,
    pharmacyName: String,
    email: String,
    password: String,
    lat: Float,
    long: Float,
    city: String,
    area: String,
    street: String,
    wallet: Float,
    phone: String): Pharmacy!

  addDrug(name: String!,
    newDrugStoreInfo: newDrugStoreInfoInput): ID!

  addDrugtoStore(
    storeId: ID!,
    drugId: ID!,
    price: Float!,
    discount: Float,
    deferredDiscount: Float,
    onlyCash: Boolean!): Drug

  makeOrder( total: Float!,
    to: ID!,
    drugList: [OrderDrugsListInput!]!,
    walletDiscount: Float!,
    payment: PaymentMethod!
    ): Order!

  orderAction(orderId: ID!, 
    orderActionInput: OrderActionInput!): Order!

  addPharmacyPromo(oldPharmacyCode: String!): Boolean!
  decreasePharmacyWallet(val: Float!): Boolean! 

  resetPassword(email: String!): Boolean!

  addRegisToken(regisToken: String!): Pharmacy

  admin_addDiscountByArea(area: String!, ratio: Float!): Boolean!
  admin_addDiscount2Pharmacy(id: ID!, ratio: Float!): Boolean!

  admin_sendNotificationByArea(area: String!, title: String!, body: String!): Boolean!
  admin_sendNtfc2Pharmacy(id: ID!, title: String!, body: String!): Boolean!

  admin_orderAction(code: String!, status: OrderStatus!): Order
  admin_add2BlackList(pharmacyId: ID!): Boolean
  admin_removeFromBlackList(pharmacyId: ID!): Boolean
  admin_updateDrugName(oldName: String!, newName: String!): Boolean

}

input orderConnectDrugId {
  id: ID!
}

input orderConnectDrug {
  connect: orderConnectDrugId!
}

input OrderDrugsListInput {
  drug: orderConnectDrug!
  quantity: Int!
  unitPrice: Float!
  discount: Float!
  total: Float!
}

type Subscription {
  order(areYouStore: Boolean!): OrderSubsciptionPayload!
}

#<--------------------- End of Mutation, Query & Subscription ---------------------->
#<---------------------------- Non-types declaration ------------------------------->

scalar Date
scalar JSON

enum OrderStatus {
  ACCEPTED
  REFUSED
  ACTIVE
  DELIVERED
  PENDING
}

enum PaymentMethod {
  CASH
  DEFERRED
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

input OrderActionInput {
  orderStatus: OrderStatus 
  refusingNote: String
}

input DrugQueryInput {
  id: ID
  name: String
}

input newDrugStoreInfoInput{
    storeId: ID!
    price: Float!
    discount: Float!
    deferredDiscount: Float
    onlyCash: Boolean!
}

# <---------------------- End 0f Non-types declaration ------------------------->
# <--------------------------- Types declaration ------------------------------->

type Drug {
  id: ID!
  name: String!
  stores: [StoreHaveDrug]!
}

type Store {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  storeName: String!
  city: String!
  area: String!
  street: String!
  phone: String!
  birthday: Date
  logoURL: String
}

type StoreHaveDrug {
  store: ID!
  price: Float!
  discount: Float
  deferredDiscount: Float
  onlyCash: Boolean!
}

type Pharmacy {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  pharmacyName: String!
  code: String!
  lat: Float!
  long: Float!
  city: String
  area: String
  street: String
  wallet: Float!
  phone: String!
  registerationToken: String
}

type BlackList {
  id: ID!
  pharmacyId: ID!
}

type Order {
  id: ID!
  from: Pharmacy!
  to: Store!
  drugsList: [OrderDrugsList]!
  orderStatus: OrderStatus!
  code: String!
  DMFees: Float!
  walletDiscount: Float
  total: Float!
  createdAt: Date!
  acceptingDate: Date
  refusingingDate: Date
  deliveringDate: Date
  refusingNote: String
  payment: PaymentMethod
}

type OrderDrugsList {
  drug: Drug!
  quantity: Int!
  unitPrice: Float!
  discount: Float!
  total: Float!
}

type addDrugPayload{
  id: ID,
  drug: Drug
}

type AuthPayload {
  store: Store
  pharmacy: Pharmacy
  token: String!
}

type OrderSubsciptionPayload {
  mutation: MutationType!
  node: Order
}

type topDrugsSellingPayload{
  id: ID
  quantity: Int
}

# <--------------------------- End of types ------------------------------->
`;

export {
  typeDefs as
  default
}
