const { ApolloServer } = require('apollo-server');
import prisma from './prisma'
import typeDefs from './schema'
import {resolvers, fragmentReplacements } from './resolvers/index'


const server = new ApolloServer({ 
    typeDefs,
    resolvers, 
    context(req) { 
        return {
            prisma,
            req
        }
    },
    fragmentReplacements
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log('hello')
  console.log(`🚀  Server ready at ${url}`);
});

/*
#ping localhost && prisma deploy && yarn run get-schema 
http://localhost:4466/
web:
    build: .
    ports:
    - "80:4000"
    networks: 
      dm-net:
    command: 
    web:
    build: .
    ports:
    - "80:4000"
    command: wait-for-it/wait-for-it.sh http://localhost:4466 -s -t 1000 -- echo "prisma is up" && prisma deploy && yarn run get-shcema && yarn run sart
  

*/