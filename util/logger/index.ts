import winston, { format, transports } from "winston"
import config from "./config"


const logger = winston.createLogger(winston.createLogger({
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm' }),
        format.prettyPrint()
    ),
    transports: [
        new transports.File({
            filename: 'error' + config.EXT,
            dirname: config.DIR
        })
    ]
}))


export default logger
