import { sequelize } from "./data"
import express from "express"
import { cookieParserPlugin, bodyParserPlugin, corsPlugin, errorHandlerPlugin } from "./middleware/plugin"
import { PORT, HOST, VERSION } from "./environment"
import User from "./data/model/User"
import Session from "./data/model/Session"
import _ from "lodash"

// const router = require('./api/router')


const app = express()

// Plugins
app.use(cookieParserPlugin, bodyParserPlugin, corsPlugin)

// Routes
// app.use(`/api/${VERSION}/`, router)

// Error handler
app.use(errorHandlerPlugin)

// Run
async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({force: true})
        console.log('Database has been connected')
        await app.listen(parseInt(PORT), HOST)
        console.log(`Server is listening on address http://${HOST}:${PORT}`)
    } catch (e) {
        await sequelize.close()
        console.error(e)
    }
}

start().then(() => console.log('App has been started'))
