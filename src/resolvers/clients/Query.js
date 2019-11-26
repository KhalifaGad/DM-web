import getUserId from '../../utils/getUserId'
import {
    getTopDrugs
} from '../../utils/topDrugsSellingHelper'

const clientsQueries = {
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
        if (args.orderStatus !== '') fetchingOption.orderStatus = args.orderStatus

        if (args.areYouStore) {
            fetchingOption.to = {}
            fetchingOption.to.id = userId
        } else {
            fetchingOption.from = {}
            fetchingOption.from.id = userId
        }
        opArgs.where = {
            ...fetchingOption
        }
        console.log(JSON.stringify(opArgs))
        return prisma.query.orders(
            opArgs, info)
    },
    async ordersByMonth(parent, args, {
        prisma,
        req
    }, info) {
        let opArgs = {}
        let userId = await getUserId(req)
        if (args.createdAt) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                createdAt_gte: new Date(dateParts[0], parseInt(dateParts[1], 10) - 1),
                createdAt_lt: new Date(dateParts[0], parseInt(dateParts[1], 10)),
                to: {
                    id: userId
                }
            }
        } else if (args.acceptingDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                acceptingDate_gte: new Date(dateParts[0], parseInt(dateParts[1], 10) - 1),
                acceptingDate_lt: new Date(dateParts[0], dateParts[1]),
                to: {
                    id: userId
                }
            }
        } else if (args.refusingingDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                refusingingDate_gte: new Date(dateParts[0], parseInt(dateParts[1], 10) - 1),
                refusingingDate_lt: new Date(dateParts[0], dateParts[1]),
                to: {
                    id: userId
                }
            }
        } else if (args.deliveringDate) {
            let dateParts = args.createdAt.split('-')
            opArgs.where = {
                deliveringDate_gte: new Date(dateParts[0], parseInt(dateParts[1], 10) - 1),
                deliveringDate_lt: new Date(dateParts[0], dateParts[1]),
                to: {
                    id: userId
                }
            }
        }
        return prisma.query.orders(opArgs, info)
    },
    async ordersOfStore(parent, args, {
        prisma,
        req
    }, info) {
        let userId = await getUserId(req)
        return prisma.query.orders({
            where: {
                to: {
                    id: userId
                }
            }
        }, info)
    },
    async ordersOfPharmacy(parent, args, {
        prisma,
        req
    }, info) {
        let userId = await getUserId(req)
        return prisma.query.orders({
            where: {
                from: {
                    id: userId
                }
            }
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
        if (args.name) {
            opArgs.where = {
                name_contains: args.name
            }
        }
        if (args.storeId) {
            opArgs.where = {
                stores_some: {
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
        prisma.query.drugs({
            where: {
                ...args.drugQueryInput,
                stores_some: {
                    onlyCash: args.onlyCash
                }
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
    store: async (parent, args, {
        prisma,
        req
    }, info) => {
        await getUserId(req)
        return prisma.query.store({
            where: {
                ...args
            }
        }, info)
    },
    pharmacy: async (parent, args, {
        prisma,
        req
    }, info) => {
        let pharmacyId = await getUserId(req)
        return prisma.query.pharmacy({
            where: {
                id: pharmacyId
            }
        }, info)
    },
    async topDrugsSelling(parent, args, {
        prisma,
        req
    }, info) {
        let storeId = await getUserId(req)
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                to: {
                    id: storeId
                }
            },
            AND: {
                acceptingDate_gte: new Date('2019')
            }
        }, '{ drugsList{ drug { id } quantity } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugs(drugsLists)
        console.log(JSON.stringify(topDrugs))
        return topDrugs
    },
    async drugsWithoutStores(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.drugs({}, '{id name}')
    },
    async pharmacyFromCode(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.pharmacy({
            where: {
                code: args.code
            }
        }, info)
    },
    async checkPharmacyEmail(parent, args, {
        prisma,
        req
    }, info) {

        let pharmacy = await prisma.query.pharmacy({
            where: {
                email: args.email
            }
        }, '{ id }')
        if (pharmacy) {
            return true
        } else {
            return false
        }
    },
    async isBlackListed(parent, args, {
        prisma,
        req
    }, info){
        let pharmacyId = getUserId(req)
        let res = await prisma.query.blackList({
            where: {
                pharmacyId: pharmacyId
            }
        }, '{ id }')

        return res? true : false
    }
}

export {
    clientsQueries
}