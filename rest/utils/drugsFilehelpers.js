import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import 'cross-fetch/polyfill'
import excelToJson from 'convert-excel-to-json'

const apolloClient = new ApolloClient({
    uri: 'http://web:4000'
})

function fromXCL2JSON(sourceFile) {
    let result = excelToJson({
        sourceFile,
        header: {
            rows: 1
        },
        columnToKey: {
            A: 'name',
            B: 'price',
            C: 'discount',
            D: 'deferredDiscount',
            E: 'onlyCash'
        }
    })
    return result
}
// save the store drugs with its data to the db drugs.
// if there is not drug with the same name send acknowledgment with 
//      drugs that may have similar name.
async function drugsArrayProcessing(drugsArr, storeId) {
    let checkingData,
        drugId, isAdded2Store,
        successArr = [],
        failureArr = [],
        notExistedArr = []
    for (let i = 0; i < drugsArr.length; i++) {
        checkingData = await check4Drug(drugsArr[i].name)
        if (checkingData.data.drug != null) {
            drugId = checkingData.data.drug.id
            isAdded2Store = await addDrug2Store(storeId, drugId, drugsArr[i].price,
                drugsArr[i].discount, drugsArr[i].deferredDiscount, drugsArr[i].onlyCash.toLowerCase())
            if (isAdded2Store.data) {
                successArr.push(drugsArr[i])
            } else {
                failureArr.push(drugsArr[i])
            }
        } else {
            notExistedArr.push(drugsArr[i])
        }
    }
    return {
        successArr,
        failureArr,
        notExistedArr
    }
}
//createDrugAndAddStore
async function newDrugsArrayProcessing(drugsArr, storeId, storeInfoProvided) {
    let checkingData,
        isAdded2Store,
        successArr = [],
        failureArr = [],
        existedArr = []
    let drugName
    console.log('hitted')
    for (let i = 0; i < drugsArr.length; i++) {
        drugName = drugsArr[i].name.replace(/[^a-zA-Z0-9- ]/g, "").replace(/\s+/g, ' ').trim()

        if (drugName === '') {
            continue;
        }
        checkingData = await check4Drug(drugName)

        if (checkingData.data.drug == null) {
            if (storeInfoProvided) {
                let newDrugStoreInfo = {
                    storeId,
                    price: drugsArr[i].price,
                    discount: drugsArr[i].discount,
                    deferredDiscount: drugsArr[i].deferredDiscount,
                    onlyCash: drugsArr[i].onlyCash.toLowerCase()
                }
                isAdded2Store = await
                createDrugAndAddStore(drugName, newDrugStoreInfo)

            } else {
                isAdded2Store = await
                createDrugAndAddStore(drugName)
            }

            if (isAdded2Store.data) {
                successArr.push(drugName)
            } else {
                failureArr.push(drugName)
            }
        } else {
            existedArr.push(drugName)
        }
    }
    return {
        successArr,
        failureArr,
        existedArr
    }
}

function check4Drug(drugName) {
    return apolloClient.query({
            query: gql `
          query {
            drug(drugQueryInput: {
                name: "${drugName}"
            }){
              id
              name
            }
          }
        `
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
            return error
        })
}

function addDrug2Store(storeId, drugId, price, discount, deferredDiscount = 0, onlyCash) {
    return apolloClient.mutate({
            mutation: gql `
      mutation {
        addDrugtoStore(
            storeId: "${storeId}",
            drugId: "${drugId}",
            price: ${price},
            discount: ${discount},
	        deferredDiscount: ${deferredDiscount},
            onlyCash: ${onlyCash}
        ){
          id
        }
      }
    `
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
            return error
        })
}

function createDrugAndAddStore(name, newDrugStoreInfo = null) {

    if (newDrugStoreInfo) {
        newDrugStoreInfo = JSON.stringify(newDrugStoreInfo)
    }

    return apolloClient.mutate({
            mutation: gql `
      mutation {
        addDrug(
            name: "${name}",
            newDrugStoreInfo: ${newDrugStoreInfo}
        )
      }
    `
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error)
            return error
        })
}

function refactorRequest(req) {
    console.log(req.body)
    console.log(req.body.id)
    let drugsFile = req.files.drugsFile
    let storeId
    if (req.body.id) {
        storeId = req.body.id
    } else {
        console.log('XXXXXXXXxxxxxx test faild')
        throw new Error('id not found')
        return
    }
    let storeIdHyphenated = storeId + '-'
    let filePath = __dirname + '/../v1/routes/filez/' + storeIdHyphenated +
        drugsFile.name

    return {
        drugsFile,
        storeId,
        filePath
    }
}


export {
    fromXCL2JSON,
    drugsArrayProcessing,
    newDrugsArrayProcessing,
    refactorRequest
}