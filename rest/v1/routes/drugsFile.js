import {
  Router
} from 'express'
import {
  fromXCL2JSON,
  drugsArrayProcessing,
  newDrugsArrayProcessing,
  refactorRequest
} from '../../utils/drugsFilehelpers'
import fs from 'fs'

const drugsFileRouter = Router()

drugsFileRouter.get('/', (req, res) => {
  res.send('drugsFileRouter')
})

// the file must have key = drugsFile
// storeId must exist in field 'id'
drugsFileRouter.post('/', (req, res) => {
  let resultArrays
console.log(req.body)
console.log('=========================================')
console.log(req.body.id) 
 let {
    drugsFile,
    storeId,
    filePath
  } = refactorRequest(req)
  drugsFile.mv(filePath, async (err) => {
    if (err) throw new Error(err)
    console.log("Successfully moved File.")
    let result = await fromXCL2JSON(filePath)
    resultArrays = await drugsArrayProcessing(result.Sheet1, storeId)
    res.send(resultArrays)
    fs.unlink(filePath, (err)=> {
      if(err) console.log(err)
      console.log('file removed')
    })
  })
})

drugsFileRouter.post('/new', (req, res) => {
  let resultArrays
  let {
    drugsFile,
    storeId,
    filePath
  } = refactorRequest(req)

  drugsFile.mv(filePath, async (err) => {
    if (err) console.log(err)
    console.log("Successfully moved File.")
    let result = await fromXCL2JSON(filePath)
    console.log(result.Sheet1[0].price)
    let storeInfoProvided = 
      result.Sheet1[0].price !== undefined? true : false
    resultArrays = await newDrugsArrayProcessing(result.Sheet1, 
        storeId, storeInfoProvided)
    res.send(resultArrays)
  })
})

export {
  drugsFileRouter
}
