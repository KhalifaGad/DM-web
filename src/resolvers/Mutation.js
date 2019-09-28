import shortid from 'shortid'
import bcrypt from 'bcrypt'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils//hashPassword'
import mailer from '../utils/sendVerification'
import {
    queryUser,
    queryDrugById,
    queryDrugByName,
    queryVerification,
    checkPharmacyCode,
    queryPharmacyWallet
} from '../utils/helperQueries'
import { updatePharmacyWallet } from '../utils/helperMutations'

const Mutations = {
    async addStore(parent, args, {
        prisma
    }, info) {

        const password = await hashPassword(args.password)

        const store = await prisma.mutation.createStore({
            data: {
                ...args,
                password
            }
        })
        const code = await shortid.generate()
        mailer(store.firstName, code, store.email, true)
        await prisma.mutation.createVerification({
            data: {
                id: store.id,
                code
            }
        })
        return store
    },
    async updateStore(parent, args, { //********************************************************** */
        prisma,
        req
    }, info){
        let storeId = await getUserId(req)
        if (args.password) {
            args.password = await hashPassword(args.password)
        }
        return prisma.mutation.updateStore({
            where: {
                id: storeId
            },
            data: {
                ...args
            }
        }, info)
    },
    async updatePharmacy(parent, args, {
        prisma,
        req
    }, info){
        let pharmacyId = await getUserId(req)
        if (args.password) {
            args.password = await hashPassword(args.password)
        }
        return prisma.mutation.updatePharmacy({
            where: {
                id: pharmacyId
            },
            data: {
                ...args
            }
        }, info)
    },
    async addStoreLogoURL(parent, args, {
        prisma
    }, info){
        return prisma.mutation.updateStore({
            data: {
                logoURL: args.url
            },
            where: {
                id: args.storeId
            }
        }, info)
    },
    async login(parent, args, {
        prisma
    }, info) {
        let user = await queryUser(args.areYouStore, args.email, prisma)

        if (!user) {
            throw new Error('Unable to login!')
        }

        if (!user.confirmed) {
            throw new Error('Please verify your account!.')
        }

        const isMatch = await bcrypt.compare(args.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login!')
        }
        let pharmacy = null, store = null
        if(args.areYouStore){
            store = user
        } else {
            pharmacy = user
        }
        return {
            store,
            pharmacy,
            token: await generateToken(user.id)
        }
    },
    async addPharmacy(parent, args, {
        prisma
    }, info) {

        const password = await hashPassword(args.password)
        const code = await shortid.generate()

        const pharmacy = await prisma.mutation.createPharmacy({
            data: {
                ...args,
                password,
                code
            }
        }, info)
        const verificationCode = await shortid.generate()
        mailer(pharmacy.firstName, verificationCode, pharmacy.email, false)
        await prisma.mutation.createVerification({
            data: {
                id: pharmacy.id,
                code: verificationCode
            }
        })
        return pharmacy
    },
    async addDrug(parent, args, {
        prisma,
        req
    }, info) {

        //getUserId(req) *******************************************************************
        const drugName = args.name.toLowerCase()
        const checkExistance = await queryDrugByName(prisma, drugName)
        if(checkExistance !== null && checkExistance.id){
            return Error('drug already exist!.')
        }

        const creatDrugRes = await prisma.mutation.createDrug({
            data: {
                name: drugName
            }
        }, '{ id }')
        
        if (args.newDrugStoreInfo) {

            let {
                storeId,
                price,
                discount,
                deferredDiscount,
                onlyCash
            } = args.newDrugStoreInfo

            const updateDrugRes = await prisma.mutation.updateDrug({
                data: {
                    stores: {
                        create: {
                            store: storeId,
                            price,
                            discount,
                            deferredDiscount,
                            onlyCash
                        }
                    }
                },
                where: {
                    id: creatDrugRes.id
                }
            })
            console.log(JSON.stringify(updateDrugRes))
            return creatDrugRes.id 
        }        
        return creatDrugRes.id
    },
    async addDrugtoStore(parent, args, {
        prisma,
        req
    }, info) {
        const storeId = args.storeId

        const storesObj = await queryDrugById(prisma, args.drugId)
        const storesHaveDrugList = storesObj['stores']
        const isExist = storesHaveDrugList.find(obj => obj.store === storeId)

        if (isExist) {
            throw new Error('Store already have the drug, Try to update it!.')
        }
        return prisma.mutation.updateDrug({
            data: {
                stores: {
                    create: {
                        store: storeId,
                        price: args.price,
                        discount: args.discount,
                        deferredDiscount: args.deferredDiscount,
                        onlyCash: args.onlyCash
                    }
                }
            },
            where: {
                id: args.drugId
            }
        }, info)
    },
    async orderAction(parent, args, {
        prisma,
        req
    }, info) {
        getUserId(req)

        return prisma.mutation.updateOrder({
            data: {
                ...args.orderActionInput
            },
            where: {
                id: args.orderId
            }
        })
    },
    async makeOrder(parent, args, {
        prisma,
        req
    }, info) {

        const userId = getUserId(req)

        return prisma.mutation.createOder({
            data: {
                orderStatus: 'PENDING',
                total: args.total,
                from: {
                    connect: {
                        id: userId
                    }
                },
                to: {
                    connect: {
                        id: args.to
                    }
                },
                drugList: {
                    create: args.drugList
                }
            }
        }, info)
    },
    async storeVerification(parent, {
        code
    }, {
        prisma
    }, info) {

        const res = await queryVerification(prisma, code)
        const storeId = res.id

        if (!storeId) {
            throw new Error('Bad cardinatlites!')
        }

        prisma.mutation.deleteVerification({
            where: {
                id: storeId
            }
        })

        await prisma.mutation.updateStore({
            where: {
                id: storeId
            },
            data: {
                confirmed: true
            }
        })
        return true
    },
    async pharmacyVerification(parent, {
        code
    }, {
        prisma
    }, info) {
        const pharmacy = await queryVerification(prisma, code)

        if (!pharmacy.id) {
            throw new Error('Bad cardinatlites!')
        }

        prisma.mutation.deleteVerification({
            where: {
                id: pharmacy.id
            }
        })

        await prisma.mutation.updatePharmacy({
            where: {
                id: pharmacy.id
            },
            data: {
                confirmed: true
            }
        })
        return true
    },
    async addPharmacyPromo(parent, args, {
        prisma,
        req
    }, info){
        let newPharmacyId = args.id

        let data = await checkPharmacyCode(prisma, args.oldPharmacyCode)
        
        if(data.pharmacy.id){
            await updatePharmacyWallet(data.pharmacy.id, data.pharmacy.wallet, prisma)
            await updatePharmacyWallet(newPharmacyId, 0, prisma)
            return true
        } else {
            return false
        }
    },
    async decreasePharmacyWallet(parent, args, {
        prisma,
        req
    }, info){
        const userId = getUserId(req)

        let data = await queryPharmacyWallet(userId)
        if(data.pharmacy.wallet === 0){
            return false
        } else {
            await prisma.mutation.updatePharmacy({
                where: {
                    id: userId
                },
                data: {
                    wallet: data.pharmacy.wallet - 1
                }
            })
            return true
        }
    }
}

export {
    Mutations as
    default
}