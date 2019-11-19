function getTopPharmacies(orders) {
    let pharmaciesSet = new Map()
    let total = 0
    for (let i = 0; i < orders.length; i++) {
        if (pharmaciesSet.has(orders[i].from.code)) {
            total = pharmaciesSet.get(orders[i].from.code).total
            total += orders[i].total
            pharmaciesSet.set(orders[i].from.code, total)
        } else {
            pharmaciesSet.set(orders[i].from.code, {
                total: orders[i].total,
                pharmacyName: orders[i].from.pharmacyName
            })
        }
    }
    return Array.from(new Map([...pharmaciesSet.entries()].sort((a, b) => b[1].total - a[1].total)))
}

export {
    getTopPharmacies
}