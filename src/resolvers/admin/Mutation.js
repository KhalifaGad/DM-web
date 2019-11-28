import {
    qureyPhramaciesByArea,
    queryPharmacyWallet,
    getRegisTokensByArea,
    getRegisTokensById
} from "../../utils/queriesHelpers"
import {
    addDiscount2Pharmacies
} from "../../utils/helperMutations"
import {
    notificationOperations
} from "../../utils/cloudMessaging"

const adminMutations = {
    async admin_addDiscountByArea(parent, args, {
        prisma,
        req
    }, info) {
        let pharmacies = await qureyPhramaciesByArea(prisma, args.area)
        addDiscount2Pharmacies(prisma, pharmacies, args.ratio)
        return true
    },
    async admin_addDiscount2Pharmacy(parent, args, {
        prisma,
        req
    }, info) {
        let pharmacy = await queryPharmacyWallet(prisma, args.id)

        if (pharmacy == null) return false

        await prisma.mutation.updatePharmacy({
            where: {
                id: args.id
            },
            data: {
                wallet: pharmacy.wallet + args.ratio
            }
        }, '{ id wallet }')
        return true
    },
    async admin_sendNotificationByArea(parent, args, {
        prisma,
        req
    }, info) {
        let pharmacies = await getRegisTokensByArea(prisma, args.area)
        notificationOperations(pharmacies, args.title, args.body)
        return true
    },
    admin_orderAction(parent, args, {
        prisma,
        req
    }, info) {
        return prisma.mutation.updateOrder({
            where: {
                code: args.code
            },
            data: {
                orderStatus: args.status
            }
        }, info)
    },
    async admin_sendNtfc2Pharmacy(parent, args, {
        prisma,
        req
    }, info) {
        //getRegisTokensById
        let pharmacies = await getRegisTokensById(prisma, args.id)
        notificationOperations(pharmacies, args.title, args.body)
        return true
    },
    async admin_add2BlackList(parent, args, {
        prisma,
        req
    }, info) {
        let res = await prisma.mutation.createBlackList({
            data: {
                pharmacyId: args.pharmacyId
            }
        }, '{ id }')
        return res ? true : false
    },
    async admin_removeFromBlackList(parent, args, {
        prisma,
        req
    }, info) {
        let res = await prisma.mutation.deleteBlackList({
            where: {
                pharmacyId: args.pharmacyId
            }
        }, '{ id }')

        return res ? true : false
    },
    async admin_updateDrugName(parent, args, {
        prisma,
        req
    }, info){
        let res = await prisma.mutation.updateDrug({
            where: {
                name: args.oldName
            },
            data: {
                name: args.newName
            }
        }, '{ name }')

        return res? true : false
    }
}


export {
    adminMutations
}