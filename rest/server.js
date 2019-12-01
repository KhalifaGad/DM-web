import express from 'express'
import {
    router
} from './v1/routes/router'
import fileUpload from 'express-fileupload'

var cors = require('cors')

const server = express()

let whiteList = ["http://localhost:8080"]

let corsOptions = {
    origin(origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

server.use(cors(corsOptions))

// for application/json requests
server.use(express.json())

// for application/x-www-form-urlencoded requests
server.use(express.urlencoded({
    extended: true
}))

/* server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json()); */
server.use(fileUpload())

server.use('/api/v1', router)

server.use('/static', express.static(__dirname + '/v1/routes/filez'))

server.listen(3000, () => {
    console.log('🚀 REST api is running on port 3000')
})