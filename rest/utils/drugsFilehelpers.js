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
            D: 'onlyCash'
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
        if (checkingData.data != null) {
            drugId = checkingData.data.drug.id
            isAdded2Store = await addDrug2Store(storeId, drugId, drugsArr[i].price,
                drugsArr[i].discount, drugsArr[i].onlyCash.toLowerCase())
            if (isAdded2Store.data) {
                successArr.push(drugsArr[i].name)
            } else {
                failureArr.push(drugsArr[i].name)
            }
        } else {
            notExistedArr.push(drugsArr[i].name)
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
    for (let i = 0; i < drugsArr.length; i++) {
        checkingData = await check4Drug(drugsArr[i].name)
        console.log(JSON.stringify(checkingData, 4))
        if (checkingData.data.drug == null) {
            if (storeInfoProvided) {
                let newDrugStoreInfo = {
                    storeId,
                    price: drugsArr[i].price,
                    discount: drugsArr[i].discount,
                    onlyCash: drugsArr[i].onlyCash.toLowerCase()
                }
                isAdded2Store = await
                createDrugAndAddStore(drugsArr[i].name, newDrugStoreInfo)

            } else {
                isAdded2Store = await
                createDrugAndAddStore(drugsArr[i].name)
            }

            if (isAdded2Store.data) {
                successArr.push(drugsArr[i].name)
            } else {
                failureArr.push(drugsArr[i].name)
            }
        } else {
            existedArr.push(drugsArr[i].name)
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

function addDrug2Store(storeId, drugId, price, discount, onlyCash) {
    return apolloClient.mutate({
            mutation: gql `
      mutation {
        addDrugtoStore(
            storeId: "${storeId}",
            drugId: "${drugId}",
            price: ${price},
            discount: ${discount},
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
    let drugsFile = req.files.drugsFile
    let storeId = req.body.id
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