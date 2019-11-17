import express from 'express'
import { router } from './v1/routes/router'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'

var cors = require('cors')

const server = express()

server.use(cors())

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(fileUpload())

server.use('/api/v1', router)

server.listen(3000, ()=> {
    console.log('🚀 REST api is running on port 3000')
})
