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

function addDiscount2Pharmacies(prisma, phramacies, discount){
    for(let i = 0; i < phramacies.length; i++){
        prisma.mutation.updatePharmacy({
            where: {
                id: phramacies[i].id
            },
            data: {
                wallet: phramacies[i].wallet + discount 
            }
        })
    }
}

export {
    updatePharmacyWallet,
    addDiscount2Pharmacies
}
