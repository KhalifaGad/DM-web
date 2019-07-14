import { GraphQLScalarType, Kind } from 'graphql';
import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query'
import Mutation from './Mutation'
import Subscription from './Subscription'
//import Store from './resolversMap/Store'
import Pharmacy from './resolversMap/Pharmacy'
import Order from './resolversMap/Order'
import Drug from './resolversMap/Drug'


const resolvers = {
    Query,
    Mutation,
    Subscription,
    Drug,
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'A Date object',
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseValue(value) {
            return new Date(value); // value from the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        }
    })
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }