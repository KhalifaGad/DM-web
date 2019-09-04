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
