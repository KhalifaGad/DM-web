import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://prisma:4466',
    /* secret: '<Thi$i$######Hashed$ecret/>', */
    fragmentReplacements
})

export { prisma as default }