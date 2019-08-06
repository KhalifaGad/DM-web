import {
  Router
} from 'express'
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import 'cross-fetch/polyfill'
import excelToJson from 'convert-excel-to-json'
import fs from 'fs'

const drugsFileRouter = Router()

const client = new ApolloClient({
  uri: 'http://web:4000'
})

drugsFileRouter.get('/', (req, res) => {
  res.send('drugsFileRouter')
})

// the file must have key = drugsFile
// storeId must exist in field 'id'
drugsFileRouter.post('/', (req, res) => {
  let drugsFile = req.files.drugsFile
  let storeId = req.body.id + '-'
  let filePath = __dirname + '/filez/' + storeId + drugsFile.name
  drugsFile.mv(filePath, (err) => {
    if (err) console.log(err)
    console.log("Successfully moved File.")
    let result = fromXCL2JSON(filePath)
    console.log(result.Sheet1)
  })


  res.send('drugsFileRouter')
})

function fromXCL2JSON(sourceFile){
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

export {
  drugsFileRouter
}

/*
console.log(req.body.id)
    fs.writeFile(__dirname + '/drugsFileXXX.json', JSON.stringify(result), function (err){
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });

    // console.log(JSON.stringify(result)) 

*/


/* client.query({
        query: gql`
          query {
            drugs {
              id
              name
            }
          }
        `
      })
        .then(data => console.log(data))
        .catch(error => console.error(error)); */