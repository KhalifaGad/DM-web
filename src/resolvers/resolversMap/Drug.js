import getUserId from '../../utils/getUserId'

const Drug = {
    stores: {
        // this function to make sure that a store can not see other stores drugs
        fragment: 'fragment drugId on Drug { id }',
        async resolve(parent, args, {
            prisma,
            req
        }, info) {
            if(req.req.headers.authorization == "admin"){
                return parent.stores
            }
            const userId = getUserId(req)

            const isStore = await prisma.exists.Store({
                id: userId
            })
            
            if (isStore) {
                parent.stores = parent.stores.filter(obj => obj.store === userId)
            }
            return parent.stores
        }
    }
}

export {
    Drug as
    default
}