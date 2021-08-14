const bodyParser = require('./middleware/plugins/body-parser.plugin')
const corsConfig = require('./middleware/plugins/cors.plugin')
const cookieParser = require('./middleware/plugins/cookie-parser.plugin')
const errorHandler = require('./middleware/plugins/error-handler.plugin')
const router = require('./api/router')
const env = require('./environment')


import express from 'express'
import { cloudManager } from './data/manager'


const app = express()

// Plugins
app.use(cookieParser, bodyParser, corsConfig)

// Routes
app.use(`/api/${ env.VERSION }/`, router)

// Error handler
app.use(errorHandler)

// Run
async function start() {
    try {
        await cloudManager.connect()
        console.log('Database is connected')
        await app.listen(env.PORT, env.HOST)
        console.log(`Server is listening on address http://${ env.HOST }:${ env.PORT }`)
    } catch (e) {
        console.error(e)
    }
}

start().then(() => console.log('App has been started'))
