function getTopDrugs(drugsLists) {
    let drugsMap = new Map();
    let oldQuantity = 0,
        newQuantity = 0;
    drugsLists.forEach((drugList) => {
        for (let i = 0; i < drugList.length; i++) {
            if (drugsMap.has(drugList[i].drug.id)) {
                oldQuantity = drugsMap.get(drugList[i].drug.id)
                newQuantity = oldQuantity + drugList[i].quantity
                drugsMap.set(drugList[i].drug.id, newQuantity)
            } else {
                drugsMap.set(drugList[i].drug.id, drugList[i].quantity)
            }
        }
    })

    return Array.from(new Map([...drugsMap.entries()].sort((a, b) => b[1] - a[1])))
}

function getTopDrugsByValue(drugsLists) {
    let drugsMap = new Map();
    let obj = {}
    drugsLists.forEach((drugList) => {
        for (let i = 0; i < drugList.length; i++) {
            if (drugsMap.has(drugList[i].drug.id)) {
                obj = drugsMap.get(drugList[i].drug.id)
                obj.total += drugList[i].total
                obj.quantity += drugList[i].quantity
                drugsMap.set(drugList[i].drug.id, obj)
            } else {
                drugsMap.set(drugList[i].drug.id, {
                    name: drugList[i].name,
                    quantity: drugList[i].quantity,
                    total: drugList[i].total
                })
            }
        }
    })

    return Array.from(new Map([...drugsMap.entries()].sort((a, b) => b[1] - a[1])))
}

export {
    getTopDrugs,
    getTopDrugsByValue
}
