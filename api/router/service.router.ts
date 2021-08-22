import express from "express"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"
import config from "../../config"


const serviceRouter = express.Router()


serviceRouter
    .get('/health',
        errorHandlerFilter(
            (req, res) => res.sendStatus(200)))
    .get('/version',
        errorHandlerFilter(
            (req, res) => res.send(config.VERSION)))


export default serviceRouter
