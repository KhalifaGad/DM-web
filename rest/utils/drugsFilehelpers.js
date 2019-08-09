import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import 'cross-fetch/polyfill'
import excelToJson from 'convert-excel-to-json'
import fs from 'fs'

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
            A: 'name'
        }
    })

    return result
}
// save the store drugs with its data to the db drugs.
// if there is not drug with the same name send acknowledgment with 
//      drugs that may have similar name.
function drugsArrayProcessing(drugsArr, storeId) {
    let checkingData, drugId, isAdded2Store,
        successfulyAddedArr, failedAddedArr, notExistedDrugsArr
    for (drug in drugsArr) {
        checkingData = check4Drug(drug.name)
        if (checkingData != null) {
            drugId = checkingData.id
            isAdded2Store = addDrug2Store(storeId, drugId, drug.price,
                drug.discount, durg.onlyCash)
            if (isAdded2Store) {
                successfulyAddedArr.push(drug.name)
            } else {
                failedAddedArr.push(drug.name)
            }
        } else {
            notExistedDrugsArr.push(drug.name)
        }
        return {
            successfulyAddedArr,
            failedAddedArr,
            notExistedDrugsArr
        }
    }
}

function check4Drug(drugName) {
    let queryData
    apolloClient.query({
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
        .then(data => queryData = data.drug)
        .catch(error => console.error(error))

    return queryData
}

function addDrug2Store(storeId, drugId, price, discount, onlyCash) {
    let mutationData
    apolloClient.mutate({
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
        .then(data => mutationData = data.drug)
        .catch(error => console.error(error))
    return mutationData != null
}

export {
    fromXCL2JSON,
    drugsArrayProcessing
}