import getUserId from '../utils/getUserId'

const Query = {
    async orders(parent, args, {
        prisma,
        req
    }, info) {

        const userId = getUserId(req)
        const opArgs = {
            skip: args.skip,
            first: args.first
        }
        let fetchingOption = {}
        if (args.orderStatus) fetchingOption.orderStatus = args.orderStatus

        if (args.areYouStore) {
            fetchingOption.from = {}
            fetchingOption.from.id = userId
        } else {
            fetchingOption.to = {}
            fetchingOption.to.id = userId
        }
        opArgs.where = {
            ...fetchingOption
        }
        return prisma.query.orders({
            opArgs
        }, info)
    },
    async ordersByMonth(parent, args, {
        prisma,
        req
    }, info) {
        let opArgs = {}
        let userId = await getUserId(req)
        if(args.createdAt){
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                createdAt_gte: new Date(dateParts[0], dateParts[1]),
                createdAt_lt: new Date(dateParts[0], dateParts[1] + 1),
                to: {
                    id: userId
                }
            }
        } else if (args.acceptingDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                acceptingDate_gte: new Date(dateParts[0], dateParts[1]),
                acceptingDate_lt: new Date(dateParts[0], dateParts[1] + 1),
                to: {
                    id: userId
                }
            }
        } else if (args.refusingingDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                refusingingDate_gte: new Date(dateParts[0], dateParts[1]),
                refusingingDate_lt: new Date(dateParts[0], dateParts[1] + 1),
                to: {
                    id: userId
                }
            } 
        } else if (args.deliveringDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                deliveringDate_gte: new Date(dateParts[0], dateParts[1]),
                deliveringDate_lt: new Date(dateParts[0], dateParts[1] + 1),
                to: {
                    id: userId
                }
            }
        }
        return prisma.query.orders({
            opArgs
        }, info)
    }
    ,
    order: (parent, args, {
        prisma,
        req
    }, info) => {
        getUserId(req)
        return prisma.query.order({
            where: {
                ...args
            }
        }, info)
    },
    drugs: (parent, args, {
        prisma
    }, info) => {
        const opArgs = {
            skip: args.skip,
            first: args.first,
            where: {
                stores_every: {
                    onlyCash: args.onlyCash
                }
            }
        }
        if (args.name) {
            opArgs.where = {
                name_contains: args.name,
                stores_every: {
                    onlyCash: args.onlyCash
                }
            }
        }
        if(args.storeId){
            opArgs.where = {
                stores_every: {
                    store: args.storeId
                }
            }
        }
        return prisma.query.drugs(opArgs, info)
    },
    drugsHaveStores: (parent, args, {
        prisma
    }, info) => {
        const opArgs = {
            skip: args.skip,
            first: args.first
        }

        opArgs.where = {
            stores_some: {
                price_gte: 0
            }
        }
        
        return prisma.query.drugs(opArgs, info)
    },
    drug: (parent, args, {
            prisma
        }, info) =>
        prisma.query.drug({
            where: {
                ...args.drugQueryInput
            }
        }, info),
    stores(parent, args, {
        prisma
    }, info) {
        return prisma.query.stores({
            where: {
                ...args
            }
        }, info)
    },
    store: (parent, args, {
        prisma,
        req
    }, info) => {
        getUserId(req)
        return prisma.query.store({
            where: {
                ...args
            }
        }, info)
    }
}

export {
    Query as
    default
}