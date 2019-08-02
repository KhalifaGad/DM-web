import shortid from 'shortid'
import bcrypt from 'bcrypt'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils//hashPassword'
import mailer from '../utils/sendVerification'

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
    async login(parent, args, {
        prisma
    }, info) {
        let user = await queryUser(args.areYouStore, args.email, prisma)

        if (!user) {
            throw new Error('Unable to login!')
        }

        if(!user.confirmed){
            throw new Error('Please verify your account!.')
        }

        const isMatch = await bcrypt.compare(args.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login!')
        }

        return {
            user,
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

        getUserId(req)

        return prisma.mutation.createDrug({
            data: {
                name: args.name
            }
        }, info)
    },
    async addDrugtoStore(parent, args, {
        prisma,
        req
    }, info) {
        const storeId = getUserId(req)

        const storesObj = await prisma.query.drugs(null, '{ stores { store } }')

        const storesHaveDrugList = storesObj[0]['stores']
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
                        cash: args.cash
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
                    connect: args.drugList
                }
            }
        }, info)
    },
    async storeVerification(parent, { code }, {
        prisma
    }, info){
        console.log('hitted')
        const res = await prisma.query.verification({
            where: {
                code
            }
        }, '{ id }')
        const storeId = res.id
        console.log(storeId)
        console.log(code)
        
        if(!storeId){
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
    async pharmacyVerification(parent, { code }, {
        prisma
    }, info){
        const pharmacy = await prisma.query.verification({
            where: {
                code
            }
        }, '{ id }')

        if(!pharmacy.id){
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
    }
}
function queryUser(areYouStore, email, prisma){
    if(areYouStore) {
        return prisma.query.store({
            where: {
                email: email
            }
        })
    } else {
        return prisma.query.pharmacy({
            where: {
                email: email
            }
        })
    }
}
export {
    Mutations as
    default
}