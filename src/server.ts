require('dotenv').config();

import App from './app'
import * as bodyParser from 'body-parser'

import QrController from './controllers/qr.controller'

const app = new App({
    port: 443,
    controllers: [
        new QrController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
})

app.listen()