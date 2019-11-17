import { clientsMutatins } from './clients/Mutation'
import { adminMutations } from './admin/Mutation'

const Mutations = {
    ...clientsMutatins,
    ...adminMutations
}

export {
    Mutations as
    default
}