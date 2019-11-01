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
  drugs(skip: Int, first: Int, name: String, onlyCash: Boolean,storeId: ID): [Drug]!
  drugsHaveStores(skip: Int, first: Int): [Drug]!
  drug(drugQueryInput: DrugQueryInput!, onlyCash: Boolean!): [Drug]!
  stores(city: String, area: String): [Store]!
  store(id: ID, storeName: String): Store
  pharmacy: Pharmacy!
  topDrugsSelling: JSON!
  drugsWithoutStores: [Drug]!
  pharmacyFromCode(code: String!): Pharmacy
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
    birthdate: Date,
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
    birthdate: Date,
    password: String,
    lat: Float,
    long: Float,
    city: String!,
    area: String!,
    street: String!,
    wallet: Float!, 
    phone: String): Pharmacy!

  addDrug(name: String!,
    newDrugStoreInfo: newDrugStoreInfoInput): ID!

  addDrugtoStore(
    storeId: ID!,
    drugId: ID!,
    price: Float!, 
    discount: Float!, 
    deferredDiscount: Float, 
    onlyCash: Boolean!): Drug

  makeOrder( total: Float!,
    to: ID!,
    drugList: [OrderDrugsListInput!]!,
    walletDiscount: Float!
    ): Order!

  orderAction(orderId: ID!, 
    orderActionInput: OrderActionInput!): Order!

  addPharmacyPromo(oldPharmacyCode: String!): Boolean!

  decreasePharmacyWallet(val: Int): Boolean!  

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
    discount: Float
    deferredDiscount: Float
    onlyCash: Boolean!
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
  pharmacyName: String!
  password: String!
  code: String!
  lat: Float!
  long: Float!
  city: String!
  area: String!
  street: String!
  wallet: Float!
  phone: String!
}

type Order {
  id: ID!
  from: Pharmacy!
  to: Store!
  drugsList: [OrderDrugsList]!
  orderStatus: OrderStatus!
  code: String!
  DMFees: Float!
  WalletDiscount: Float
  total: Float!
  createdAt: Date!
  acceptingDate: Date
  refusingingDate: Date
  deliveringDate: Date
  refusingNote: String
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

# <--------------------------- End of types ------------------------------->
`;

export {
  typeDefs as
  default
}