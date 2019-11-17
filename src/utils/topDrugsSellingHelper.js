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
    let oldValue = 0,
        newValue = 0;
    drugsLists.forEach((drugList) => {
        for (let i = 0; i < drugList.length; i++) {
            if (drugsMap.has(drugList[i].drug.id)) {
                oldValue = drugsMap.get(drugList[i].drug.id)
                newValue = oldValue + drugList[i].total
                drugsMap.set(drugList[i].drug.id, newValue)
            } else {
                drugsMap.set(drugList[i].drug.id, drugList[i].total)
            }
        }
    })

    return Array.from(new Map([...drugsMap.entries()].sort((a, b) => b[1] - a[1])))
}

export {
    getTopDrugs,
    getTopDrugsByValue
}
