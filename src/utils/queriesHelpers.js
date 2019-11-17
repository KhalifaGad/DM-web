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

function checkPharmacyCode(prisma, code) {
    return prisma.query.pharmacy({
        where: {
            code: code
        }
    }, '{ id wallet }')
}

function queryPharmacyWallet(prisma, id) {
    return prisma.query.pharmacy({
        where: {
            id: id
        }
    }, '{ wallet }')
}

function qureyPhramaciesByArea(prisma, area){
    return prisma.query.pharmacies({
        where: {
            area
        }
    }, '{ id wallet }')
}

function getRegisTokensByArea(prisma, area){
    return prisma.query.pharmacies({
        where: {
            area
        }
    }, '{ registerationToken }')
}

export {
    queryUser,
    queryDrugById,
    queryDrugByName,
    queryVerification,
    checkPharmacyCode,
    queryPharmacyWallet,
    qureyPhramaciesByArea,
    getRegisTokensByArea
}
