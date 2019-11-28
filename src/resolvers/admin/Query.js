import {
    getTopDrugs,
    getTopDrugsByValue,
    drugSellingValue
} from '../../utils/topDrugsSellingHelper'
import {
    getTopPharmacies
} from '../../utils/topPharmacies'
import {
    getOrdersHaveDrug
} from '../../utils/queriesHelpers'

const adminQueries = {
    async admin_topDrugsSelling(parent, args, {
        prisma,
        req
    }, info) {
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: new Date('2019')
            }
        }, '{ drugsList{ drug { id } quantity } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugs(drugsLists)
        return topDrugs
    },
    async admin_monthTopDrugsSelling(parent, args, {
        prisma,
        req
    }, info) {
        let requiredMonth = new Date(args.month)
        let nextMonth = new Date(args.month)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: requiredMonth
            },
            AND: {
                acceptingDate_lt: nextMonth
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
    async admin_fromToMonthTopDrugsSelling(parent, args, {
        prisma,
        req
    }, info) {
        let fromMonth = new Date(args.from)
        let toMonth = new Date(args.to)
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: fromMonth
            },
            AND: {
                acceptingDate_lte: toMonth
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
    async admin_fromMonthTopDrugsSelling(parent, args, {
        prisma,
        req
    }, info) {
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: new Date(args.month)
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
    async admin_topDrugsSellingByValue(parent, args, {
        prisma,
        req
    }, info) {
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: new Date('2019')
            }
        }, '{ drugsList{ drug { id name } quantity total } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugsByValue(drugsLists)

        return topDrugs
    },
    async admin_monthTopDrugsSellingByValue(parent, args, {
        prisma,
        req
    }, info) {
        let requiredMonth = new Date(args.month)
        let nextMonth = new Date(args.month)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: requiredMonth
            },
            AND: {
                acceptingDate_lt: nextMonth
            }
        }, '{ drugsList{ drug { id } total } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugsByValue(drugsLists)
        console.log(JSON.stringify(topDrugs))
        return topDrugs
    },
    async admin_fromToMonthTopDrugsSellingByValue(parent, args, {
        prisma,
        req
    }, info) {
        let fromMonth = new Date(args.from)
        let toMonth = new Date(args.to)
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: fromMonth
            },
            AND: {
                acceptingDate_lt: toMonth
            }
        }, '{ drugsList{ drug { id } total } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugsByValue(drugsLists)
        console.log(JSON.stringify(topDrugs))
        return topDrugs
    },
    async admin_fromMonthTopDrugsSellingByValue(parent, args, {
        prisma,
        req
    }, info) {
        let orderDrugsListArrOfObj = await prisma.query.orders({
            where: {
                acceptingDate_gte: new Date(args.month)
            }
        }, '{ drugsList{ drug { id } total } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })

        let topDrugs = await getTopDrugsByValue(drugsLists)
        console.log(JSON.stringify(topDrugs))
        return topDrugs
    },
    async admin_ordersInADay(parent, args, {
        prisma,
        req
    }, info) {
        let requiredDay = new Date(args.date)
        let nextDay = new Date(args.date)
        nextDay.setDate(requiredDay.getDate() + 1)
        return prisma.query.orders({
            where: {
                createdAt_gte: requiredDay,
                AND: {
                    createdAt_lt: nextDay
                }
            }
        }, info)
    },
    async admin_totalSales(parent, args, {
        prisma,
        req
    }, info) {
        let ordersTotal = await prisma.query.orders({
            where: {
                acceptingDate_gte: "2019"
            }
        }, '{ total walletDiscount }')
        let totalsales = 0
        for (let i = 0; i < ordersTotal.length; i++) {
            totalsales += ordersTotal[i].total -
                ordersTotal[i].total * (ordersTotal[i].walletDiscount / 100)
        }

        return totalsales
    },
    async admin_totalSalesThisMonth(parent, args, {
        prisma,
        req
    }, info) {
        let nowDate = new Date()
        let ordersTotal = await prisma.query.orders({
            where: {
                acceptingDate_gte: new Date(nowDate.getFullYear(), nowDate.getMonth())
            }
        }, '{ total walletDiscount }')
        let totalsales = 0
        for (let i = 0; i < ordersTotal.length; i++) {
            totalsales += ordersTotal[i].total -
                ordersTotal[i].total * (ordersTotal[i].walletDiscount / 100)
        }
        return totalsales
    },
    async admin_pharmaciesCount(parent, args, {
        prisma,
        req
    }, info) {
        let pharmacies = await prisma.query.pharmacies({}, '{ id }')
        let count = 0
        for (let i = 0; i < pharmacies.length; i++) {
            count++
        }
        return count
    },
    async admin_storesCount(parent, args, {
        prisma,
        req
    }, info) {
        let stores = await prisma.query.stores({}, '{ id }')
        let count = 0
        for (let i = 0; i < stores.length; i++) {
            count++
        }
        return count
    },
    async admin_ordersCount(parent, args, {
        prisma,
        req
    }, info) {
        let orders = await prisma.query.orders({}, '{ id }')
        let count = 0
        for (let i = 0; i < orders.length; i++) {
            count++
        }
        return count
    },
    async admin_pendingOrdersCount(parent, args, {
        prisma,
        req
    }, info) {

        let orders = await prisma.query.orders({
            where: {
                orderStatus_in: ['PENDING']
            }
        }, '{ id }')
        let count = 0
        for (let i = 0; i < orders.length; i++) {
            count++
        }
        return count
    },
    async admin_deliveriedOrdersCount(parent, args, {
        prisma,
        req
    }, info) {

        let orders = await prisma.query.orders({
            where: {
                orderStatus_in: ['DELIVERED']
            }
        }, '{ id }')
        let count = 0
        for (let i = 0; i < orders.length; i++) {
            count++
        }
        return count
    },
    async admin_topPharmacies(parent, args, {
        prisma,
        req
    }, info) {
        let orders = await prisma.query.orders({},
            ' { from { pharmacyName code } total } ')

        return getTopPharmacies(orders)
    },
    async admin_orders(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.orders({}, info)
    },
    admin_order(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.order({
            where: {
                code: args.code
            }
        }, info)
    },
    admin_pharmacies(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.pharmacies({}, info)
    },
    admin_stores(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.stores({}, info)
    },
    admin_pharmacy(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.pharmacy({
            where: {
                id: args.id
            }
        }, info)
    },
    admin_store(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.store({
            where: {
                id: args.id
            }
        }, info)
    },
    admin_pharmacyOrders(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.orders({
            where: {
                from: {
                    id: args.id
                }
            }
        }, info)
    },
    admin_storeOrders(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.query.orders({
            where: {
                to: {
                    id: args.id
                }
            }
        }, info)
    },
    async admin_isBlackListed(parent, args, {
        prisma,
        req
    }, info) {
        let res = await prisma.query.blackList({
            where: {
                pharmacyId: args.pharmacyId
            }
        }, '{ id }')

        return res ? true : false
    },
    async admin_getDrugsWtihSellingValue(parent, args, {
        prisma,
        req
    }, info) {
        let drugs = await prisma.query.drugs({}, '{ id name stores { store } }')
        let orders
        for (let i = 0; i < drugs.length; i++) {
            orders = await getOrdersHaveDrug(prisma, drugs[i].id)
            if (orders.length <= 0) {
                drugs[i].sellingValue = 0
            } else {
                drugs[i].sellingValue = parseInt(
                    drugSellingValue(orders, drugs[i].id)
                )
            }
            drugs[i].storesCount = drugs[i].stores.length
        }
        return drugs
    },
    admin_drug(parent, args, {
        prisma,
        req
    }, info){
        return prisma.query.drug({
            where: {
                id: args.id
            }
        }, info)
    }

}

export {
    adminQueries
}