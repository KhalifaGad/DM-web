import {
    Router
} from 'express'
import {
    addLogoURL
} from './../../utils/logoFileHelper'

const storeLogoRouter = Router()


storeLogoRouter.get('/', (req, res) => {
    res.send('storeLogoRouter')
})

// imageName = storeLogo
storeLogoRouter.post('/', (req, res) => {
    
    console.log(req)

	/* console.log(req.body)
    let storeLogo = req.files.storeLogo
    if (!storeLogo) {
        throw new Error('File not found in the request')
    }
    if (!storeLogo.name.match(/.(jpg|jpeg|png)$/i))
        throw new Error('File is not an image')
    let storeId = req.body.id
    let storeIdHyphenated = storeId + '-'
    
    let filePath = __dirname + '/filez/' + storeIdHyphenated +
        storeLogo.name
    storeLogo.mv(filePath, (err) => {
        if (err) throw new Error(err)
        console.log('logo successfully moved.')
        let added = addLogoURL(filePath, storeId)
        res.send({
            code: 200,
            message: 'Ok',
            added 
        })
    }) */
})

export {
    storeLogoRouter
}
