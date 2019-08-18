import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import 'cross-fetch/polyfill'

const apolloClient = new ApolloClient({
    uri: 'http://web:4000'
})

function addLogoURL(filePath, storeId) {
    console.log(filePath)
    return apolloClient.mutate({
            mutation: gql `
                mutation {
                    addStoreLogoURL(
                        storeId: "${storeId}",
                        url: "${filePath}"   
                    ){
                        logoURL
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

export { addLogoURL }