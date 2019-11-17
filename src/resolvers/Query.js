import { clientsQueries } from './clients/Query'
import { adminQueries } from './admin/Query'

const Query = {
    ...clientsQueries,
    ...adminQueries
}

export {
    Query as
    default
}
