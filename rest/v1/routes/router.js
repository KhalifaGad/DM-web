import { Router } from 'express'
import { drugsFileRouter } from './drugsFile'
import { storeLogoRouter } from './storeIogo'

const router = Router()

router.get('/', (req, res)=> {
    res.send('Hey the router is working')
})

router.use('/drugs/files', drugsFileRouter)
router.use('/stores/logos', storeLogoRouter)

export { router }