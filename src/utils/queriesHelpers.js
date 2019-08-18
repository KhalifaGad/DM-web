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

function queryDrugById(prisma, drugId) {
    return prisma.query.drug({
        where: {
            id: drugId
        }
    }, '{ stores { store } }')
}

function queryDrugByName(prisma, drugName) {
    return prisma.query.drug({
        where: {
            name: drugName
        }
    }, '{ id }')
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
    queryDrugById,
    queryDrugByName,
    queryVerification
}