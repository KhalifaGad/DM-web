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
            first: args.first
        }
        if(args.name) {
            opArgs.where = {
                name_contains: args.name
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
        // This function won't work until main dashboard is created
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