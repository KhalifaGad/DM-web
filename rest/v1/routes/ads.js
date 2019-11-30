import {
    Router
} from 'express'
import {
    upsertAd
} from '../../utils/adsHelper'

const adsRouter = Router()

adsRouter.post('/main-ad', (req, res, next) => {

    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'MAIN')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})

adsRouter.post('/home-ad', (req, res, next) => {
    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'HOME')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})

adsRouter.post('/profile-ad', (req, res, next) => {
    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'PROFILE')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})

adsRouter.post('/drug-ad', (req, res, next) => {
    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'DRUG')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})

adsRouter.post('/settings-ad', (req, res, next) => {
    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'SETTINGS')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})

adsRouter.post('/contact-us-ad', (req, res, next) => {
    let adFile = req.files.ad

    if (!adFile) {
        next(new Error('Error: File missing'))
    }

    if (!adFile.name.match(/.(jpg|jpeg|png)$/i))
        next(new Error('Error: File incompatible'))

    let uniqueName = Date.now() + '-' + adFile.name
    let filePath = __dirname + '/filez/' + uniqueName

    adFile.mv(filePath, async (err) => {
        if (err) next(new Error('Error: moving file, ' + err))
        console.log('logo successfully moved.')
        let url = await upsertAd('/static/' + uniqueName, 'CONTACTUS')
        res.send({
            code: 200,
            message: 'Ok',
            url
        })
    })
})


export {
    adsRouter
}