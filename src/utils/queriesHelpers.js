function queryUser(areYouStore, email, prisma) {
    if (areYouStore) {
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

function queryDrugs(prisma) {
    return prisma.query.drugs(null, '{ stores { store } }')
}

function queryVerification(prisma, code) {
    return prisma.query.verification({
        where: {
            code
        }
    }, '{ id }')
}

export {
    queryUser,
    queryDrugs,
    queryVerification
}