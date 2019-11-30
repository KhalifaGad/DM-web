import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import 'cross-fetch/polyfill'

const apolloClient = new ApolloClient({
    uri: 'http://web:4000'
})

async function upsertAd(url, page) {

    try {
        const res = await apolloClient.mutate({
            mutation: gql `
                mutation ($url: String!, $page: Pages!){
                    upsertAd(
                        page: $page,
                        url: $url   
                    ){
                        url
                    }
                }`,
            variables: {
                url,
                page
            }
        });
        
        return res.data.upsertAd.url;

    } catch (error) {
        console.error(error);
        return error;
    }
}

export {
    upsertAd
}