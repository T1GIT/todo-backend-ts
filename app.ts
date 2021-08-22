import { sequelize } from "./data"
import express from "express"
import { HOST, PORT } from "./environment"
import rootRouter from "./api/router"
import cookieParserPlugin from "./middleware/plugin/cookie-parser.plugin"
import bodyParserPlugin from "./middleware/plugin/body-parser.plugin"
import corsPlugin from "./middleware/plugin/cors.plugin"
import errorHandlerPlugin from "./middleware/plugin/error-handler.plugin"
import serviceRouter from "./api/router/service.router"
import config from "./config"


const app = express()

// Plugins
app.use(cookieParserPlugin, bodyParserPlugin, corsPlugin)

// Routes
app.use('/', serviceRouter)
app.use(`/api/${config.VERSION}/`, rootRouter)

// Error handler
app.use(errorHandlerPlugin)

// Run
async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Database has been connected')
        await app.listen(parseInt(PORT), HOST)
        console.log(`Server is listening on address http://${HOST}:${PORT}`)
    } catch (e) {
        await sequelize.close()
        console.error(e)
    }
}

start().then(() => console.log('App has been started'))
