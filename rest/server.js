import express from 'express'
import { router } from './v1/routes/router'
import fileUpload from 'express-fileupload'

var cors = require('cors')

const server = express()

server.use(cors())

// for application/json requests
server.use(express.json())

// for application/x-www-form-urlencoded requests
server.use(express.urlencoded({ extended: true }))

/* server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json()); */
server.use(fileUpload())

server.use('/api/v1', router)

server.use('/static',express.static(__dirname + '/v1/routes/filez'))

server.listen(3000, ()=> {
    console.log('🚀 REST api is running on port 3000')
})
