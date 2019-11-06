import getUserId from '../utils/getUserId'

const Subscription = {
    order: {
        subscribe(parent, args, { prisma, req }, info) {
		//console.log(req)
            const userId = getUserId(req, true)

            let subscribeOption = {}

            if (!args.areYouStore) {
                subscribeOption.from = {}
                subscribeOption.from.id = userId
            } else {
                subscribeOption.to = {}
                subscribeOption.to.id = userId
            }

            return prisma.subscription.order({
                where: {
                    node: {
                        ...subscribeOption
                    }
                }
            }, info)
        }
    }
}

export { Subscription as default }
