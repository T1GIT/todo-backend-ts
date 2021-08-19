import cors, { CorsOptions } from "cors"
import { ACCEPT_ORIGIN } from "../../environment"


export const corsOptions: CorsOptions = {
    origin: ACCEPT_ORIGIN,
    exposedHeaders: ['location'],
    maxAge: 60 * 60 * 24,
    credentials: true
}

const corsPlugin = cors(corsOptions)


export default corsPlugin
