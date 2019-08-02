import { gql } from 'apollo-server'

const typeDefs = gql `

#<------------------------- Mutation, Query & Subscription ------------------------->
type Query {
  orders(areYouStore: Boolean!, orderStatus: OrderStatus): [Order]!
  order(id: ID!): Order
  drugs: [Drug]!
  drug(drugQueryInput: DrugQueryInput!): Drug
  stores: [Store]!
  store(id: ID, storeName: String): Store
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
    birthdate: Date, 
    phone: String!): Store!

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
    phone: String!): Pharmacy!

  addDrug(name: String!): Drug!

  addDrugtoStore(drugId: ID!,
    price: Float!, 
    discount: Float!, 
    cash: Boolean!): Drug

  makeOrder( total: Float!,
    to: ID!,
    drugList: [ID!]!
    ): Order!

  orderAction(orderId: ID!, 
    orderActionInput: OrderActionInput!): Order!

}

type Subscription {
  order: OrderSubsciptionPayload!
}

#<--------------------- End of Mutation, Query & Subscription ---------------------->
#<---------------------------- Non-types declaration ------------------------------->

scalar Date

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
}

type StoreHaveDrug {
  store: ID!
  price: Float!
  discount: Float
  cash: Boolean!
}

type Pharmacy {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  code: String!
  lat: Float!
  long: Float!
  phone: String!
}

type Order {
  id: ID!
  from: Pharmacy!
  to: Store!
  drugsList: [OrderDrugsList]!
  orderStatus: OrderStatus!
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

type AuthPayload {
  sotre: Store
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