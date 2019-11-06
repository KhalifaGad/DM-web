function updatePharmacyWallet(id, wallet, prisma) {
    return prisma.mutation.updatePharmacy({
        where: {
            id: id
        },
        data: {
            wallet: wallet + 1
        }
    }, '{ id }')
}

export {
    updatePharmacyWallet
}
