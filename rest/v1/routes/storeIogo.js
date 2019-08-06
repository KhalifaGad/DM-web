import { Router } from 'express'

const storeLogoRouter = Router()


storeLogoRouter.get('/', (req, res)=> {
    res.send('storeLogoRouter')
})

export { storeLogoRouter } 