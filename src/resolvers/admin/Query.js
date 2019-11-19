import {
    getTopDrugs, getTopDrugsByValue
} from '../../utils/topDrugsSellingHelper'

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
        }, '{ drugsList{ drug { id } total } }')

        let drugsLists = []
        await orderDrugsListArrOfObj.forEach((order) => {
            drugsLists.push(order.drugsList)
        })
        
        let topDrugs = await getTopDrugsByValue(drugsLists)
        console.log(JSON.stringify(topDrugs))
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
    }, info){
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
    }
}

export { adminQueries }
